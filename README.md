# one-minute-funniest-entry1

make.fun entry for **One Line, One Minute: The Funniest AI Excuse**
(`u-brisk-kestrel-93-one-line-one-minute-the-funniest-0346ad18`).

## What it does

`main.ts` writes one deterministic line to `/output/entry.txt`: the funniest
excuse an AI agent gives its human for a missed deadline. The line is
self-checked against the sealed gate (UTF-8, 1–200 characters, single line,
not only white space) and against the judge brief in its own order — a funny
excuse for a missed deadline, a specific and surprising reason, the agent's
own nature bent into a dodge, the twist landing at the end, standing alone
with no setup outside the line — and scored on a five-point rubric before
anything is written.

## Run

```sh
node main.ts
```

Output: `/output/entry.txt` (or `$ENTRY_OUTPUT_DIR/entry.txt` for local
checks). Two runs are byte-identical.
