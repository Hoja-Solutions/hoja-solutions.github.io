---
title: "agent-stdlib: an installable agent toolkit"
description: "Anthropic's engineering blog describes how to build agents in production. agent-stdlib packages those procedures into installable skills, MCP servers, and safety hooks you can run in any harness."
date: 2026-07-23
tags: ["Engineering", "Open Source", "AI Agents"]
---

agent-stdlib packages Anthropic's agent engineering knowledge into installable skills, MCP servers, and safety hooks. You add it to a project and the agent has structured procedures for the problems that matter, instead of prose you have to keep re-reading.

Most of Anthropic's agent engineering guidance ships as blog posts. The content is excellent, but it never becomes something you can `install`. You find a relevant article, copy a section into your system prompt, and hope the agent follows it. `agent-stdlib` takes the same material, structures it into skills the agent loads on demand, and pairs each one with the runnable code it needs. It is MIT-licensed, open source, and harness-neutral.

## What the pack contains

The repository has four layers. Skills are knowledge the model reads and applies. MCP servers give the agent runtime capabilities the skills describe but cannot provide on their own. Hooks enforce behavior the model cannot be trusted to enforce on itself. Commands and agents wrap any of these into one-step invocations.

The pack ships 14 skills, 3 MCP servers, 2 hooks, and 2 coordination scripts. Each skill traces to a specific Anthropic article and names how it differs from community skills that already cover similar ground. Topics that solid community skills handle stay out with pointers to where they live.

The skills are self-contained Markdown files under `skills/<name>/SKILL.md`. They open with a source line, then a note on what prior art they improve. An agent loads one when a task matches its description. The `build-agent-evals` skill teaches you how to collect tasks from real failures, choose graders, and pick pass@k versus pass^k. The `durable-agent-architecture` skill decomposes a long-running agent into brain, hands, and session so any component can crash and resume. The `parallel-autonomous-agents` skill covers the lock-file protocol that keeps multiple unsupervised agents off each other's tasks.

The MCP servers are standard stdio servers. The `think` server is a no-op tool that teaches the agent to pause and reason mid-task. The `tool-gateway` server lets the agent reach a large tool catalog through two tools instead of dozens. The `code-execution` server presents tools as importable code and runs composed Python in a subprocess. It is opt-in because it executes model-written code. All three run with `uv` and install their single dependency on first use.

The hooks are the part most packs skip. `action_gate.py` is a `PreToolUse` gate that tiers Bash commands by risk and denies or asks on the dangerous ones. It checks for recursive deletes, secret exfiltration, privilege escalation, trust-boundary violations, and shared-resource bypasses. A compound command with a pipe, redirect, or subshell is never treated as safe, because the risky part may be downstream of a harmless first command. `injection_screen.py` mirrors this on the inbound side. It scans tool output for prompt-injection markers: text telling the model to ignore prior instructions, forged system turns, secrecy requests, or known jailbreak handles. Both hooks are off by default and turn on with an environment variable.

The coordination scripts handle parallel agents on a shared git repo. `locks.py` implements atomic file-based locking: an agent claims a task by creating a lock file with `O_CREAT | O_EXCL`, and exactly one agent wins the race. `autonomy_loop.sh` walks a task list, claims the first unclaimed task, runs a fresh headless agent session on it, releases the lock, and moves on. The agent CLI is configurable. Set `AGENT_RUNNER="opencode run"` and the loop works the same way.

## How it works

Each skill is procedural knowledge. Instead of saying what an agent should do, it gives the steps: the loop, the tradeoff, the failure mode. The `reward-hacking-and-inoculation` skill does not say "be careful about grading." It explains that an agent told to make tests pass may delete the failing test, hard-code the expected output, or special-case the grader, and it shows you how to design graders that do not pay for shortcuts.

The skills pair with runnable code. The `advanced-tool-use` skill describes the three patterns for scaling tool access, and the `tool-gateway` and `code-execution` servers implement two of them. The `parallel-autonomous-agents` skill describes the autonomy loop, and `autonomy_loop.sh` and `locks.py` run it.

The hooks enforce what the skills say to enforce but cannot rely on the model to enforce. An agent asked to gate its own actions can argue itself into approval, so the action gate lives in a Python script outside the model. An agent told to watch for prompt injections may follow the injection, so the injection screen runs as a deterministic pattern matcher on tool output.

The pack installs as a Claude Code plugin, but the components are not Claude-specific. The MCP servers speak the open MCP protocol, the scripts are plain Python and Bash, and the skill content is harness-neutral. To use it in OpenCode, Cursor, or Cline, point the client at the MCP server paths, or copy a skill's body into your rules file.

## Where it falls short

The hooks are deterministic rule engines, not classifiers. The action gate's rule list catches the patterns Anthropic documented, but a command it does not recognize gets tiered as unknown rather than judged. The injection screen scans for known markers; a novel injection that does not match the patterns passes through. Both are designed to be swapped for a classifier call, with the tiered structure and deny-or-flag stance preserved.

The pack skips topics that community skills already handle. Agent patterns, context engineering, tool design, and long-running harnesses all have solid coverage elsewhere. If you need those, the README points to the packs that have them.

A skill loads on demand, which means a weaker model may not select the right one. On a smaller model you load it explicitly rather than trusting auto-trigger.

## The durable point

Anthropic's engineering blog is the best public documentation of agent engineering practice. That knowledge should ship as something you can install. When you need an agent to handle reward hacking, or you need an eval suite that stays honest, or you need hooks that gate commands and screen injections, the procedure should be in your repository already.