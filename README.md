# An Ode to Neo-Koinonia

An interactive Astro knowledge graph for a philosophy of future society: LLM operating systems, invisible harnesses, post-software institutions, robot embodiment, ledgers, governance, and the new shared life between humans and synthetic twins.

## Stack

- Astro for the static site.
- OKF markdown files in `src/content/graph` as the editable source of truth.
- Three.js for the animated fractal graph.
- Generated JSON at `src/data/graph.json` for the browser.
- Astro API routes that edit the OKF bundle directly during local development.

## Commands

```sh
npm install
npm run dev
npm run build
npm run graph
```

`npm run graph` rebuilds the JSON artifacts from the OKF markdown bundle. Runtime edits in the app save directly to the files in `src/content/graph`, so the bundle remains the durable source of truth.

## Content Workflow

Add or edit Markdown files in `src/content/graph`. Each file needs frontmatter:

```md
---
type: Graph Concept
id: my-node
title: My Node
parent: parent-node
group: knowledge
groupLabel: Knowledge
order: 1
edge: The relationship text shown when the edge is selected.
---
Node body text goes here.
```

Run `npm run graph` to rebuild the JSON artifacts without starting the site.

## Editor

Open the gear button in the top controls and enter `neo` to unlock the local editor. You can edit the selected node or edge title, color, and text, then save to the OKF bundle. You can also create a child node under the selected node.
