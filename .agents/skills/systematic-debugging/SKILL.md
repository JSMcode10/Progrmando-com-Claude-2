---
name: systematic-debugging
description: Use when encountering any bug, test failure, or unexpected behavior, before proposing fixes
---

# Systematic Debugging

## Overview

Random fixes waste time and create new bugs. Quick patches mask underlying issues.

**Core principle:** ALWAYS find root cause before attempting fixes. Symptom fixes are failure.

## The Iron Law

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

## The Four Phases

### Phase 1: Root Cause Investigation

1. Read Error Messages Carefully
2. Reproduce Consistently
3. Check Recent Changes
4. Gather Evidence in Multi-Component Systems
5. Trace Data Flow

### Phase 2: Pattern Analysis

1. Find Working Examples
2. Compare Against References
3. Identify Differences
4. Understand Dependencies

### Phase 3: Hypothesis and Testing

1. Form Single Hypothesis
2. Test Minimally
3. Verify Before Continuing

### Phase 4: Implementation

1. Create Failing Test Case
2. Implement Single Fix
3. Verify Fix
4. If Fix Doesn't Work - STOP and re-analyze

## Supporting Techniques

- **`root-cause-tracing.md`** - Trace bugs backward through call stack
- **`defense-in-depth.md`** - Add validation at multiple layers
- **`condition-based-waiting.md`** - Replace arbitrary timeouts

**Related skills:**
- **superpowers:test-driven-development** - For creating failing test case
- **superpowers:verification-before-completion** - Verify fix worked
