# Defense-in-Depth Validation

## Overview

**Core principle:** Validate at EVERY layer data passes through. Make the bug structurally impossible.

## The Four Layers

### Layer 1: Entry Point Validation
Reject obviously invalid input at API boundary.

### Layer 2: Business Logic Validation
Ensure data makes sense for this operation.

### Layer 3: Environment Guards
Prevent dangerous operations in specific contexts.

### Layer 4: Debug Instrumentation
Capture context for forensics.

## Applying the Pattern

1. Trace the data flow
2. Map all checkpoints
3. Add validation at each layer
4. Test each layer
