# Root Cause Tracing

## Overview

**Core principle:** Trace backward through the call chain until you find the original trigger, then fix at the source.

## The Tracing Process

1. Observe the Symptom
2. Find Immediate Cause
3. Ask: What Called This?
4. Keep Tracing Up
5. Find Original Trigger

## Adding Stack Traces

```typescript
async function gitInit(directory: string) {
  const stack = new Error().stack;
  console.error('DEBUG git init:', { directory, cwd: process.cwd(), stack });
  await execFileAsync('git', ['init'], { cwd: directory });
}
```

**NEVER fix just where the error appears.** Trace back to find the original trigger.
