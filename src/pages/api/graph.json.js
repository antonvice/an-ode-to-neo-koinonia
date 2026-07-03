import { createNode, getGraph, updateEdge, updateNode } from '../../lib/graph-okf.js';

export const prerender = false;

function json(body, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'content-type': 'application/json' },
	});
}

export async function GET() {
	return json(getGraph());
}

export async function POST({ request }) {
	const payload = await request.json();
	try {
		if (payload.type === 'node') updateNode(payload);
		else if (payload.type === 'edge') updateEdge(payload);
		else if (payload.type === 'create-node') payload.id = createNode(payload);
		else return json({ ok: false, error: 'Unknown graph operation' }, 400);

		return json({ ok: true, graph: getGraph(), id: payload.id });
	} catch (error) {
		return json({ ok: false, error: error.message }, 400);
	}
}
