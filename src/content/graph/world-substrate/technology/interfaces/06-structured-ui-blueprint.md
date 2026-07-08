---
type: concept
title: Structured UI Blueprint
description: The safe declarative interface description an agent sends instead of executable UI code.
tags: [a2ui, ui, schema, safety, interface]
id: structured-ui-blueprint
parent: interfaces
group: infrastructure
groupLabel: Interfaces
order: 6
edge: A structured blueprint lets the host render agent-generated interface safely.
relations:
  - target: a2ui-agent-to-user-interface
    label: is emitted by
  - target: unified-editable-ui
    label: renders as
---
# Structured UI Blueprint

A structured UI blueprint is the safe middle layer between agent reasoning and visible interface.

The agent does not send arbitrary code. It sends a description: which trusted components to show, what values they contain, what actions they expose, and what confirmations are required.

The host application remains responsible for rendering, permission checks, and execution. The model proposes a shape; the system decides what can safely become real.
