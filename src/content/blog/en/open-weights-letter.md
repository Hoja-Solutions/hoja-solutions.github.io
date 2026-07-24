---
title: "The open-weights letter: what 25 companies asked Washington for, and what they left out"
description: "NVIDIA, Microsoft, Meta, and 22 others signed a letter arguing the US should not restrict downloadable models. We read the three pages, checked the one claim we can verify from our own work, and noted what the letter avoids."
date: 2026-07-24T12:00:00
tags: ["AI", "Open Source", "Policy"]
---

Twenty-five American companies published a letter today asking Washington not to restrict open-weight AI models, and Jensen Huang used the first post of his life on X to put it in front of everyone. The signatures include NVIDIA, Microsoft, Meta, IBM, Dell, Palantir, CrowdStrike, Mozilla, Hugging Face, Mistral, the Linux Foundation, Andreessen Horowitz, and Y Combinator. OpenAI, Anthropic, and Google did not sign.

The letter runs three pages and carries a title that tells you its frame: [Open Weights and American AI Leadership](https://images.nvidia.com/pdf/Open-Weights-and-American-AI-Leadership.pdf). Huang added one line of his own on X: "The world needs both frontier closed models and frontier open models."

## What Kimi K3 changed

Eight days before the letter, Moonshot AI in Beijing released Kimi K3. It carries 2.8 trillion total parameters as a sparse mixture of experts, activating 16 of 896 routed experts per token, which is how a model that size answers at a usable speed. Arena ranked it first in Frontend Code, ahead of Claude Fable 5, in blind developer testing. Independent indexes placed it second and third overall, behind Fable 5 and GPT-5.6 Sol. Moonshot shipped it as a hosted service first and committed to publishing the full weights under a modified MIT license by July 27.

That combination is what turned a model release into a policy problem. A downloadable model now sits within a few points of the best closed American systems on public leaderboards, and it costs less per task than Claude Opus 4.8. Michael Kratsios, a White House adviser, accused Moonshot of using distillation to replicate a US model. Washington began weighing restrictions on freely downloadable weights.

The trend behind that moment is older. Alibaba's Qwen family passed Meta's Llama as the most-downloaded open model family on Hugging Face in September 2025, and a joint MIT and Hugging Face analysis put Chinese models ahead of American ones in Hub download share that same year. The companies writing this letter are arguing for American leadership in a category where American models stopped leading downloads a while ago.

## What the letter argues

The letter opens in the 1980s, with the open-source software pioneers who argued against the belief that software would only advance if companies kept tight control of their code. The signatories point out that open-source code now runs most of the internet and underpins systems at the largest technology companies, the US military, and federal agencies. They define open weights the way an engineer would: models that anyone can "download, inspect, modify, and run on their own infrastructure."

The economic argument is the specific one. Open weights let an organization "match the right model to the right job at the right cost, reserving frontier-scale capability for genuine frontier problems and running efficient, specialized models everywhere else." The letter treats that discipline as the thing that makes AI affordable as it scales into billions of everyday tasks, and it names where the value lands: "the workflows of factories, hospitals, farms, classrooms, and main street businesses."

Then it inverts the usual security argument. The signatories concede the risk in plain terms: "Once released, the weights are beyond the original developer's control, and modified versions are difficult to trace or reverse." Their answer is that concentrating capability inside a few closed models produces a small number of single points of failure, that closed models "can be breached, misused, or fail in ways that outsiders cannot detect," and that defenders facing attackers with advanced AI need models of comparable capability to simulate and respond to threats. Transparency beat obscurity in software security, and they argue AI will follow.

Four asks close the letter: expand compute access for startups and researchers, invest in shared training assets like datasets and evaluation frameworks, keep the frontier plural by "avoiding premature restrictions on open models that stifle competition or drive innovation overseas," and strengthen the application layers that put AI to work across the economy.

One paragraph exists because of Kratsios. The letter argues that policymakers should not conflate legitimate model development with misappropriation, that distillation is a widely used technique for improvement, evaluation, and validation, and that unlawful extraction from closed models deserves "targeted legal and commercial frameworks rather than sweeping restrictions on techniques." A rule written to punish Moonshot would land on everyone who trains a small model against a larger one's outputs, which is most teams doing applied work.

## The claim we can check

We can verify one of these arguments from our own invoices, and it is the model-matching claim. Most of what clients ask us to build does not need a frontier model. Classification, extraction, routing, summarizing, and drafting run well on a 27B-class open model quantized into the 24GB of VRAM on a single consumer card. We built this site with one. The frontier model earns its price on the hard reasoning, and it handles a small share of total calls.

The mechanism matters more than the savings. When the model runs on the client's own hardware, the cost tracks machines they already bought instead of tokens they meter, and the data never leaves their network. For a team holding regulated data or sensitive code, that second property decides whether they can adopt the tool at all. The letter's phrase about reserving frontier capability for frontier problems describes an architecture we already ship, and it stops being available the moment the weights stop being downloadable.

## What the letter leaves out

The three pages contain no statistics. The signatories make an economic and security argument about downloadable models without citing a download figure, a benchmark, a cost comparison, or an incident. For a document aimed at policymakers who are being asked to weigh measurable risk, the absence is a choice.

"Premature" is doing heavy lifting and never gets defined. The letter asks Washington to avoid acting too early without naming which restriction would be reasonable or what evidence would justify one. It also admits that released weights cannot be recalled, then offers community scrutiny as the response, which addresses discovering a problem rather than containing one.

The incentives are worth stating plainly. NVIDIA sells accelerators to everyone who trains or serves a model, and a world with many models running in many places sells more of them than a world with five. Microsoft rents access to closed models on Azure and hosts open ones. Meta publishes open weights as a competitive strategy. An argument can be correct and self-interested at the same time, and this one is both.

The letter never says the word China. The model that made it urgent is Chinese, the download share it is implicitly responding to is Chinese, and the distillation accusation that shaped its most defensive paragraph was aimed at a Beijing lab. Naming the competitor would have forced the signatories to explain how you keep the frontier plural while restricting the labs currently leading the open category, so they left it out.

As for the three companies that did not sign: OpenAI, Anthropic, and Google build the closed frontier models that this letter positions as single points of failure, and OpenAI and Anthropic have both pushed for tighter rules around distillation. A paragraph defending distillation as a tradition of learning from and improving existing technology is not one either could sign without arguing against its own filings.

For a team deciding what to build on, this fight comes down to one question: will the weights still be downloadable in two years. Twenty-five companies with money riding on yes told Washington today that the answer should stay yes. We need the same answer for a narrower reason, which is that it is the only version of this where the model runs inside the client's network and the data stays there.
