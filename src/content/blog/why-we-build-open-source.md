---
title: "Why we build open-source"
description: "This website is a public GitHub repository, and so is the rest of our stack. The practical case for building on open source."
date: 2025-07-22
tags: ["Open Source", "Engineering"]
---

The code for this website is a public GitHub repository. You can fork it, read the commit history, and see the reasoning behind each decision. We hold the tools we depend on to that same standard, and we ship it in the work we do for clients.

Our stack is open the whole way down: the models we run, the frameworks we build with, the databases we query, the CI that deploys us. When one of them breaks, we do not file a ticket and wait on a vendor's release cycle. We read the code, find the bug, and patch it, or we pull the fix someone else already wrote. When a dependency stops fitting, we fork it. The people using the tool keep control of it.

We build client projects on open-source models and run them on the client's own infrastructure, under their credentials, with nothing leaving their network. The model is theirs to fine-tune, quantize, or swap out, with no external API sitting between them and the system that makes decisions about their data. For a team handling regulated data or sensitive code, that is the difference between adopting a tool and walking away from it.

We write open-source code for our own work too. This website is the plainest example. Read the source and you see the whole stack, the structure, and the decisions behind it, with no proprietary SDK in the way. When we can, we send patches, documentation, and tooling back upstream, because the ecosystem holds up only when people give back to it.

People whose own work depends on the code have already read and tested it, so bugs surface early and the fix often already exists. The cost tracks what you run rather than the number of seats or tokens. You can inspect what the tool does instead of trusting a description of it: the model and the algorithm sit in front of you, and you verify the output yourself.

When a client asks why we picked a particular tool, the answer is short. It is open, we checked it, and it works. The bar for shipping software keeps dropping, and a computer plus the ability to read code will carry you most of the way. Open-source tools cover the rest.
