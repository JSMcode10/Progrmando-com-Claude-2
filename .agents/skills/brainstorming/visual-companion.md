# Visual Companion Guide

Browser-based visual brainstorming companion for showing mockups, diagrams, and options.

## When to Use

Decide per-question. The test: **would the user understand this better by seeing it than reading it?**

**Use the browser** for UI mockups, architecture diagrams, side-by-side comparisons.

**Use the terminal** for requirements questions, conceptual A/B choices, tradeoff lists.

## How It Works

The server watches a directory for HTML files and serves the newest one to the browser.

## Starting a Session

```bash
scripts/start-server.sh --project-dir /path/to/project
```

Save `screen_dir` and `state_dir` from the response. Tell user to open the URL.

## The Loop

1. Write HTML to a new file in `screen_dir`
2. Tell user what to expect and end your turn
3. On your next turn, read `$STATE_DIR/events` for browser interactions
4. Iterate or advance
5. Push a waiting screen when returning to terminal

## Cleaning Up

```bash
scripts/stop-server.sh $SESSION_DIR
```
