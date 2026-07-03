import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

export const palette = {
	root: '#f2efe6',
	individual: '#7dd3fc',
	society: '#f97316',
	embodiment: '#bef264',
	economy: '#facc15',
	governance: '#c084fc',
	knowledge: '#f0abfc',
	infrastructure: '#5eead4',
};

const OKF_TYPE = 'concept';

function contentDir() {
	return path.join(process.cwd(), 'src/content/graph');
}

function escapeHtml(value) {
	return String(value)
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#039;');
}

export function markdownToHtml(markdown = '') {
	return markdown
		.trim()
		.split(/\n{2,}/)
		.filter(Boolean)
		.map((block) => `<p>${escapeHtml(block).replace(/\n/g, ' ').trim()}</p>`)
		.join('\n');
}

export function slugify(value) {
	return String(value)
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
}

function readMarkdownFiles(dir) {
	const entries = readdirSync(dir, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) files.push(...readMarkdownFiles(fullPath));
		if (entry.isFile() && entry.name.endsWith('.md')) files.push(fullPath);
	}
	return files;
}

function parseMarkdownFile(filePath) {
	const raw = readFileSync(filePath, 'utf8');
	const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
	if (!match) throw new Error(`Missing frontmatter in ${filePath}`);

	const data = YAML.parse(match[1]) || {};
	const body = match[2].trim();
	const group = data.group || 'root';
	const title = data.title || path.basename(filePath, '.md');
	const id = data.id || slugify(title);

	return {
		filePath,
		frontmatter: { ...data, type: data.type || OKF_TYPE, id, title },
		id,
		title,
		description: data.description || '',
		tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
		parent: data.parent || null,
		group,
		groupLabel: data.groupLabel || group || 'Root',
		color: data.color || palette[group] || '#f2efe6',
		order: Number(data.order || 0),
		edge: data.edge || `A branch from ${data.parent || 'root'} to ${title}.`,
		edgeTitle: data.edgeTitle,
		edgeColor: data.edgeColor,
		relations: Array.isArray(data.relations) ? data.relations : [],
		body,
		html: markdownToHtml(body),
	};
}

function loadConcepts() {
	return readMarkdownFiles(contentDir()).map(parseMarkdownFile);
}

function calculateGraph(concepts) {
	const nodesById = new Map(concepts.map((node) => [node.id, node]));
	const roots = concepts.filter((node) => !node.parent);
	if (roots.length !== 1) throw new Error(`Expected one root node, found ${roots.length}`);

	function depthOf(node) {
		if (!node.parent) return 0;
		const parent = nodesById.get(node.parent);
		if (!parent) throw new Error(`Missing parent ${node.parent} for ${node.id}`);
		return depthOf(parent) + 1;
	}

	function pathOf(node) {
		if (!node.parent) return [node.title];
		return [...pathOf(nodesById.get(node.parent)), node.title];
	}

	const groupedByParent = new Map();
	for (const node of concepts) {
		if (!node.parent) continue;
		if (!groupedByParent.has(node.parent)) groupedByParent.set(node.parent, []);
		groupedByParent.get(node.parent).push(node);
	}
	for (const group of groupedByParent.values()) {
		group.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
	}

	const nodes = concepts
		.map((node) => ({
			id: node.id,
			title: node.title,
			description: node.description,
			tags: node.tags,
			parent: node.parent,
			level: depthOf(node),
			group: node.group,
			groupLabel: node.groupLabel,
			color: node.color,
			order: node.order,
			body: node.body,
			html: node.html,
			path: pathOf(node),
			angle: 0,
		}))
		.sort((a, b) => a.level - b.level || a.order - b.order || a.title.localeCompare(b.title));

	const graphNodesById = new Map(nodes.map((node) => [node.id, node]));
	const maxOrderByLevel = new Map();
	nodes.forEach((node) => {
		const current = maxOrderByLevel.get(node.level) || 0;
		maxOrderByLevel.set(node.level, Math.max(current, node.order));
	});

	nodes.forEach((node) => {
		if (node.level === 0) {
			node.angle = 0;
			return;
		}
		const siblings = groupedByParent.get(node.parent) || [];
		const siblingCount = siblings.length || 1;
		const siblingIndex = siblings.findIndex((child) => child.id === node.id);
		const parentAngle = graphNodesById.get(node.parent)?.angle ?? ((node.order / (maxOrderByLevel.get(node.level) + 1)) * Math.PI * 2);
		const spread = Math.max(0.55, Math.PI / Math.max(2, node.level + 1));
		node.angle = parentAngle + (siblingIndex - (siblingCount - 1) / 2) * (spread / Math.max(1, siblingCount - 1 || 1));
		graphNodesById.set(node.id, node);
	});

	const treeEdges = nodes
		.filter((node) => node.parent)
		.map((node) => {
			const concept = nodesById.get(node.id);
			const parent = graphNodesById.get(node.parent);
			const title = concept.edgeTitle || `${parent.title} -> ${node.title}`;
			const body = concept.edge || `A branch from ${parent.title} to ${node.title}.`;
			return {
				id: `${node.parent}--${node.id}`,
				source: node.parent,
				target: node.id,
				title,
				color: concept.edgeColor || node.color,
				body,
				html: markdownToHtml(body),
				label: body,
			};
		});
	const relationEdges = concepts.flatMap((concept) =>
		concept.relations
			.filter((relation) => relation?.target && graphNodesById.has(relation.target))
			.map((relation) => {
				const source = graphNodesById.get(concept.id);
				const target = graphNodesById.get(relation.target);
				const label = String(relation.label || relation.title || 'relates to').trim();
				const title = relation.title || `${source.title} ${label} ${target.title}`;
				return {
					id: `rel:${concept.id}--${relation.target}:${slugify(label) || 'relation'}`,
					source: concept.id,
					target: relation.target,
					title,
					color: relation.color || target.color || source.color,
					body: relation.body || label,
					html: markdownToHtml(relation.body || label),
					label,
					relation: true,
				};
			})
	);
	const edges = [...treeEdges, ...relationEdges];

	return { nodes, edges };
}

function writeConcept(concept, body) {
	const frontmatter = {
		type: concept.frontmatter.type || OKF_TYPE,
		id: concept.id,
		title: concept.title,
		...concept.frontmatter,
	};
	writeFileSync(concept.filePath, `---\n${YAML.stringify(frontmatter).trim()}\n---\n${String(body).trim()}\n`, 'utf8');
}

function readStore() {
	const concepts = loadConcepts();
	return {
		concepts,
		graph: calculateGraph(concepts),
		byId: new Map(concepts.map((concept) => [concept.id, concept])),
	};
}

export function getGraph() {
	return readStore().graph;
}

export function updateNode(data) {
	const { byId } = readStore();
	const existing = byId.get(data.id);
	if (!existing) throw new Error('Node not found');

	const group = String(data.group || existing.group || 'root').trim();
	const body = String(data.body ?? existing.body ?? '');
	const tags = Array.isArray(data.tags)
		? data.tags.map(String).map((tag) => tag.trim()).filter(Boolean)
		: String(data.tags ?? existing.tags?.join(',') ?? '')
				.split(',')
				.map((tag) => tag.trim())
				.filter(Boolean);
	const updated = {
		...existing,
		title: String(data.title || existing.title).trim(),
		frontmatter: {
			...existing.frontmatter,
			type: existing.frontmatter.type || OKF_TYPE,
			title: String(data.title || existing.title).trim(),
			description: String(data.description ?? existing.description ?? '').trim(),
			tags,
			group,
			groupLabel: String(data.groupLabel || existing.groupLabel || group).trim(),
			color: String(data.color || existing.color || palette[group] || '#f2efe6').trim(),
		},
	};
	writeConcept(updated, body);
}

export function updateEdge(data) {
	if (String(data.id || '').startsWith('rel:')) {
		updateRelationEdge(data);
		return;
	}
	const [, target] = String(data.id || '').split('--');
	const { byId } = readStore();
	const existing = byId.get(target);
	if (!existing) throw new Error('Edge not found');

	const body = String(data.body ?? existing.edge ?? '');
	const updated = {
		...existing,
		frontmatter: {
			...existing.frontmatter,
			type: existing.frontmatter.type || OKF_TYPE,
			edgeTitle: String(data.title || existing.edgeTitle || '').trim() || undefined,
			edgeColor: String(data.color || existing.edgeColor || existing.color || '#f2efe6').trim(),
			edge: body,
		},
	};
	writeConcept(updated, existing.body);
}

function parseRelationId(id) {
	const match = String(id || '').match(/^rel:(.+)--(.+):(.+)$/);
	if (!match) return null;
	return { source: match[1], target: match[2], labelSlug: match[3] };
}

function updateRelationEdge(data) {
	const relationId = parseRelationId(data.id);
	if (!relationId) throw new Error('Relation not found');
	const { byId } = readStore();
	const existing = byId.get(relationId.source);
	if (!existing) throw new Error('Relation source not found');
	const relations = [...existing.relations];
	const index = relations.findIndex(
		(relation) => relation.target === relationId.target && (slugify(relation.label || relation.title || 'relation') || 'relation') === relationId.labelSlug
	);
	if (index === -1) throw new Error('Relation not found');
	relations[index] = {
		...relations[index],
		title: String(data.title || relations[index].title || '').trim() || undefined,
		color: String(data.color || relations[index].color || existing.color || '#f2efe6').trim(),
		body: String(data.body ?? relations[index].body ?? relations[index].label ?? ''),
	};
	const updated = {
		...existing,
		frontmatter: {
			...existing.frontmatter,
			relations,
		},
	};
	writeConcept(updated, existing.body);
}

function childDirectory(parentFilePath, parentId) {
	const base = path.basename(parentFilePath, '.md');
	if (base === 'index') return path.dirname(parentFilePath);
	return path.join(path.dirname(parentFilePath), base.replace(/^\d+-/, '') || parentId);
}

function nextOrderForParent(parentId, concepts) {
	const siblingOrders = concepts.filter((concept) => concept.parent === parentId).map((concept) => concept.order);
	return Math.max(0, ...siblingOrders) + 1;
}

function nextFilePath(parent, id, order) {
	const dir = childDirectory(parent.filePath, parent.id);
	mkdirSync(dir, { recursive: true });
	let filePath = path.join(dir, `${String(order).padStart(2, '0')}-${id}.md`);
	let suffix = 2;
	while (existsSync(filePath)) filePath = path.join(dir, `${String(order).padStart(2, '0')}-${id}-${suffix++}.md`);
	return filePath;
}

export function createNode(data) {
	const { concepts, byId } = readStore();
	const parentId = String(data.parent || 'neo-koinonia').trim();
	const parent = byId.get(parentId);
	if (!parent) throw new Error('Parent node not found');

	const title = String(data.title || 'Untitled Node').trim();
	const base = slugify(data.id || title) || 'node';
	let id = base;
	let suffix = 2;
	while (byId.has(id)) id = `${base}-${suffix++}`;

	const group = String(data.group || parent.group || 'knowledge').trim();
	const order = nextOrderForParent(parentId, concepts);
	const body = String(data.body || 'Describe this branch.');
	const edgeBody = String(data.edgeBody || `A new branch from ${parent.title} to ${title}.`);
	const filePath = nextFilePath(parent, id, order);
	const tags = Array.isArray(data.tags)
		? data.tags.map(String).map((tag) => tag.trim()).filter(Boolean)
		: String(data.tags || '')
				.split(',')
				.map((tag) => tag.trim())
				.filter(Boolean);
	const frontmatter = {
		type: OKF_TYPE,
		id,
		title,
		description: String(data.description || '').trim(),
		tags,
		parent: parentId,
		group,
		groupLabel: String(data.groupLabel || parent.groupLabel || group).trim(),
		order,
		color: String(data.color || palette[group] || parent.color || '#f2efe6').trim(),
		edge: edgeBody,
		timestamp: new Date().toISOString(),
	};

	writeConcept({ id, title, filePath, frontmatter }, body);
	return id;
}
