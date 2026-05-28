---
name: using-git-worktrees
description: Use when starting feature work that needs isolation from current workspace or before executing implementation plans - ensures an isolated workspace exists via native tools or git worktree fallback
---

# Using Git Worktrees

## Overview

Ensure work happens in an isolated workspace. Prefer your platform's native worktree tools. Fall back to manual git worktrees only when no native tool is available.

**Core principle:** Detect existing isolation first. Then use native tools. Then fall back to git. Never fight the harness.

**Announce at start:** "I'm using the using-git-worktrees skill to set up an isolated workspace."

## Step 0: Detect Existing Isolation

Check if you are already in an isolated workspace before creating anything.

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
```

If `GIT_DIR != GIT_COMMON` (and not a submodule): Already in a linked worktree. Skip to Step 3.

## Step 1: Create Isolated Workspace

Try native worktree tools first. Fall back to `git worktree add` only if no native tool exists.

## Step 3: Project Setup

Auto-detect and run appropriate setup (npm install, cargo build, etc.)

## Step 4: Verify Clean Baseline

Run tests to ensure workspace starts clean.
