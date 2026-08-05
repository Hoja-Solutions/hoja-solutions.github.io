---
title: "The frontier after Kimi K3: four points apart, three times the price"
description: "The top four models on the Artificial Analysis index sit within four points of each other and vary threefold in cost per task. The cheapest of them is the one you can download. What changed in July was pricing power, not capability."
date: 2026-08-05T12:00:00
tags: ["AI", "Open Source", "Hardware"]
---

Moonshot AI published the full weights of Kimi K3 on July 27. It scores 57 on the Artificial Analysis Intelligence Index and costs $0.94 per task, which makes it the cheapest of the four strongest models in the world and the only one of them you can download. In the two weeks around that release, Anthropic shipped a flagship that beats its own previous best for less money, OpenAI cut one model's price by 80 percent, and Alibaba announced a 2.4 trillion parameter model with open weights to follow.

## What the index actually says

Capability at the top has compressed into a narrow band. Four points separate first place from fourth. Cost per task across those same four models varies by a factor of three.

| Model | Lab | Weights | Intelligence Index | Cost per task |
| --- | --- | --- | --- | --- |
| Claude Opus 5 | Anthropic | Closed | 61 | $2.03 |
| Claude Fable 5 | Anthropic | Closed | 60 | $2.75 |
| GPT-5.6 Sol | OpenAI | Closed | 59 | $1.04 |
| Kimi K3 | Moonshot AI | Modified MIT | 57 | $0.94 |
| Claude Opus 4.8 | Anthropic | Closed | 56 | $1.80 |
| GPT-5.6 Terra | OpenAI | Closed | 55 | $0.55 |
| GPT-5.6 Luna | OpenAI | Closed | 51 | $0.21 |

Scores are at maximum reasoning effort, and Fable 5's cost is measured with fallback.

Artificial Analysis first ranked K3 third and described its intelligence as comparable to Opus 4.8 and GPT-5.5. Claude Opus 5 arrived on July 24 at 61 points and moved K3 to fourth. K3 remains the highest-scoring open-weights model by a wide margin, and Artificial Analysis puts the median for open-weight models of similar size at 25.

Read the two right-hand columns together and the interesting comparison is not first against fourth. It is Fable 5 at 60 points for $2.75 against K3 at 57 points for $0.94. Three points of measured intelligence separate them, and one costs nearly three times the other.

## Where it wins and where it loses

One index number hides what a model is good at. Moonshot's [technical report](https://arxiv.org/abs/2607.24653) publishes a comparison across roughly forty benchmarks, and the pattern inside it is more useful than the ranking.

| Benchmark | Kimi K3 | Claude Fable 5 | GPT-5.6 Sol |
| --- | --- | --- | --- |
| BrowseComp | 91.2 | 88.0 | 90.4 |
| SWE-Marathon | 42.0 | 35.0 | 39.0 |
| ProgramBench | 77.8 | 76.8 | 77.6 |
| Terminal-Bench 2.1 | 88.3 | 88.0 | 88.8 |
| FrontierSWE | 81.2 | 86.6 | 71.3 |
| DeepSWE | 67.5 | 70.0 | 73.0 |
| HLE-Full (no tools) | 43.5 | 53.3 | 44.5 |
| CritPt | 23.4 | 28.6 | 32.3 |

K3 takes the top score on long-horizon agentic work. It leads BrowseComp at 91.2, DeepSearchQA at 95.0, MCPMark-Verified at 94.5, and SWE-Marathon at 42.0, which is seven points clear of Fable 5 on a GPU-kernel suite. Where it loses, it loses on hard reasoning: 43.5 against Fable 5's 53.3 on Humanity's Last Exam without tools, and 23.4 against Sol's 32.3 on CritPt. Moonshot's own summary is that K3 trails Fable 5 and GPT-5.6 Sol overall while beating every other model in the suite, which matches the table rather than overselling it.

Two footnotes in that table matter as much as the scores. Moonshot records that every Fable 5 result includes fallback behavior and every GPT-5.6 Sol result includes potential cyberguards, so these are comparisons of model plus scaffolding rather than model against model. On PostTrainBench, Fable 5 hit fallbacks on 35 percent of tasks. Read all of it knowing Moonshot picked the suite.

## Everybody moved on price

Anthropic went first. Claude Opus 5 landed on July 24 scoring 61, above Fable 5, at $2.03 per task, which Artificial Analysis measures as 26 percent below Fable 5's cost. Anthropic released a better model that is also cheaper to run than the one it had been selling. The advantage shows up at maximum reasoning effort, and at lower effort levels Opus 5 trails the GPT-5.6 family on the cost-intelligence frontier.

OpenAI followed on July 30, three weeks after launching the model it repriced. GPT-5.6 Luna dropped from a dollar to twenty cents per million input tokens, and from six dollars to $1.20 per million output tokens. Terra came down 20 percent. Sol, the flagship, kept its price. Reporting attributes the cuts to enterprise cost scrutiny and to competition from Chinese open-weight models.

The mechanism does not depend on which release triggered which decision. Once a model within a few points of the leaders can be downloaded and served by anyone, the most a closed provider can charge is bounded by what it costs somebody else to run the open one. That ceiling did not exist at this tier of capability eighteen months ago. Both American labs are also preparing to go public, so margin compression stops being a private matter and starts appearing in filings.

## Alibaba answered nine days later

On August 3, Alibaba released Qwen3.8-Max, the first Max-class Qwen to ship with open weights. It carries 2.4 trillion parameters with about 95 billion active per token, reads a million tokens of context, writes up to 128,000, and handles images and video. The API costs $2 per million input tokens, $6 per million output, and $0.25 cached. The weights were announced for Hugging Face and ModelScope the following week rather than at launch, so as of this writing you can rent it but not yet download it.

Its numbers land just under the leaders. Qwen3.8-Max sits fourth on Arena's frontend coding leaderboard, behind Claude Opus 5 and Kimi K3. It scores 66.1 on the Vals index, matching Claude Opus 4.7, and 87.3 percent on SWE-bench against 82.6 for GPT-5.5 and 89.2 for Opus 4.8. Terminal-Bench 2.1 moved to 67.4 from Qwen 3.7's 61.0.

Alibaba also announced Qwen3.8-27B, a smaller open-weight model in the same family aimed at ordinary on-premise GPUs. For our purposes that is the more consequential of the two releases. We built this site with Qwen3.6-27B on a single consumer card, so a new 27B in that lineage changes what we can put on a client's own hardware, while the 2.4 trillion parameter flagship changes which invoice they pay.

## Where the 2.5x came from

K3 is not K2 with more parameters bolted on. Moonshot reports roughly 2.5 times better scaling efficiency than K2, measured as validation loss against training FLOPs, and credits architecture and data recipes rather than size alone.

| | Kimi K2 | Kimi K3 |
| --- | --- | --- |
| Total parameters | 1.04T | 2.78T |
| Active per token | 32.6B | 104.2B |
| Layers | 61 | 93 |
| Routed experts | 384 | 896 |
| Experts active per token | 8 | 16 |
| Attention | MLA | Hybrid KDA and MLA (69 KDA, 24 MLA) |
| Activation | SwiGLU | SiTU-GLU |
| Training context | 128K | 1M |

Two changes carry most of that. The attention stack alternates three Kimi Delta Attention layers with one gated MLA layer per block, so linear attention handles sequence mixing while periodic global attention preserves full interaction. Attention Residuals then let every layer retrieve representations from all preceding layers through a learned pseudo-query, instead of reading one accumulated residual stream.

Scaling to 896 experts also required stability work that reads like a list of things that broke. Chaining the routed path's projections through nearly four consecutive matrix multiplications at 2.8 trillion parameters made internal activations explode, so Moonshot added an RMSNorm before the up-projection and replaced SwiGLU with SiTU-GLU, which caps both multiplicative branches with a smooth tanh bound. Balancing load across nearly a thousand experts broke the usual bias-update rule, so they set each expert's bias from a router-score quantile, estimated at scale through a histogram rather than an exact sort.

One more detail explains the million-token context. K3 applies no positional encoding to its global attention layers and lets position come implicitly from the recurrent decay in the KDA layers, so it extends to 1M tokens without RoPE rescaling or YaRN interpolation. The context window grew through a four-stage curriculum, 8K to 64K during pre-training and 256K to 1M during cooldown.

## Open is not local at this size

The K3 weights are 1.4 terabytes in MXFP4, and roughly 5.6 terabytes at sixteen bits. All of it has to sit in fast memory before the model processes a token, so loading it takes about eighteen H100s at 80GB each, or one modern node carrying eight 192GB Blackwell cards. Qwen3.8-Max needs over a terabyte to load and a minimum of eight H100 or B200 accelerators.

| Model | Weight footprint | What it takes to load |
| --- | --- | --- |
| Kimi K3 (MXFP4) | 1.4 TB | ~18 × H100 80GB, or 8 × 192GB Blackwell in one node |
| Kimi K3 (BF16) | ~5.6 TB | beyond a single standard node |
| Qwen3.8-Max | over 1 TB | 8 × H100 or B200 minimum |
| Qwen3.8-27B | fits one card when quantized | consumer or single-GPU server |

The binding constraint is memory capacity and bandwidth rather than arithmetic. Both models are sparse mixtures of experts, so K3 runs 104.2 billion of its 2.78 trillion parameters per token and Qwen3.8-Max about 95 billion of its 2.4 trillion. Compute per token stays affordable while the memory requirement refuses to move.

One deployment detail is easy to miss. Those MXFP4 weights are not a compressed copy of a sixteen-bit model. Moonshot ran quantization-aware training through the entire post-training stage, keeping expert weights in MXFP4 and activations in MXFP8 while attention projections, shared experts, and routers stayed at higher precision. During reinforcement learning, rollout and training shared the same quantization scheme, which removes the train-inference mismatch that usually shows up when a model is quantized after the fact. The four-bit artifact is the trained model rather than a lossy version of it.

Set that against [what fits on a desk](/blog/state-of-local-models). The most memory in a single desktop machine today is 512GB in a Mac Studio, and that machine runs a 671-billion-parameter model at 17 to 18 tokens per second. K3 needs nearly three times that capacity. Downloading these weights buys the right to choose a host, not the ability to run the model in your office, which is why Together AI and Modal both had hosted access live on day zero.

So the two ends of the same fortnight point in opposite directions. A 2.8 trillion parameter model went free and stayed out of reach, and a 27B model arrived that a client can run on hardware they already own. For most of the work we ship, classification and extraction and routing and drafting, the small model on their own card is still the answer, and the frontier-scale capability gets rented with the option to move it.

## The security result nobody can compare against

The most consequential claim in the report sits in its evaluation section rather than its abstract. Moonshot pointed K3 at real codebases to find vulnerabilities, covering operating-system kernels, databases, web frameworks, blockchain and VPN software, and it produced hundreds of candidate findings. Of those that went through human review, roughly 70 percent were confirmed genuine, including 16 previously unknown vulnerabilities across six projects.

Two are in the Linux kernel. One is a remotely triggerable heap out-of-bounds write introduced by an incomplete upstream fix, present in every release up to and including current upstream code, which security experts confirmed as a remote denial-of-service primitive. The other is a Dirty-COW-class bug in the RDMA subsystem where an earlier fix had dropped a permission check, yielding a deterministic local privilege-escalation primitive.

Moonshot could not benchmark any of this against Anthropic's or OpenAI's models. The report states that frontier models from both labs refuse cyber-related tasks, which makes a comparable evaluation infeasible, so it excludes them from the suite and uses GLM-5.2 as the baseline for exploit development instead.

That turns the [open-weights letter](/blog/open-weights-letter) argument from a prediction into a measurement. The letter claimed defenders need models with capabilities comparable to attackers'. Here the models that will actually do the work are the downloadable ones, and the refusal that makes the closed models safer to sell is the same refusal that keeps them out of the comparison. Whether you read that as reassuring depends entirely on which side of the download you sit on.

## What the labs admit

Moonshot published its own list of failure modes, which is the most useful part of its writeup. K3 is sensitive to thinking history and needs harnesses verified against it. It is excessively proactive, meaning it decides for itself when a request is ambiguous. And Moonshot states that there is a noticeable gap in user experience compared with Claude Fable 5 and GPT 5.6 Sol. Ranking near the top of an index and feeling worse to work with are both true at once, and the second decides whether a developer is still using it in week two.

The same report contains a result pointing the other way. On Moonshot's in-house web development benchmark, expert judges compared K3 against Claude Opus 4.8 blind, without knowing which model produced which output, and preferred K3 on 58.6 percent of prompts against 27.6 percent, a 31-point margin that widens to 59 points on 3D and shader work. Their coding-experience metric puts K3 marginally ahead of Fable 5 even though its raw task scores sit behind. So the user-experience gap Moonshot concedes is real and narrower than the concession suggests, depending on what you build.

The cheap-per-task figure also deserves a caveat. Artificial Analysis recorded 130 million K3 output tokens across the Intelligence Index, more than double the 63 million median for comparable reasoning models. K3 still finishes cheaper per task because its per-token price is low, and that arithmetic can invert on an output-heavy workload. Measure your own tasks before trusting the average.

Neither release is open source. Moonshot published weights while withholding training data and code, under a modified MIT license rather than MIT. Qwen3.8-Max drew immediate questions about whether its license restricts use in the United States, the European Union, the United Kingdom, and Korea, and Alibaba's announcement did not address them. If you are considering either model for a product, the license is the document to read first, before the benchmark table.

For a team choosing a model in August 2026, capability has stopped being the question that separates the options. Four labs will sell you something within four points of the best, two of them will hand you the file, and what remains is what a task costs, who operates the memory, and whether you can leave. The engineering work moved accordingly, toward systems that can change the model underneath without the application noticing.
