---
type: concept
title: Focused UI State
description: The current actionable portion of interface state that an agent reads before transforming it.
tags: [ui-state, focus, agents, interface, data]
id: focused-ui-state
parent: data
group: infrastructure
groupLabel: Data
order: 2
edge: The agent does not need the whole system, only the focused actionable state.
relations:
  - target: toon-ui-state
    label: compresses into
  - target: unified-editable-ui
    label: is selected within
---
# Focused UI State

Focused UI state is the part of the computer that currently matters.

It includes what the user is looking at, which object is selected, what values are visible, what actions are available, what permissions apply, and what the user is trying to change.

The agent does not need to swallow the whole operating system. It needs the focused state, compressed into a form it can reason over, then transformed into the next useful interface.
