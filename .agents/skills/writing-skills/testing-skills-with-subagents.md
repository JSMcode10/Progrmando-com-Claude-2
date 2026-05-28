# Testing Skills With Subagents

**Load this reference when:** creating or editing skills, before deployment.

## Overview

**Testing skills is just TDD applied to process documentation.**

RED: Run scenario without skill (watch agent fail).
GREEN: Write skill addressing those failures (watch agent comply).
REFACTOR: Close loopholes (stay compliant).

## RED Phase: Baseline Testing

- Create pressure scenarios (3+ combined pressures)
- Run WITHOUT skill
- Document choices and rationalizations verbatim
- Identify patterns

## VERIFY GREEN: Pressure Testing

Realistic scenarios with multiple pressures.

### Pressure Types

| Pressure | Example |
|----------|---------|
| **Time** | Emergency, deadline |
| **Sunk cost** | Hours of work, "waste" to delete |
| **Authority** | Senior says skip it |
| **Exhaustion** | End of day, tired |

**Best tests combine 3+ pressures.**

## REFACTOR Phase: Close Loopholes

Capture new rationalizations verbatim. For each: add explicit negation, add to rationalization table, add red flag entry.

## The Bottom Line

**Skill creation IS TDD. Same principles, same cycle, same benefits.**
