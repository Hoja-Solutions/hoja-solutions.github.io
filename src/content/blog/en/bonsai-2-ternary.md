---
title: "Bonsai 2: a 27B model in 5.9 GB, and the memory it does not save"
description: "PrismML compressed Qwen3.8-27B to ternary weights and kept 98.2% of its benchmark average by its own measurement. The weights shrank nine times. The KV cache did not move, and the capability that degraded most is the one we build on."
date: 2026-09-18T12:00:00
tags: ["AI", "Open Source", "Hardware"]
---

PrismML released [Ternary Bonsai 2 27B](https://huggingface.co/prism-ml/Ternary-Bonsai-2-27B-gguf) on September 17 under Apache 2.0. It is Qwen3.8-27B with every weight collapsed to one of three values, and it occupies 5.93 GB where the original takes 53.80 GB. On PrismML's own twenty-benchmark suite it averages 83.9 against the parent model's 85.4.

Three weeks ago we wrote that quality [falls off a cliff below four bits](/blog/qwen38-27b-local). This model runs at 1.76 bits per weight. The claim deserves a careful look, and the interesting part turns out to be neither the compression ratio nor the retention percentage.

## What ternary means in this file

Every weight becomes one of {−1, 0, +1}, and each group of 128 weights shares one FP16 scale factor. A ternary value carries log2(3), about 1.585 bits, and the amortized scales bring the real cost to roughly 1.76. Almost nothing escapes: only 26.2 million parameters, under a tenth of a percent, stay at higher precision, and those are the recurrent state paths and the normalization weights.

Before assigning trits, PrismML applies a blockwise Hadamard rotation at block size 1,024, and the runtime applies the matching transform to activations before each multiply. The rotation spreads outlier weights across a block so no single coordinate has to be represented by a value the format cannot express. PrismML's whitepaper credits SpinQuant for the idea.

| Format | Bits per weight | Size |
| --- | --- | --- |
| FP16 reference | 16.0 | 53.80 GB |
| UD-Q4_K_XL | ~4.5 | 17.6 GB |
| PQ2_0 (2-bit slots) | 2.13 | 7.25 GB |
| PTQ1_0 (dense trits) | 1.76 | 5.93 GB |

The two packings trade space against arithmetic. PTQ1_0 packs trits densely and costs more to unpack, so it wins only when memory is the binding constraint. PQ2_0 wastes some space to make the unpack cheap. The vision tower ships separately as a 0.63 GB file and loads only when you feed the model an image.

The zero is what makes ternary work rather than binary. Under a roughly Gaussian weight distribution about 31 percent of weights land on zero, and published analysis of ternary formats puts the reconstruction error near 0.263 sigma squared against 0.363 for sign-only encoding. That third state is worth around five points of retained capability. None of that is a small perturbation: the root-mean-square error sits near half the root-mean-square weight magnitude, and the model works anyway.

## Compressed into ternary, not trained in it

The model card describes the weights as natively ternary rather than post-quantized, which is true in a narrow sense and misleading in a broader one. The weights are stored and multiplied as trits instead of being dequantized to floating point at runtime. They were still produced by compressing a finished FP16 model rather than by pre-training in ternary from the start.

That distinction has a public record. Microsoft's BitNet b1.58 2B4T, released in April 2025, was trained natively in ternary from scratch at 2.4 billion parameters on 4 trillion tokens, and it remains the reference point for the from-scratch approach. When we wrote in July that [nobody had scaled from-scratch ternary training past 8B in public](/blog/state-of-local-models), that was accurate and it still is. What arrived since is the other route: take a model somebody else trained at full precision and compress it hard enough that the result behaves like a ternary model.

PrismML has not disclosed how it assigns ternary values. The company publishes inference and demo repositories and no training code, so the pipeline that produced these weights is not reproducible from outside. Several write-ups fill the gap by explaining Microsoft's BitNet Distillation, a documented three-stage procedure of replacing linear layers, warming up, then distilling from a teacher on logits and attention relations. That is a reasonable guess at the shape of the problem and it is not a description of what PrismML did.

## Where the compression shows

PrismML's category table is more informative than its headline.

| Category | Qwen3.8-27B FP16 | Ternary Bonsai 2 | Retention |
| --- | --- | --- | --- |
| Math | 97.06 | 96.57 | 99.5% |
| Coding | 82.17 | 81.58 | 99.3% |
| Instruction following | 81.25 | 82.66 | 101.7% |
| Agentic and tool calling | 79.74 | 77.57 | 97.3% |
| Knowledge and reasoning | 86.66 | 83.95 | 96.9% |
| Vision | 81.64 | 78.59 | 96.3% |
| Overall | 85.4 | 83.9 | 98.2% |

Math and coding survive almost intact, which is the surprising result and the one worth taking seriously. On AIME26 the compressed model scores 95.83 against the parent's 94.58, and on LiveCodeBench the two are level at 90.07 and 90.05. Conventional low-bit quantization does not behave this way. The same card reports IQ2_XXS at 9.4 GB scoring 78.6 on AIME26 and 70.05 on LiveCodeBench, so a comparable footprint reached by ordinary means loses far more.

One row should make you suspicious of the aggregate. Instruction following improves under compression, to 101.7 percent retention. A lossy transformation of a model does not make it better at following instructions, so that number is measurement noise being averaged into a headline, and it inflates the 98.2 percent.

The number that matters for our work is not in that table. PrismML's own Terminal-Bench 2.1 result is 52.8 against the parent's 69.7, about 75 percent retention. Their agentic category says 97.3 percent. Both are theirs, and the gap between them is the difference between emitting a well-formed tool call and finishing a long task. Function-calling suites measure the first. Terminal-Bench measures the second. Compression costs about a quarter of the second while barely touching the first.

Two more caveats belong next to those numbers. Every result here is PrismML's own and nobody has reproduced them independently. And the vendor's own documents disagree with each other: the model card reports an 84.78 average against an 86.32 baseline while the announcement reports 83.9 against 85.4, both arriving at 98.2 percent retention.

The only third-party agentic measurement of this family covers the previous generation. A community run put the July Ternary Bonsai 27B through Terminal-Bench 2.0 on an 8 GB laptop GPU and recorded 7.9 percent, below a 9B model at conventional four-bit quantization that fit on the same card. That was a different model and a harness this release claims to handle better. It is also the only independent agentic evidence that exists for any Bonsai, and nobody has published a comparable run for Bonsai 2.

## The memory it does not save

Here is the part the coverage misses, and it follows directly from the arithmetic in our last post.

Compression applies to weights. It does not apply to the KV cache. This architecture spends roughly 64 KB per token of context, and that figure is a property of the attention layers, which Bonsai 2 inherits from Qwen3.8-27B unchanged.

| Context | KV cache | Total with Bonsai 2 | Total with Q4 weights |
| --- | --- | --- | --- |
| 8K | ~0.5 GB | ~6.4 GB | ~18.1 GB |
| 32K | ~2 GB | ~7.9 GB | ~19.6 GB |
| 128K | ~8 GB | ~13.9 GB | ~25.6 GB |
| 262K (native) | ~16 GB | ~21.9 GB | ~33.6 GB |

Read the first column against the second. At the model's native context the cache is nearly three times the size of the weights, and the total still needs a 24 GB card, which is the same floor we described for four-bit weights at short context. Nine times smaller weights bought a great deal at 8K and almost nothing at 262K.

So the bottleneck moved rather than disappearing. Before this, memory was dominated by a constant you could compress. Now it is dominated by a term that grows with how much context the task needs, and long-horizon agentic work is precisely the kind that fills a context window. The framing of a 27B model on a laptop or a phone is real for short bounded prompts. It does not survive the workload the model's own agentic scores are advertising.

On an 8 GB card the weights fit with about two gigabytes to spare, which buys roughly 32K of working context. That is a usable assistant and a poor agent.

## What it takes to run

Stock llama.cpp cannot load these files. PrismML ships a fork, and using the model means using it, which is a real adoption tax for anyone with an existing local stack and the reason the Ollama-style one-command path does not apply here yet.

Throughput is good where it has been measured: 142.5 tokens per second on an RTX 5090, 96.7 on a 4090, and 46.8 on an M5 Max. PrismML reports 0.714 mWh per token on a 4090 and claims that is 40 percent better than a full-precision 8B model, which is the kind of comparison that flatters the numerator by choosing the denominator.

The license is Apache 2.0, inherited from the parent, and that is not a small detail. A compressed derivative under a permissive license is something a client's review can approve without a negotiation.

For our own work the honest placement is narrow and real. Where a task is bounded, the context stays short, and the job is math or code, this model puts capability on hardware that had none. Where the task runs long, the compression takes a quarter of the capability that matters and the context takes the memory the compression saved. The number to watch in the next release is not the footprint. It is Terminal-Bench.
