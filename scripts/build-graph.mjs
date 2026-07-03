import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { getGraph } from '../src/lib/graph-okf.js';

const root = process.cwd();
const dataDir = path.join(root, 'src/data');
const publicDataDir = path.join(root, 'public/data');
const graph = getGraph();
const payload = `${JSON.stringify(graph, null, 2)}\n`;

await mkdir(dataDir, { recursive: true });
await mkdir(publicDataDir, { recursive: true });
await writeFile(path.join(dataDir, 'graph.json'), payload);
await writeFile(path.join(publicDataDir, 'graph.json'), payload);

console.log(`Built ${graph.nodes.length} nodes and ${graph.edges.length} edges from OKF.`);
