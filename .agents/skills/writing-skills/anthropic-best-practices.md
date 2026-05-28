# Skill authoring best practices

> Learn how to write effective Skills that Claude can discover and use successfully.

Good Skills are concise, well-structured, and tested with real usage.

## Core principles

### Concise is key

The context window is a public good. Only add context Claude doesn't already have.

### Set appropriate degrees of freedom

Match the level of specificity to the task's fragility and variability.

- **High freedom** (text-based instructions): Use when multiple approaches are valid
- **Medium freedom** (pseudocode): Use when a preferred pattern exists
- **Low freedom** (specific scripts): Use when operations are fragile and must be exact

## Skill structure

### Naming conventions

Use gerund form (verb + -ing): "Processing PDFs", "Analyzing spreadsheets".

### Writing effective descriptions

Always write in third person. Be specific and include key terms. Include both what the Skill does and specific triggers/contexts.

## Checklist for effective Skills

- [ ] Description is specific and includes key terms
- [ ] SKILL.md body is under 500 lines
- [ ] No time-sensitive information
- [ ] Consistent terminology throughout
- [ ] At least three evaluations created
- [ ] Tested with real usage scenarios
