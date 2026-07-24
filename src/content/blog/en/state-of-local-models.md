---
title: "From a Raspberry Pi to a DGX Spark: the state of local models in 2026"
description: "The hardware to hold a capable model got cheap, and the models got small enough to fit. What runs on the machines in your bedroom, and the two numbers that decide it."
date: 2026-07-23
tags: ["AI", "Open Source", "Hardware"]
---

You can run a capable language model on hardware that fits on your desk, and millions of people now do. [Ollama](https://ollama.com), the tool most people install first, went from around 100,000 downloads a month in early 2023 to 52 million in early 2026. On Hugging Face, models packaged in GGUF, the format built for running on your own machine, grew from a couple hundred to more than 135,000. Those are adoption curves for something that used to be a weekend project.

Two curves crossed to get here. Memory got cheap enough that a box on your desk holds tens of billions of parameters, and models got small enough to fit without giving up much. Quantization did most of the shrinking: storing each weight in four bits instead of sixteen cuts a model's footprint by about a factor of four, and a well-quantized model keeps most of its quality. A 27-billion-parameter model like [Qwen3.6](https://huggingface.co/Qwen/Qwen3.6-27B) fits in 16 to 24 GB once quantized, the memory on a single consumer graphics card.

## The two numbers that decide everything

Whether a model runs on a machine comes down to two numbers. The first is memory capacity: the weights have to fit, or the machine will not load them. The second is memory bandwidth: to generate one token, the hardware reads every active weight once, so tokens per second is roughly the bandwidth divided by the model's size in memory. Capacity decides whether it runs. Bandwidth decides how fast. Every machine here is a different bet on those two numbers.

## Unified memory versus discrete GPUs

The clearest split in home hardware is where the memory lives. Unified-memory machines share one large pool between CPU and GPU, so they hold enormous models but move data at moderate speed. AMD's Ryzen AI Max, the Strix Halo chip, puts 128 GB in a mini PC that costs $1,500 to $2,000. It loads a 70B model that fits on no single consumer GPU, but its bandwidth is around 256 GB/s, so that dense 70B answers at 4 to 6 tokens per second. NVIDIA's DGX Spark makes the same trade at a higher price, near $4,700, with 128 GB at 273 GB/s. Both hold big models and run them slowly.

Discrete GPUs make the opposite bet. An RTX 5090 has 32 GB, so the model has to be smaller, but its bandwidth is 1.79 TB/s, and a quantized 32B model runs at 45 to 60 tokens per second. A used RTX 3090 is the pragmatic version of that bet: 24 GB at 936 GB/s for a few hundred dollars, quick enough to serve a 20B to 35B model for coding and private document work, and people stack two for 48 GB.

Apple's Mac Studio with an M3 Ultra gets both, with up to 512 GB of unified memory at 819 GB/s. That combination holds models nothing else on a desk can. A 671-billion-parameter DeepSeek model loads and answers at 17 to 18 tokens per second, and it reaches that speed because it is a mixture-of-experts model that reads only about 37 billion weights per token. Those active weights, not the full 671 billion, are what the bandwidth has to move.

## Down to laptops, phones, and the Pi

Most of the adoption sits below all of that. A gaming laptop with a recent discrete GPU runs an 8B model faster than you read. The Copilot+ laptops sold for AI are weaker than their branding: on a Snapdragon X Elite, the usual tools run on the CPU rather than the advertised NPU, and shared memory at about 140 GB/s holds an 8B model to 5 to 10 tokens per second, where the used 3090 runs the same model near 100. The NPU is real, but the software most people run does not touch it yet.

Smaller still, the devices get everywhere. A Raspberry Pi 5, about $80, runs a 2B model at 8 to 12 tokens per second. An NVIDIA Jetson Orin Nano runs 1B to 3B models at 30 to 50, enough for a robot or a camera that has to answer with no network. The phone in your pocket ships a model built in: Apple's on-device Foundation Models on recent iPhones, Gemini Nano on Pixel and Galaxy flagships, each a few billion parameters, answering in well under a second because nothing leaves the device. These small models summarize, rewrite, and classify rather than do the hard reasoning you would send to a larger one.

The spectrum lines up cleanly along those two numbers:

| Device | Memory | Bandwidth | Model, speed at batch 1 | Approx. price |
|---|---|---|---|---|
| Mac Studio (M3 Ultra) | 512 GB unified | 819 GB/s | 671B MoE, 17-18 tok/s | ~$9,500 |
| DGX Spark | 128 GB unified | 273 GB/s | 70B, ~3 tok/s | ~$4,700 |
| Ryzen AI Max+ 395 (Strix Halo) | 128 GB unified | ~256 GB/s | 70B, 4-6 tok/s | $1,500-2,000 |
| RTX 5090 | 32 GB GDDR7 | 1,790 GB/s | 32B, 45-60 tok/s | ~$2,000 card |
| RTX 3090 (used) | 24 GB GDDR6X | 936 GB/s | 8B, ~100 tok/s | ~$700 card |
| Snapdragon X Elite (Copilot+) | shared LPDDR5X | ~140 GB/s | 8B, 5-10 tok/s | laptop |
| Jetson Orin Nano | 8 GB shared | ~102 GB/s | 1-3B, 30-50 tok/s | ~$250 |
| Raspberry Pi 5 | 8 GB shared | ~17 GB/s | 2B, 8-12 tok/s | ~$80 |
| Recent iPhone / Pixel | shared | on-device | ~3B, under 1s | flagship |

Read the table down the bandwidth column and the pattern is the whole post: capacity climbs as you go up, bandwidth does not follow, and the fast machines are the ones with the least room.

## How you make a model fit and run

Fitting the model is a software problem as much as a hardware one, and the tooling is where much of the recent progress lives. Quantization comes in families now. GGUF runs across CPU, GPU, and Apple Silicon, which is why Ollama and LM Studio build on it. AWQ and EXL3 squeeze more speed out of an NVIDIA card, and MLX does the same on a Mac. The catch is size-dependent: a model above 30B parameters drops under two percent of its quality at four bits, while a model under 7B can lose five to ten percent and needs five or six bits to hold up. Google built quantization into Gemma 3's training and released QAT versions that stay near lossless at four bits on consumer hardware. Models like BitNet go further, training in ternary weights from the start, though nobody has scaled that past 8B in public.

The runtime matters as much as the format. Ollama and LM Studio are the easy path for one user; llama.cpp and ExLlamaV3 give an enthusiast more control on a single GPU; vLLM and SGLang serve many users at once. When a model does not fit in VRAM, these runtimes spill the rest to system RAM and run the overflow on the CPU, trading speed for the ability to run at all. Speculative decoding, where a small draft model guesses tokens a larger one checks, landed in llama.cpp and MLX this year and buys real speed on the machines that were slowest.

## Where the numbers mislead you

Read the throughput figures online with suspicion. Most come from single runs on cherry-picked prompts, and vendors quote batched results that one person at a keyboard never sees. At batch size one, the way you use a model at your desk, you are bound by memory bandwidth and rarely reach the advertised rate. The frontier still does not fit: the largest hosted models are too big for any of this hardware, and for the hardest tasks the gap between the desk and the data center is real. Local is not free either. You pay up front for the hardware and the electricity, and again in the time it takes to set up, quantize, and keep the thing running. What you buy with that is control: the model runs on your machine, your data stays on it, and no one can rate-limit you or swap the model out from under you.

Two years ago the question was whether you could run a useful model on your own hardware. Now it is which of your problems are small enough to run on the hardware you already own, and how you split the work between the small model on the phone and the larger one on the box under the desk. For more of them than most teams assume, the honest answer is that they already fit.
