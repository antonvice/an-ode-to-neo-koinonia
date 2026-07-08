---
type: concept
title: A2UI
description: Agent-to-User Interface, where agents return safe structured UI blueprints instead of only text.
tags: [a2ui, interface, agents, ui, protocols]
id: a2ui-agent-to-user-interface
parent: interfaces
group: infrastructure
groupLabel: Interfaces
order: 4
edge: A2UI lets agents answer with structured interface rather than only language.
relations:
  - target: structured-ui-blueprint
    label: emits
  - target: unified-editable-ui
    label: renders into
  - target: ai-to-ai-protocols
    label: complements
  - target: post-saas-economy
    label: accelerates
---
# A2UI

A2UI means Agent-to-User Interface.

It is the idea that an AI agent should not only answer in text. It should be able to return a structured interface: buttons, forms, maps, charts, cards, filters, timelines, sliders, confirmations, and editable states.

The current chat model is like navigating a website by texting someone who can see the screen. It works, but it is indirect. If a user asks for Italian dinner options nearby, the agent should not only produce prose. It should produce a map, filters, restaurant cards, dietary controls, time options, and a booking confirmation path.

The important distinction is safety. The agent should not freely execute arbitrary UI code on the user's machine. It should emit a structured blueprint that the client renders using trusted native components. This is safer than generated code because the executable surface belongs to the host application, not the model.

But A2UI is not automatically safe. The schema, permission model, data boundaries, and action confirmations still matter. A malicious or confused agent can still request bad actions through a beautiful interface.

A2UI turns AI interaction from conversation into living software.
