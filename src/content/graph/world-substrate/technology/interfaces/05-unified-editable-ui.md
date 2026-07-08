---
type: concept
title: Unified Editable UI
description: A single editable interface layer that agents can read, transform, and re-render across applications.
tags: [ui, agents, a2ui, interface, operating-system]
id: unified-editable-ui
parent: interfaces
group: infrastructure
groupLabel: Interfaces
order: 5
edge: A unified editable UI turns the screen into a mutable surface around the current task.
relations:
  - target: focused-ui-state
    label: exposes
  - target: toon-ui-state
    label: is serialized as
  - target: operating-system
    label: overlays
  - target: post-os-agent-computer
    label: becomes native in
---
# Unified Editable UI

The future interface may not be a collection of apps.

It may be a unified editable surface that the user can point at, speak to, look at, or eventually think toward. The agent reads the focused UI state, converts it into a compact machine-readable representation, performs the requested operation, and returns a new interface.

This changes the role of UI.

The interface is no longer a fixed product designed by one company. It becomes a temporary negotiated surface between user intention, available data, permissions, and agent capability. The user can click, speak, gesture, or look. The agent can recompose the interface around the current task.

In this model, the screen is not an app launcher. It is a mutable window into the current state of intelligence.

The main question becomes: what data is being retrieved, from where, under what permission, and with what verification?
