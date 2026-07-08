---
type: concept
title: TOON UI State
description: A compact textual representation of focused UI state for agent processing.
tags: [toon, ui-state, agents, data-format, interface]
id: toon-ui-state
parent: data
group: infrastructure
groupLabel: Data
order: 1
edge: Focused UI state becomes compact prompt substrate for the agent.
relations:
  - target: unified-editable-ui
    label: describes
  - target: minimal-model-kernel
    label: feeds
---
# TOON UI State

Agents need to read interfaces without drowning in irrelevant structure.

JSON is universal, but it can become bloated. Screens contain hierarchy, labels, values, actions, permissions, focus, selection, and user intent. Passing all of this to a model as raw UI state can waste tokens and obscure meaning.

A compact format such as TOON can represent the focused interface as structured text: what the user is looking at, what can be changed, what actions are available, what data is visible, and what constraints apply.

The focused UI becomes the prompt substrate.

The agent does not need the whole operating system. It needs the current actionable state. From that state, it can decide what to retrieve, what to change, what to ask, and what interface to return.
