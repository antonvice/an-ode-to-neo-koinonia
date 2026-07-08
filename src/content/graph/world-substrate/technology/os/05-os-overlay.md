---
type: concept
title: OS Overlay
description: The first stage of LLMOS, where an agent layer watches and manipulates the existing operating system.
tags: [os, overlay, agents, llmos, interface]
id: os-overlay
parent: operating-system
group: infrastructure
groupLabel: Operating System
order: 5
edge: The agent first appears as an overlay on top of the old operating system.
relations:
  - target: llmos-operating-system
    label: is early form of
  - target: system-calls
    label: gives way to
---
# OS Overlay

The first agentic operating system is not a new kernel. It is an overlay.

It watches the active window, listens to voice, reads screen state, calls tools, and manipulates existing apps. This is useful because it can inhabit the old computer before the old computer is replaced.

But an overlay is a transitional form. If the agent can understand intention and request operations directly, then clicking through human-facing apps becomes unnecessary ceremony.
