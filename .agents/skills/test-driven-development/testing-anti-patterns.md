# Testing Anti-Patterns

**Load this reference when:** writing or changing tests, adding mocks, or tempted to add test-only methods to production code.

## The Iron Laws

```
1. NEVER test mock behavior
2. NEVER add test-only methods to production classes
3. NEVER mock without understanding dependencies
```

## Anti-Pattern 1: Testing Mock Behavior

Test real behavior, not that the mock exists.

## Anti-Pattern 2: Test-Only Methods in Production

Put test utilities in test-utils/, not in production classes.

## Anti-Pattern 3: Mocking Without Understanding

Understand side effects before mocking. Mock at the correct level.

## Anti-Pattern 4: Incomplete Mocks

Mock the COMPLETE data structure as it exists in reality.

## The Bottom Line

**Mocks are tools to isolate, not things to test.**
