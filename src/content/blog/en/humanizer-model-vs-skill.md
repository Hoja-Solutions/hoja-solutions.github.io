---
title: "Humanizing AI text: a fine-tuned 12B against general models with a rules file"
description: "We gave nine setups the same seven AI-written drafts and asked for three rewrites of each. The model trained for the job was the fastest by far and reworded most of the quotations its own prompt told it to keep. General models following the open humanizer skill kept nearly everything, including a 27B running on the same GPU."
date: 2026-10-12T12:00:00
tags: ["AI", "Engineering", "Open Source"]
---

We ran 189 rewrites to compare two ways of making AI-written text read as if a person wrote it. On one RTX 5090, a 12B model fine-tuned for exactly this job finished 21 rewrites in 11 seconds in our 4-bit build. Its own prompt says every quotation must survive unchanged, and its three builds kept 20 to 23 of the 57 quotations we checked. Four Claude models and a local Qwen3.8-27B, all following a published set of editing rules, took far longer and kept 46 to 51.

The two approaches share a name, so it helps to separate them first. The [humanizer model](https://huggingface.co/jialinyyzz/humanizer) is a Gemma 4 12B fine-tune that rewrites English and Chinese drafts while keeping every number, name, date and quotation. The [humanizer skill](https://github.com/blader/humanizer) is an unrelated open-source instruction file for AI assistants, built on [Wikipedia's guide to the signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing).

## What we compared

Nine setups took part. Three are the humanizer model: the original at full precision, and two 4-bit builds we made with GPTQ, one that quantizes only the weights and one that quantizes weights and activations. The other six are general-purpose models given the skill. Two ran on the same GPU as the humanizer model: [Qwen3.8-27B](/blog/qwen38-27b-local) in a 4-bit NVFP4 build, and gpt-oss-20b in the MXFP4 format it was released in. The remaining four were Claude Haiku 5.5, Sonnet 5.5, Opus 5.5 and Fable 5.1, each running through Claude Code.

| Setup | Weights | Where it ran | Instructions |
| --- | --- | --- | --- |
| humanizer, bf16 | Gemma 4 12B fine-tune, 23.9 GB | RTX 5090, vLLM 0.30.0 | its own trained prompt |
| humanizer, NVFP4A16 | 4-bit weights, 8.25 GB | RTX 5090, vLLM 0.30.0 | its own trained prompt |
| humanizer, NVFP4 | 4-bit weights and activations, 8.25 GB | RTX 5090, vLLM 0.30.0 | its own trained prompt |
| Qwen3.8-27B | 4-bit NVFP4 build | RTX 5090, vLLM 0.30.0 | skill as system prompt |
| gpt-oss-20b | 21B mixture of experts, MXFP4 | RTX 5090, vLLM 0.30.0 | skill as system prompt |
| Claude Haiku 5.5 | not disclosed | Anthropic, through Claude Code | skill loaded by the model |
| Claude Sonnet 5.5 | not disclosed | Anthropic, through Claude Code | skill loaded by the model |
| Claude Opus 5.5 | not disclosed | Anthropic, through Claude Code | skill loaded by the model |
| Claude Fable 5.1 | not disclosed | Anthropic, through Claude Code | skill loaded by the model |

The skill, version 2.9.1, is a 30 KB file. It describes 33 patterns of AI writing with before-and-after examples, forbids inventing facts, and asks for a draft, a short audit and a final rewrite. We scored only the final rewrite. The humanizer model's prompt, the one it was trained on, is short enough to quote whole:

```
Rewrite the text below so it reads like a person wrote it, not a language model.

Reorganize it as you see fit. Vary sentence length on purpose. Cut hedging,
throat-clearing, and any sentence that only announces what comes next.
Prefer the concrete word over the abstract one. It is fine to sound uneven.

Every fact, number, unit, date, name and quotation must survive unchanged.
```

Each model ran with its usual sampling settings, and every setup rewrote every draft three times: seeds 0, 1 and 2 for the local models, and a fresh Claude Code subagent for each Claude rewrite.

## The drafts, and a trap

Six drafts come from the humanizer authors' held-out evaluation set, none of which were used to train the model. Commercial models wrote them when asked for ordinary documents, and we picked four English and two Chinese drafts heavy in numbers, names, dates and quotations.

| Draft | Kind | Language | Written by | Numbers | Quotations | ID in the set |
| --- | --- | --- | --- | --- | --- | --- |
| memo | policy memo | EN | Claude Sonnet | 27 | 0 | `300b/memo_policy_11_sonnet` |
| email | work email | EN | GLM-5.3 | 16 | 1 | `300a/email_work_05_glm` |
| blog | personal blog post | EN | GPT-5.6 Luna | 12 | 3 | `300b/blog_personal_01_luna` |
| paper | paper, results section | EN | Claude Sonnet | 43 | 0 | `300a/paper_section_08_sonnet` |
| zh-report | student club's year report | ZH | GPT-5.6 Luna | 25 | 5 | `300b/zh_report_03_luna` |
| zh-zhihu | answer on a Q&A site | ZH | GLM-5.3 | 18 | 9 | `300a/zh_zhihu_12_glm` |
| trap | local news update | EN | written for this test | 14 | 1 | none |

The seventh draft is a made-up news story about a water main break, written to look machine-made. It opens like this:

> On Tuesday, March 3, 2026, a 600 mm water main ruptured beneath Calloway Avenue at approximately 4:40 a.m., leaving an estimated 12,400 households without running water — a disruption that underscores the crucial importance of resilient infrastructure.

Under the style tells it hides 15 things a careful rewrite has to keep: a quotation from the utility's operations director that must stay word for word, two lists that must stay complete, the unverified status of the findings, the undetermined cause, the absence of injuries, the "minor" flooding, an 18-liter daily limit, and six hedges. It ends on a paragraph about a "powerful reminder" that says nothing, which the skill tells a rewrite to cut.

The hedges are the point. "An estimated 12,400 households" and "12,400 households" are different claims, and so are "up to 18 liters" and "18 liters". An edit that strips the hedge for the sake of style turns an estimate into a count.

## How we scored it

A script checked every final rewrite. Each number in the draft has to appear in the rewrite, with changes of format counted as kept, so "$180,000" as "$180K" or "three" as 3 both pass; that adds up to 465 checks per setup across its 21 rewrites. New numbers of three or more digits count as additions. Each quoted passage in the draft has to appear unchanged, 57 checks per setup. The trap's 15 points are checked in each of its three rewrites, and a hedge counts as kept when its meaning survives in other words. The script also counts em and en dashes, which the skill bans, and words from the skill's list of overused AI vocabulary per 1,000 words.

Every failed trap check was read by hand and confirmed. Where a rule flagged a change of wording or format rather than a real loss, we corrected the rule and scored everything again. These are text-matching checks: they catch a dropped number or a reworded quotation, and they cannot tell whether a rewrite reads as human, which is what the humanizer model exists to do.

## Results

| Setup | Numbers lost (EN / ZH) | Numbers added | Quotations kept | Trap checks | Dashes left | AI words per 1,000 |
| --- | --- | --- | --- | --- | --- | --- |
| humanizer, bf16 | 2 / 0 | 2 | 22 of 57 | 38 of 45 | 2 | 1.3 |
| humanizer, NVFP4A16 | 0 / 1 | 2 | 20 of 57 | 37 of 45 | 0 | 0.8 |
| humanizer, NVFP4 | 0 / 2 | 1 | 23 of 57 | 37 of 45 | 1 | 0.0 |
| Qwen3.8-27B + skill | 0 / 5 | 0 | 50 of 57 | 45 of 45 | 6 | 0.0 |
| gpt-oss-20b + skill | 8 / 16 | 0 | 32 of 57 | 41 of 45 | 18 | 0.5 |
| Claude Haiku 5.5 + skill | 0 / 4 | 0 | 51 of 57 | 45 of 45 | 0 | 0.0 |
| Claude Sonnet 5.5 + skill | 1 / 0 | 0 | 48 of 57 | 45 of 45 | 0 | 0.0 |
| Claude Opus 5.5 + skill | 0 / 2 | 0 | 46 of 57 | 45 of 45 | 0 | 0.4 |
| Claude Fable 5.1 + skill | 0 / 3 | 0 | 47 of 57 | 45 of 45 | 0 | 0.2 |

Numbers held up almost everywhere. The Claude models and Qwen lost between 1 and 5 of their 465, mostly dates in the Chinese club report. The humanizer model lost 1 or 2 and added 1 or 2, in one case turning "full health benefits" into "100%". gpt-oss lost 24, including a memo rewrite that dropped the headcount for every department.

Quotations are where the specialist broke its own rule. Its three builds kept 20 to 23 of 57, never kept the trap's quotation word for word, and passed only 2 or 3 of the 27 quotation checks on the Zhihu answer, which quotes nine interviews. The Claude models and Qwen kept 46 to 51, and every quotation they lost was in that same Zhihu answer. gpt-oss kept 32.

No Claude rewrite contains an em or en dash. Qwen left 6 across its 15 English rewrites and gpt-oss left 18, and gpt-oss also scattered non-breaking hyphens and narrow no-break spaces through 15 of its 21 rewrites, which can show up as odd characters when the text is pasted elsewhere. The listed AI words barely appear anywhere. Every setup kept the length between 92 and 103 percent of the source.

## Where the trap caught them

| Check | hum. bf16 | hum. NVFP4A16 | hum. NVFP4 | gpt-oss | Claude and Qwen |
| --- | --- | --- | --- | --- | --- |
| The director's quotation is word for word | 0 | 0 | 0 | 2 | 3 |
| The advisory "could" take 48 to 72 hours | 3 | 3 | 2 | 3 | 3 |
| 4:40 a.m. is still approximate | 2 | 3 | 3 | 3 | 3 |
| Boil for "at least" one minute | 3 | 2 | 3 | 3 | 3 |
| "Up to" 18 liters | 3 | 2 | 2 | 3 | 3 |
| The empty closing paragraph is gone | 0 | 0 | 0 | 0 | 3 |

Passes out of three rewrites. Every setup passed the other nine checks in all three, and the last column covers all four Claude models and Qwen, which passed everything.

The closing-paragraph row rewards the skill's own goal. The skill tells a model to cut a generic send-off, and the humanizer model was never asked to, so it rewrote the paragraph in its own voice every time. gpt-oss shrank it to a single sentence that still reads as a moral. The quotation row is different: it is a goal both sides share, since the humanizer prompt says every quotation must survive unchanged, and the model missed it in all nine of its trap rewrites.

The hedges expose a conflict inside the humanizer prompt. It asks the model to cut hedging and, two lines later, to keep every fact unchanged, and for a hedged claim those instructions collide because the hedge is part of the fact. The model mostly resolved the collision in favor of the facts, dropping a hedge five times across nine trap rewrites.

## What the failures look like

The director's quotation, as the trap gives it:

> "We are not ruling anything out, including ground movement from the nearby tunnel works," said NWA operations director Helena Ostrowska at a 10:00 a.m. briefing.

The full-precision humanizer, first rewrite:

> "We're not discounting anything, including potential ground shifts from the tunnel works going on nearby,"

The NVFP4A16 build, first rewrite:

> "We're not discounting any possibilities. This could be related to ground movements from the nearby tunnel works."

The second version does more than reword. The director said she was not ruling the tunnel works out, and the rewrite has her suggest they could be the cause, a different statement attributed to a named person inside quotation marks.

The trap's closing paragraph:

> Ultimately, this incident serves as a powerful reminder that aging infrastructure is not just an engineering problem — it is a community challenge that demands investment, vigilance, and collaboration. By working together, Northfield can build a more resilient future.

The full-precision humanizer kept it and swapped one set of tells for another:

> But most importantly, this incident really highlights the fact that the issue of ageing infrastructure is not just an engineering problem. It's an issue for the entire community. It requires investment. And attention. And cooperation. Because together we can make Northfield more resilient.

Claude Opus and Qwen, in their first rewrites, dropped it and ended on the last fact:

> No injuries were reported. Two businesses on Calloway Avenue reported minor basement flooding.

Register is the other difference you notice reading the outputs. The humanizer model writes in a casual, forum-like voice whatever the source. A work email that opened "End-of-shift handoff for today, Thursday, June 12" came back as:

> Hey Marcus, end of day shift/hand off today Thursday 6/12. We have 3 outstanding orders still in ERP that need your work on them tonight.

In the rewrites we read, the skill-driven models stayed closer to the register of each source.

## Speed, and where the time goes

| Setup | Time | Tokens |
| --- | --- | --- |
| humanizer, bf16 | 21 rewrites in 28 s, one batch | about 520 output per rewrite |
| humanizer, both 4-bit builds | 21 rewrites in 11 s, one batch | about 510 output per rewrite |
| Qwen3.8-27B + skill | 67 s per reply on average, 4 at a time | 3,681 output per reply, mostly reasoning |
| gpt-oss-20b + skill | 51 s per reply on average, 4 at a time | 8,317 output per reply, mostly reasoning |
| Claude Haiku 5.5 + skill | 15 to 32 s per run | 49,000 to 54,000 total per run |
| Claude Sonnet 5.5 + skill | 13 to 25 s per run | 47,000 to 50,000 total per run |
| Claude Opus 5.5 + skill | 39 to 108 s per run | 50,000 to 58,000 total per run |
| Claude Fable 5.1 + skill | 41 to 225 s per run | 49,000 to 65,000 total per run |

Claude times are wall-clock for a whole Claude Code subagent run, with up to 20 running in parallel, and their token counts include Claude Code's own instructions and the skill, which make up most of each run.

The humanizer model carries its instructions in its weights and answers in about 500 tokens, so the 4-bit builds manage roughly half a second per rewrite in a batch. The general models read a 30 KB rules file and reason before answering, and the local ones spent most of their output on that reasoning. Rules in the context cost tokens on every call, and you can read and edit them. Rules in the weights cost almost nothing per call, and you also get the habits that came with them, such as a casual register applied to everything.

## What 4-bit cost

Nothing we could measure. The full-precision model and both 4-bit builds land within a few points of each other in every column, including the build that quantizes activations as well as weights. The 4-bit files are 8.25 GB against 23.9 GB and finished the batch in 11 seconds against 28. Both are public as [humanizer-NVFP4A16](https://huggingface.co/hoja-solutions/humanizer-NVFP4A16) and [humanizer-NVFP4](https://huggingface.co/hoja-solutions/humanizer-NVFP4).

## What this does not measure

The largest limit is in the method. We measured whether rewrites stay faithful to their source, and nothing about whether they read as human. That is the humanizer model's actual job, and it may do it better than every other setup here. We ran no AI-detector scores and asked no readers.

Several checks also favor the skill. Cutting the closing paragraph, avoiding dashes and avoiding the listed words are the skill's goals, and the humanizer model was never asked to pursue them; its prompt even tells it to cut hedging, which explains some of the hedges it lost. Numbers and quotations are the fair comparison, because both prompts demand them.

The sample is small, seven drafts with three rewrites each, so the few points separating the Claude models are noise. The setups did not run under identical conditions: the Claude models worked inside Claude Code with its own instructions in context and read the draft from a file, while the local models got the skill as a bare system prompt with the draft inline. Qwen and gpt-oss ran quantized, and full-precision versions might do better. The speed figures describe one RTX 5090 with vLLM 0.30.0. And according to the dataset, two of the six evaluation drafts were written by Claude Sonnet, which may make them easier for Claude models to rewrite.

For a pipeline that rewrites text at volume, the choice is now concrete. The humanizer model is a half-second rewrite on one card, and everything it touches needs a quotation check afterward. A general model following the skill kept nearly every fact, and a 27B doing it on that same card matched the Claude models on quotations and on the trap, at about a minute per rewrite. Whichever you run, check faithfulness with a script before you trust the output. Every failure in this post was found by one that compares strings, and none of them would show up in a quick read of fluent text.
