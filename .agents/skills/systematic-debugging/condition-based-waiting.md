# Condition-Based Waiting

## Overview

Flaky tests often guess at timing with arbitrary delays.

**Core principle:** Wait for the actual condition you care about, not a guess about how long it takes.

## Core Pattern

```typescript
// ❌ BEFORE: Guessing at timing
await new Promise(r => setTimeout(r, 50));

// ✅ AFTER: Waiting for condition
await waitFor(() => getResult() !== undefined);
```

## Implementation

```typescript
async function waitFor<T>(
  condition: () => T | undefined | null | false,
  description: string,
  timeoutMs = 5000
): Promise<T> {
  const startTime = Date.now();
  while (true) {
    const result = condition();
    if (result) return result;
    if (Date.now() - startTime > timeoutMs) {
      throw new Error(`Timeout waiting for ${description} after ${timeoutMs}ms`);
    }
    await new Promise(r => setTimeout(r, 10));
  }
}
```

See `condition-based-waiting-example.ts` for complete implementation.
