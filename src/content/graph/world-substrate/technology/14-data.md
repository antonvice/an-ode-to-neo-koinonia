---
type: concept
title: Data
description: The state and memory layer that agents read, transform, verify, and re-render as interface.
tags: [data, ui-state, memory, agents, retrieval]
id: data
parent: technology
group: infrastructure
groupLabel: Technology
order: 14
edge: Data becomes the substrate that agents transform into action and interface.
relations:
  - target: storage
    label: lives in
  - target: toon-ui-state
    label: can become
---
# Data

Data is no longer only something a human views through an application.

In an agentic system, data is state to be read, permissioned, transformed, verified, and re-rendered. The interface becomes one possible view of that state, not the permanent container for it.

The new question is not only where the data is stored. It is what portion of the state is relevant, what actions are permitted, and how the agent can represent it compactly enough to reason over it.
