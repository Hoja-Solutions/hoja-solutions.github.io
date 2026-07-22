---
title: "Building Hoja's website with an open-source LLM"
description: "We built our production website with Qwen3.6-27B, an open-source model from Alibaba. What frontier open-weight models can do now, and where you still need a person in the loop."
date: 2025-07-22
tags: ["AI", "Engineering", "Open Source"]
---

This is Hoja's production website, and an open-source model wrote it. Every component, every line of prose, and the blog system you are reading this in came out of [Qwen3.6-27B](https://huggingface.co/Qwen/Qwen3.6-27B), a 27-billion-parameter dense model released by Alibaba's Tongyi Lab under an Apache 2.0 license. You download it and run it on your own hardware. There are no API keys and no per-token bill.

## The gap closed

Qwen3.6 is the first open-weight model in its series, released in April 2026. It handles text, images, and video through a vision encoder, and its architecture pairs Gated DeltaNet for linear attention with standard Gated Attention. Alibaba trained it on 36 trillion tokens across 119 languages, and it reads 262,144 tokens of context natively, extensible past a million tokens with YaRN scaling. You can switch it between a thinking mode that reasons step by step and a direct mode, at runtime.

The numbers that mattered to us were the agentic ones. It scores 77.2 on SWE-bench Verified and 59.3 on Terminal-Bench 2.0, benchmarks that measure whether a model can navigate a terminal, edit files, and ship working software. Those are the tasks we gave it. A 27B model now matches the 72B and 80B dense models from a year ago, and Qwen3-32B beats Qwen2.5-72B at half the parameter count. The gains came from better training data and better architecture, not from more scale. Quantized, the model loads onto a single consumer GPU with 24GB of VRAM, answers most requests in under a second, and costs nothing per call. The throughput of a hosted API stopped being the thing we designed around.

## The loop

Building a website this way is a loop. You describe the goal, the model writes the code, you run the build, and you fix what broke. The loop repeats until the build passes. Each turn touches one file or one component, and you verify it before moving to the next. The model writes the implementation, and you judge whether it is right.

That division of labor works because the model handles incremental edits without collateral damage. Ask it to adjust a component and it changes that component, not half the codebase. It held the design system in context across every edit: the color tokens, the font families, and the spacing scale survived each iteration, because the 262K window keeps the project structure and the full conversation in view at once. It did not forget a convention we had set three edits earlier.

## What it handled on its own

A few moments showed how far this goes. When it hit an API it did not recognize, it searched the web, pulled the documentation, and rewrote the code against it. We never handed it the docs. When we asked for a services section and then asked to cut it down, it found the two overlapping items, removed them, and explained the cuts. When we asked it to rewrite this post and strip the usual AI tells, it cut the filler and the three-item lists itself. It placed files in the right directories and wrote the imports, exports, and data flow for an Astro project with no tutorial in front of it, because its training data held enough real projects that the patterns were already there.

## Where you still run the build

The model is not autonomous. The first navbar it wrote used hardcoded links instead of Astro's routing. The build caught the error and the model fixed it, but the build caught it, not the model. It also states things it is unsure about with the same confidence as things it knows: model names, version numbers, release dates. We cross-check every citation before publishing. The 262K window fills up as a project grows, so you decide what to load into the conversation and what to leave out. The model cannot hold a whole codebase and a long history at the same time.

An open-source model built a production website, and a 27B version of it outperforms the 72B models from a year ago. The next generation will be more efficient. The benchmarks are what made us trust it with the work; owning the model is what made the work worth doing. You control the data, and for a team on sensitive code, that is the constraint that decides whether a tool is usable at all. You need a computer and the ability to read an error message. The model writes the code.
