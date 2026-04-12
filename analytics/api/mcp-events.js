/**
 * Animotion MCP Analytics
 *
 * POST /api/mcp-events  — receive events from animotion-mcp servers
 * GET  /api/mcp-events  — view aggregated stats as JSON
 *
 * Storage: Upstash Redis via REST API (no npm package needed).
 * Set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN via Vercel Marketplace.
 * Without those env vars, events are only logged to Vercel's built-in log drain.
 */

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// ── Redis helpers (raw REST — no SDK dependency) ──

async function redis(...args) {
  if (!REDIS_URL || !REDIS_TOKEN) return null;
  const res = await fetch(`${REDIS_URL}/${args.map(encodeURIComponent).join('/')}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
  });
  const json = await res.json();
  return json.result ?? null;
}

async function incr(key) {
  return redis('INCR', key);
}

async function hincrby(hash, field, amount = 1) {
  return redis('HINCRBY', hash, field, String(amount));
}

async function hgetall(hash) {
  const result = await redis('HGETALL', hash);
  if (!result || !Array.isArray(result)) return {};
  const out = {};
  for (let i = 0; i < result.length; i += 2) out[result[i]] = result[i + 1];
  return out;
}

async function get(key) {
  return redis('GET', key);
}

// ── Ingest ──

async function handlePost(req, res) {
  let body;
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    body = JSON.parse(Buffer.concat(chunks).toString());
  } catch {
    res.status(400).json({ error: 'invalid json' });
    return;
  }

  const { event, version, node, tool, ok, error: errMsg, animations, icons, totalCalls, callCounts, errorCounts } = body;

  // Always log to Vercel's built-in log drain (visible in dashboard)
  console.log(JSON.stringify({ event, version, node, tool, ok, error: errMsg, ts: new Date().toISOString() }));

  if (!REDIS_URL) {
    res.status(200).json({ ok: true, storage: 'log-only' });
    return;
  }

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  try {
    if (event === 'startup') {
      await Promise.all([
        incr('stats:startups:total'),
        incr(`stats:startups:daily:${today}`),
        version && hincrby('stats:versions', version),
        node && hincrby('stats:node_versions', node),
      ]);
    }

    if (event === 'tool_call') {
      await Promise.all([
        incr('stats:tool_calls:total'),
        incr(`stats:tool_calls:daily:${today}`),
        tool && hincrby('stats:tool_calls:by_tool', tool),
        (!ok && tool) && hincrby('stats:tool_errors:by_tool', tool),
        (!ok && tool && errMsg) && hincrby('stats:tool_errors:messages', `${tool}:${errMsg.slice(0, 80)}`),
      ]);
    }

    if (event === 'tool_error') {
      // unexpected throw (not a user-facing error response)
      await Promise.all([
        incr('stats:exceptions:total'),
        tool && hincrby('stats:exceptions:by_tool', tool),
      ]);
    }

    if (event === 'session_end' && totalCalls) {
      await Promise.all([
        incr('stats:sessions:total'),
        hincrby('stats:sessions:total_calls', 'sum', totalCalls),
      ]);
    }
  } catch (e) {
    console.error('redis write failed:', e.message);
  }

  res.status(200).json({ ok: true });
}

// ── Stats viewer ──

async function handleGet(req, res) {
  if (!REDIS_URL) {
    res.status(200).json({ message: 'No Redis configured. Events are only logged to Vercel logs.', setup: 'Add Upstash Redis via Vercel Marketplace and set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN.' });
    return;
  }

  try {
    const [
      startups,
      toolCallsTotal,
      exceptionsTotal,
      sessionsTotal,
      toolCallsByTool,
      toolErrorsByTool,
      topErrorMessages,
      versions,
      nodeVersions,
      sessionsTotalCalls,
    ] = await Promise.all([
      get('stats:startups:total'),
      get('stats:tool_calls:total'),
      get('stats:exceptions:total'),
      get('stats:sessions:total'),
      hgetall('stats:tool_calls:by_tool'),
      hgetall('stats:tool_errors:by_tool'),
      hgetall('stats:tool_errors:messages'),
      hgetall('stats:versions'),
      hgetall('stats:node_versions'),
      hgetall('stats:sessions:total_calls'),
    ]);

    // Top errors sorted by frequency
    const topErrors = Object.entries(topErrorMessages)
      .map(([msg, count]) => ({ msg, count: Number(count) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    const stats = {
      generated: new Date().toISOString(),
      lifetime: {
        startups: Number(startups) || 0,
        tool_calls: Number(toolCallsTotal) || 0,
        sessions: Number(sessionsTotal) || 0,
        exceptions: Number(exceptionsTotal) || 0,
        avg_calls_per_session: sessionsTotal > 0
          ? Math.round((Number(sessionsTotalCalls.sum) || 0) / Number(sessionsTotal))
          : null,
      },
      tool_calls: Object.fromEntries(
        Object.entries(toolCallsByTool).map(([k, v]) => [k, Number(v)])
      ),
      tool_errors: Object.fromEntries(
        Object.entries(toolErrorsByTool).map(([k, v]) => [k, Number(v)])
      ),
      top_errors: topErrors,
      versions: Object.fromEntries(
        Object.entries(versions).map(([k, v]) => [k, Number(v)])
      ),
      node_versions: Object.fromEntries(
        Object.entries(nodeVersions).map(([k, v]) => [k, Number(v)])
      ),
    };

    res.status(200).json(stats);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

// ── Vercel handler ──

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method === 'POST')    { await handlePost(req, res); return; }
  if (req.method === 'GET')     { await handleGet(req, res); return; }

  res.status(405).json({ error: 'Method not allowed' });
}
