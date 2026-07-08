---
type: concept
title: BCI Intent Interface
description: Brain-computer interfaces may eventually bypass language and translate intention into model latent space.
tags: [bci, interface, intention, latent-space, ai]
id: bci-intent-interface
parent: interfaces
group: infrastructure
groupLabel: Interfaces
order: 3
edge: BCI suggests an interface closer to intention than spoken or written language.
relations:
  - target: bci-as-final-interface
    label: refines
  - target: mind
    label: bypasses language from
  - target: a2ui-agent-to-user-interface
    label: still needs output through
---
# BCI Intent Interface

Language is an abstraction over thought.

It is powerful, but it is also lossy. Before a person can ask an AI for something, they must compress intention into words. The model then expands those words back into a possible intention. This introduces friction, ambiguity, and performance loss.

A brain-computer interface suggests a deeper path: thought or intention translated directly into the latent space of an omni-model.

This would not merely make prompting faster. It would change the nature of prompting. Instead of describing the shape of a desired action, the user could transmit something closer to the pre-linguistic impulse: the image, direction, memory, preference, or felt constraint behind the words.

BCI is not the whole interface, because it mostly solves input. The system still needs output. If language is too narrow on the way in, it is also too narrow on the way out. The answer may be generated interface: maps, controls, simulations, forms, timelines, graphs, and worlds.
