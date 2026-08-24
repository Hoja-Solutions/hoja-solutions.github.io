---
title: "Qwen3.8-27B: the same architecture, fourteen points better"
description: "Alibaba shipped a 27B model in August that scores 52 on the Artificial Analysis index against its predecessor's 38, with an identical network. What that means for running a capable model on one graphics card, and what it costs in memory and tokens."
date: 2026-08-24T12:00:00
tags: ["AI", "Open Source", "Hardware"]
---

Alibaba released [Qwen3.8-27B](https://huggingface.co/Qwen/Qwen3.8-27B) on August 14 under Apache 2.0. The network is the same one it shipped in April: 27 billion dense parameters, 64 layers, the same hybrid of Gated DeltaNet and gated attention, the same 262,144-token context, the same vision encoder. On Artificial Analysis's intelligence index it scores 52 where Qwen3.6-27B scored 38. Nothing about the architecture changed, and the model got fourteen points better.

## The upgrade is entirely post-training

Alibaba credits the gain to reinforcement learning environments and on-policy distillation. Same parameter count, same shape, better training.

| | Qwen3.6-27B | Qwen3.8-27B |
| --- | --- | --- |
| Parameters | 27B dense | 27B dense |
| Layers | 64 | 64 |
| Attention | Gated DeltaNet with gated attention | unchanged |
| Native context | 262,144 | 262,144 |
| Vision encoder | yes | unchanged |
| License | Apache 2.0 | Apache 2.0 |
| Artificial Analysis index | 38 | 52 |
| Terminal Bench 2.1 | 63.4 | 73.0 |
| SWE-bench Pro | 53.5 | 61.7 |
| DeepSWE 1.1 | 13.3 | 42.2 |

Everything above the line is identical and everything below it moved. DeepSWE went from 13.3 to 42.2, which is less a refinement than a model that could not previously do the task learning to do it.

This is the same lesson [Moonshot reported](/blog/frontier-after-kimi-k3) from the other end of the scale, where architecture and training recipes bought 2.5 times the scaling efficiency rather than raw size. Capability at a fixed parameter count is not close to exhausted. For anyone planning hardware around a model, that matters more than the benchmark table: the 27B you buy a card for this year will get better without you buying another card.

## Why changing only the training moves the number

Post-training is not one technique, and the literature separates its parts by which states the model gets corrected on. Supervised fine-tuning applies its loss to fixed dataset trajectories. Reinforcement learning with verifiable rewards applies a sparse outcome signal to trajectories the model generated itself. On-policy distillation applies dense token-level feedback to those same self-generated trajectories, with a teacher scoring each token in the context the student actually produced. A [2026 survey of on-policy distillation](https://arxiv.org/abs/2606.22793) organizes the three by state distribution rather than by loss function alone, and that framing explains how a frozen architecture gains fourteen points. The network is the same. The situations it gets corrected in are not.

The efficiency argument for the distillation half is information density. Reinforcement learning delivers roughly one bit of signal per episode, since the model learns only whether the final answer passed. Distillation delivers a signal at every token, so one rollout carries orders of magnitude more supervision. [Thinking Machines Lab](https://thinkingmachines.ai/blog/on-policy-distillation/) measured what that buys on AIME'24 with a Qwen3-8B student and a Qwen3-32B teacher.

| Method | AIME'24 | GPU hours |
| --- | --- | --- |
| Off-policy distillation (SFT, 400K samples) | 60% | not reported |
| Reinforcement learning | 68% | 17,920 |
| On-policy distillation | 70% | 1,800 |

Ten times less compute for a better score. Alibaba published the same ratio in the [Qwen3 technical report](https://arxiv.org/abs/2505.09388), where distillation beat its four-stage RL pipeline for roughly a tenth of the GPU hours, 1,800 against 18,000 on the 8B model. That is the commercial reason a lab ships a second model on an unchanged architecture. The cheapest remaining axis of improvement is not parameters or pre-training data, it is which trajectories you score and how densely you score them.

Reverse KL is the usual objective on the distillation side, and the reason is worth stating. Placing the expectation under the student's own distribution makes its rollouts match the objective, and the mode-seeking behavior keeps the student from spreading probability mass across regions the teacher considers unlikely. Recent theory recasts the whole procedure as dense KL-constrained reinforcement learning, where the teacher's per-token log-ratio acts as an implicit reward, and shows that scaling that reward past its usual weight can push a student beyond its own teacher.

## What fourteen points do not prove

Here the research turns against the marketing, and the argument matters because it changes how you read any post-training number.

A [widely cited 2025 result](https://arxiv.org/abs/2504.13837) found that RLVR-trained models beat their base models at small sampling budgets while the base model matched or exceeded them at large k. On that reading, reinforcement learning sharpens a distribution the base model already contained instead of adding new reasoning. A [July 2026 paper](https://arxiv.org/abs/2607.20543) named the sharp form of this pass@k inversion and diagnosed it across a 3,000-prompt study on three seeds: correct trajectories that exist rarely in the base model are too sparse to show up in a finite rollout group, so they vanish before any reward can reinforce them. The trained policy ends up solving fewer distinct problems than the model it started from while scoring better on each single attempt.

The question is not settled. A [curriculum approach](https://arxiv.org/abs/2606.22317) reported pass@256 gains of 9.8 points over base models and 10.3 over ordinary RLVR, which is a boundary moving outward rather than narrowing. [Work on vision-language models](https://arxiv.org/abs/2511.00710) found RLVR solving problems where the base scored zero at every sampling budget tried. And the distillation half pulls against the RL result: Alibaba reported improved pass@64 from teacher-logit distillation and described it as expanding the student's exploration space.

Now apply that to the number at the top of this post. The Artificial Analysis index is a single-attempt measurement, so fourteen points means Qwen3.8-27B is considerably more likely to be right on the first try. Whether it can reach solutions its predecessor could not reach given a hundred attempts is a separate question, and nobody outside Alibaba has published pass@k curves for either model. For agentic work the single-attempt number is usually the one that decides things, because an agent that needs a hundred samples to find the fix is not doing the job. For research-style search where you can afford to sample widely, the distinction is real and unmeasured here.

## Where it actually sits against the frontier

Most of the coverage frames this model as approaching Claude Opus. Read the vendor's own comparison closely and the benchmark partner is Claude Opus 4.6, which is not the current frontier. Alibaba reports 61.7 on SWE-bench Pro against Opus 4.6's 53.4, and also reports losing on Terminal Bench 2.1 (73.0 against 78.2), GPQA Diamond (89.2 against 91.3), and Humanity's Last Exam (30.8 against 40.0). Choosing which model to be measured against is itself a claim.

The independent index puts it in a more useful place.

| Model | Weights | Index | Cost per task | What it takes to run |
| --- | --- | --- | --- | --- |
| Claude Opus 5 | Closed | 61 | $2.03 | hosted API |
| Claude Fable 5 | Closed | 60 | $2.75 | hosted API |
| GPT-5.6 Sol | Closed | 59 | $1.04 | hosted API |
| Kimi K3 | Modified MIT | 57 | $0.94 | 1.4 TB of fast memory |
| GPT-5.6 Terra | Closed | 55 | $0.55 | hosted API |
| Qwen3.8-27B | Apache 2.0 | 52 | nothing per token | one 24 GB GPU |
| GPT-5.6 Luna | Closed | 51 | $0.21 | hosted API |

Nine points separate this model from the best system money can rent. It sits a point above GPT-5.6 Luna, the cheapest model in OpenAI's current family, and three below Terra. So the honest description is not that it nears the frontier. It reaches the bottom rung of the frontier ladder, and it does so on hardware that costs less than a month of heavy Opus 5 usage.

The row worth staring at is Kimi K3. Five points better, and it needs 1.4 terabytes of memory resident before it answers anything. Qwen3.8-27B gives up those five points and fits in 17 GB. For a client who wants a model inside their own network, that trade is not close.

## Against the other models you would actually run

The real competition is not Opus. It is whatever else fits on the same card.

| | Qwen3.8-27B | Qwen3.6-27B | Gemma 4 31B |
| --- | --- | --- | --- |
| Parameters | 27B dense | 27B dense | 31B |
| License | Apache 2.0 | Apache 2.0 | Gemma terms of use |
| Native context | 262K | 262K | 256K |
| Decode, one RTX 4090 at Q4_K_M | ~49 tok/s | ~49 tok/s | ~45 tok/s |
| Where it leads | agentic coding, computer use | superseded | structured tool calls, math, languages |

A physical test on August 16 put Qwen3.8-27B's Q4_K_M build at roughly 49 tokens per second on a single RTX 4090, matching its predecessor's decode speed and memory curve while completing all twelve coding tasks in the suite on the first seed. Gemma 4 31B decodes about 8 percent slower on the same class of card.

Gemma 4 is not beaten across the board. It posted a clean 90 out of 90 on single structured tool calls and 30 out of 30 on multi-step runs, and it took a blinded writing rubric by a point. If your workload is tool-calling reliability, multilingual coverage, or audio input, that is the model to test first. Qwen3.8-27B wins on agentic coding and computer use, where it reports 84.3 on OSWorld-Verified and 81.9 on AndroidWorld.

## What it costs to run in memory, honestly

The weights fitting on your card is the easy half. Quantization gives a clean ladder.

| Precision | Weights in memory |
| --- | --- |
| 1-bit | 7 to 8 GB |
| 3-bit | 12 to 14 GB |
| 4-bit | 16 to 19 GB |
| 6-bit | 23 to 26 GB |
| 8-bit | 31 GB |
| BF16 | 56 GB |

Then the context arrives. This architecture spends roughly 64 KB per token of KV cache, so 32K of context costs about 2 GB, 128K costs 8 GB, and the full native 262,144 tokens costs around 16 GB on its own. Add that to 17 or 18 GB of four-bit weights and the advertised context window does not fit on the card the weights fit on. A 24 GB GPU is the practical floor and gives you tens of thousands of tokens of working context. 32 GB is comfortable. 48 GB is where the full window stops being theoretical.

Two more things temper the numbers. Community testing found quality dropping sharply below four-bit, so the 1-bit and 2-bit rungs are demos rather than deployments. And this model is token-hungry: independent measurement puts it at roughly twice the tokens per task of Qwen3.6-27B and 2.3 times GPT-5.6 Luna Max, with default thinking settings capable of spending twenty thousand reasoning tokens on a single question. At 49 tokens per second that arithmetic is unforgiving, and on Apple silicon it gets worse, with reports of fewer than ten tokens per second on a 24 GB M4 MacBook Air and 5 to 6 on a 32 GB Mac Mini once a few thousand tokens are in play.

The measurement that matters is wall-clock time per completed task rather than tokens per second, and on that basis the extra tokens are often worth paying, because the model finishes work its predecessor failed. Decide it with your own tasks. Set `reasoning_effort` to low or medium for anything that does not need the deliberation, since the parameter exists precisely because the default is expensive.

## Adoption, and how to read the numbers

The tooling arrived faster than the analysis. Unsloth published a full GGUF quantization ladder with the vision projector on release day, also under Apache 2.0. The model entered the Ollama library the same week as `qwen3.8:27b` with an 18 GB Q4_K_M default. Abliterated community builds followed. It trended first on Hugging Face immediately.

Treat the download counts with suspicion. Reported figures for the same first week range from about 92,000 in the first day to a million in twenty-four hours to three million in three days, which is an order of magnitude of disagreement and tells you these numbers are being repeated rather than measured. The defensible signal is the tooling, plus the baseline that Qwen3.6-27B passed 7 million downloads in the four months after its release.

The license is the part that will decide long-run adoption, and it is the quiet advantage here. Apache 2.0 with no field-of-use restrictions is a different proposition from Kimi K3's modified MIT, and from the questions still open about whether Qwen3.8-Max's own terms restrict use in the United States and Europe. A permissive license on a model that fits one card is what makes it viable inside a client's compliance review, which is usually where these conversations end rather than begin.

We built this site with [Qwen3.6-27B](/blog/open-source-llm-website) on a single consumer card. The replacement is the same size, runs at the same speed, needs the same hardware, and is measurably better at the work. That is the most useful thing about it. The frontier moved too, and it moved somewhere you cannot follow without a datacenter, while this rung of the ladder moved somewhere you can reach by pulling a new file.
