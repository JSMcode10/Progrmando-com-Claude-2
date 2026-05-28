---
name: subagent-driven-development
description: Use when executing implementation plans with independent tasks in the current session
---

# Subagent-Driven Development

Execute plan by dispatching fresh subagent per task, with two-stage review after each: spec compliance review first, then code quality review.

**Core principle:** Fresh subagent per task + two-stage review (spec then quality) = high quality, fast iteration

**Continuous execution:** Do not pause to check in with your human partner between tasks. Execute all tasks from the plan without stopping.

## The Process

1. Read plan, extract all tasks, create TodoWrite
2. For each task:
   - Dispatch implementer subagent
   - Dispatch spec reviewer subagent
   - Dispatch code quality reviewer subagent
   - Mark task complete
3. Dispatch final code reviewer for entire implementation
4. Use superpowers:finishing-a-development-branch

## Prompt Templates

- `./implementer-prompt.md` - Dispatch implementer subagent
- `./spec-reviewer-prompt.md` - Dispatch spec compliance reviewer subagent
- `./code-quality-reviewer-prompt.md` - Dispatch code quality reviewer subagent

## Integration

**Required workflow skills:**
- **superpowers:using-git-worktrees** - Ensures isolated workspace
- **superpowers:writing-plans** - Creates the plan this skill executes
- **superpowers:requesting-code-review** - Code review template
- **superpowers:finishing-a-development-branch** - Complete development after all tasks
