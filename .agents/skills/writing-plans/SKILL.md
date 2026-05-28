---
name: writing-plans
description: Use when you have a spec or requirements for a multi-step task, before touching code
---

# Writing Plans

## Overview

Write comprehensive implementation plans assuming the engineer has zero context for our codebase. Document everything they need: which files to touch, code, testing, how to test it. DRY. YAGNI. TDD. Frequent commits.

**Announce at start:** "I'm using the writing-plans skill to create the implementation plan."

**Save plans to:** `docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md`

## Plan Document Header

**Every plan MUST start with this header:**

```markdown
# [Feature Name] Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** [One sentence describing what this builds]

**Architecture:** [2-3 sentences about approach]

**Tech Stack:** [Key technologies/libraries]

---
```

## Task Structure

Each task has:
- Files to create/modify/test
- Step-by-step instructions with actual code
- Exact commands with expected output
- Commit step

## No Placeholders

Never write "TBD", "TODO", "implement later", or "add appropriate error handling".

## Execution Handoff

After saving the plan, offer:
1. **Subagent-Driven (recommended)** - fresh subagent per task
2. **Inline Execution** - execute tasks in this session
