---
type: concept
title: System Calls
description: Direct operation requests that let agents bypass human-facing application layers.
tags: [system-calls, os, agents, kernel, tools]
id: system-calls
parent: operating-system
group: infrastructure
groupLabel: Operating System
order: 6
edge: Agents move from clicking UI to requesting underlying system operations.
relations:
  - target: kernel-level-agent-substrate
    label: descend into
  - target: tool-contracts
    label: formalize
---
# System Calls

System calls are the point where agentic computing stops pretending to be a human at a screen.

Instead of moving a cursor through menus, the agent requests the underlying operation: read this file, write this state, render this view, move this data, open this channel, confirm this action.

This requires a permission model stronger than ordinary automation. Direct access is powerful only if the system can constrain, audit, and revoke it.
