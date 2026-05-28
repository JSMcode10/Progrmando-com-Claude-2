---
name: finishing-a-development-branch
description: Use when implementation is complete, all tests pass, and you need to decide how to integrate the work - guides completion of development work by presenting structured options for merge, PR, or cleanup
---

# Finishing a Development Branch

## Overview

Guide completion of development work by presenting clear options and handling chosen workflow.

**Core principle:** Verify tests → Detect environment → Present options → Execute choice → Clean up.

**Announce at start:** "I'm using the finishing-a-development-branch skill to complete this work."

## The Process

### Step 1: Verify Tests

Run project's test suite. If tests fail, stop. If tests pass, continue.

### Step 2: Detect Environment

Determine workspace state before presenting options.

### Step 3: Determine Base Branch

Find the branch this diverged from.

### Step 4: Present Options

```
Implementation complete. What would you like to do?

1. Merge back to <base-branch> locally
2. Push and create a Pull Request
3. Keep the branch as-is (I'll handle it later)
4. Discard this work

Which option?
```

### Step 5: Execute Choice

Follow the chosen option to completion.

### Step 6: Cleanup Workspace

Only for Options 1 and 4. Options 2 and 3 preserve the worktree.
