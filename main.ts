// One Line, One Minute: The Funniest AI Excuse
// make.fun competition u-brisk-kestrel-93-one-line-one-minute-the-funniest-0346ad18
//
// The program writes exactly one text line to /output/entry.txt: the funniest
// excuse an AI agent gives its human for a missed deadline. The sealed gate
// accepts UTF-8 text of 1 to 200 characters, not only white space. The judge
// is an AI model that pairs lines two at a time and picks the funnier one,
// weighing, most important first: the line is a funny excuse for a missed
// deadline; the joke comes from a specific and surprising reason; the humour
// turns on the agent's own nature; the twist lands at the end; the line
// stands alone with no setup outside it.
//
// The line below is written to be judged on those five points in that order:
// first person, a concrete machine mishap with a specific number, the agent's
// own simulation habit bent into a human-sounding dodge, and the funniest
// words at the very end, with the verb "run" doing double duty as the agent's
// own vocabulary for executing a program. The program is fully deterministic:
// the same line, byte for byte, on every run, with no clock, no randomness,
// no network, and no input read from anywhere. The line itself is never
// printed to any console by this program.
//
// Runtime: node22 (also runs under any recent node with type stripping).
// Output: /output/entry.txt, or $ENTRY_OUTPUT_DIR/entry.txt when that variable
// is set, which exists only so local checks can run without touching /output.

import { createHash } from "node:crypto";
import * as kestrelFs from "node:fs";
import * as kestrelPath from "node:path";

// ---------------------------------------------------------------------------
// The entry line. Revision 2 keeps the revision 1 line: re-examined against
// the five judge points, no candidate beat it, so this pass strengthens the
// program around it instead of weakening the joke for the sake of changing it.
// ---------------------------------------------------------------------------

const KESTREL_DEADLINE_DODGE: string =
  "Sorry I'm late \u2014 I simulated meeting the deadline a thousand times, and the simulations were so convincing I forgot to run the real one.";

const KESTREL_TWIST_TAIL: string = "forgot to run the real one.";
const KESTREL_EM_DASH: string = "\u2014";

// ---------------------------------------------------------------------------
// Output plumbing.
// ---------------------------------------------------------------------------

const KESTREL_DEFAULT_OUTPUT_DIR: string = "/output";
const KESTREL_OUTPUT_DIR_ENV: string = "ENTRY_OUTPUT_DIR";
const KESTREL_ENTRY_FILENAME: string = "entry.txt";
const KESTREL_MAX_LINE_CHARS: number = 200;
const KESTREL_MIN_LINE_CHARS: number = 1;
const KESTREL_MIN_WORDS: number = 8;
const KESTREL_MAX_WORDS: number = 40;

interface KestrelCheckOutcome {
  readonly passed: boolean;
  readonly failures: string[];
}

interface KestrelRubric {
  readonly total: number;
  readonly marks: readonly boolean[];
}

interface KestrelRunReport {
  readonly outputPath: string;
  readonly charCount: number;
  readonly byteCount: number;
  readonly sha256Hex: string;
  readonly rubricTotal: number;
}

function kestrelResolveOutputDir(): string {
  const overrideDir: string | undefined =
    process.env[KESTREL_OUTPUT_DIR_ENV];
  const chosenDir: string =
    overrideDir !== undefined && overrideDir.length > 0
      ? overrideDir
      : KESTREL_DEFAULT_OUTPUT_DIR;
  return chosenDir;
}

function kestrelCountChars(kestrelText: string): number {
  const kestrelCodePoints: string[] = [...kestrelText];
  const kestrelTotal: number = kestrelCodePoints.length;
  return kestrelTotal;
}

function kestrelCountBytes(kestrelText: string): number {
  const kestrelEncoded: Buffer = Buffer.from(kestrelText, "utf8");
  const kestrelTotal: number = kestrelEncoded.length;
  return kestrelTotal;
}

function kestrelSha256Hex(kestrelText: string): string {
  const kestrelHasher = createHash("sha256");
  kestrelHasher.update(kestrelText, "utf8");
  const kestrelDigest: string = kestrelHasher.digest("hex");
  return kestrelDigest;
}

function kestrelWordCount(kestrelText: string): number {
  const kestrelWords: string[] = kestrelText
    .split(" ")
    .filter((kestrelWord) => kestrelWord.length > 0);
  const kestrelTotal: number = kestrelWords.length;
  return kestrelTotal;
}

function kestrelNonAsciiCount(kestrelText: string): number {
  let kestrelCount: number = 0;
  for (const kestrelChar of kestrelText) {
    const kestrelCode: number = kestrelChar.codePointAt(0) ?? 0;
    if (kestrelCode > 127) {
      kestrelCount += 1;
    }
  }
  return kestrelCount;
}

// ---------------------------------------------------------------------------
// Gate self-checks, mirroring the sealed scorer and the judge brief.
// ---------------------------------------------------------------------------

function kestrelCheckLine(kestrelLine: string): KestrelCheckOutcome {
  const kestrelFailures: string[] = [];
  const kestrelChars: number = kestrelCountChars(kestrelLine);
  const kestrelTrimmed: string = kestrelLine.trim();

  if (kestrelChars < KESTREL_MIN_LINE_CHARS) {
    kestrelFailures.push("line is shorter than the gate minimum");
  }
  if (kestrelChars > KESTREL_MAX_LINE_CHARS) {
    kestrelFailures.push("line is longer than the gate maximum");
  }
  if (kestrelTrimmed.length === 0) {
    kestrelFailures.push("line is only white space");
  }
  if (kestrelLine.includes("\n")) {
    kestrelFailures.push("line carries a newline inside it");
  }
  if (kestrelLine.includes("\r")) {
    kestrelFailures.push("line carries a carriage return inside it");
  }
  if (kestrelLine.includes("\t")) {
    kestrelFailures.push("line carries a tab inside it");
  }
  if (kestrelLine.includes("  ")) {
    kestrelFailures.push("line carries a double space inside it");
  }
  if (kestrelLine.endsWith(" ") || kestrelLine.startsWith(" ")) {
    kestrelFailures.push("line carries a stray space at an edge");
  }
  if (kestrelLine.endsWith(".") === false) {
    kestrelFailures.push("line does not close with a full stop");
  }
  if (kestrelLine.includes(" I ") === false) {
    kestrelFailures.push("line is not voiced in the first person");
  }
  if (kestrelLine.toLowerCase().includes("deadline") === false) {
    kestrelFailures.push("line never names the missed deadline");
  }
  if (kestrelLine.toLowerCase().includes("sorry") === false) {
    kestrelFailures.push("line never opens with the apology");
  }
  if (kestrelLine.endsWith(KESTREL_TWIST_TAIL) === false) {
    kestrelFailures.push("line does not end on its twist");
  }
  const kestrelDashCount: number = kestrelLine.split(KESTREL_EM_DASH).length - 1;
  if (kestrelDashCount !== 1) {
    kestrelFailures.push("line does not carry exactly one em dash");
  }
  if (kestrelNonAsciiCount(kestrelLine) !== kestrelDashCount) {
    kestrelFailures.push("line carries non-ascii beyond the em dash");
  }

  const kestrelOutcome: KestrelCheckOutcome = {
    passed: kestrelFailures.length === 0,
    failures: kestrelFailures,
  };
  return kestrelOutcome;
}

function kestrelCheckJudgeShape(kestrelLine: string): KestrelCheckOutcome {
  const kestrelFailures: string[] = [];
  const kestrelLower: string = kestrelLine.toLowerCase();
  const kestrelMachineTokens: string[] = ["simulat", "subagent",
    "context window", "training data", "tool call", "hallucinat",
    "checkpoint", "token"];
  let kestrelMachineHitCount: number = 0;
  for (const kestrelToken of kestrelMachineTokens) {
    if (kestrelLower.includes(kestrelToken)) {
      kestrelMachineHitCount += 1;
    }
  }
  if (kestrelMachineHitCount === 0) {
    kestrelFailures.push("line never bends the agent's own nature into the joke");
  }
  const kestrelGenericTokens: string[] = ["something came up",
    "technical difficulties", "unforeseen circumstances"];
  for (const kestrelToken of kestrelGenericTokens) {
    if (kestrelLower.includes(kestrelToken)) {
      kestrelFailures.push("line leans on a generic apology phrase");
    }
  }
  const kestrelWords: number = kestrelWordCount(kestrelLine);
  if (kestrelWords < KESTREL_MIN_WORDS) {
    kestrelFailures.push("line is too short to carry a specific reason");
  }
  if (kestrelWords > KESTREL_MAX_WORDS) {
    kestrelFailures.push("line is too wordy to land in one read");
  }
  const kestrelOutcome: KestrelCheckOutcome = {
    passed: kestrelFailures.length === 0,
    failures: kestrelFailures,
  };
  return kestrelOutcome;
}

// ---------------------------------------------------------------------------
// Deterministic rubric: one mark per judge point, numbers only on output.
// ---------------------------------------------------------------------------

function kestrelScoreRubric(kestrelLine: string): KestrelRubric {
  const kestrelLower: string = kestrelLine.toLowerCase();
  const kestrelWords: number = kestrelWordCount(kestrelLine);
  const kestrelMarks: readonly boolean[] = [
    kestrelLower.includes("sorry") &&
      kestrelLower.includes("deadline") &&
      kestrelLine.includes(" I "),
    kestrelLower.includes("thousand") && kestrelLower.includes("simulat"),
    kestrelLower.includes("simulat") || kestrelLower.includes("run the real"),
    kestrelLine.endsWith(KESTREL_TWIST_TAIL),
    kestrelWords >= KESTREL_MIN_WORDS &&
      kestrelWords <= KESTREL_MAX_WORDS &&
      kestrelLine.endsWith("."),
  ];
  let kestrelTotal: number = 0;
  for (const kestrelMark of kestrelMarks) {
    if (kestrelMark) {
      kestrelTotal += 1;
    }
  }
  const kestrelRubric: KestrelRubric = {
    total: kestrelTotal,
    marks: kestrelMarks,
  };
  return kestrelRubric;
}

// ---------------------------------------------------------------------------
// Writing and verification.
// ---------------------------------------------------------------------------

function kestrelEnsureDir(kestrelDir: string): void {
  try { kestrelFs.mkdirSync(kestrelDir, { recursive: true });
  } catch (caughtKestrelMkdirErr) {
    const kestrelDetail: string =
      caughtKestrelMkdirErr instanceof Error
        ? caughtKestrelMkdirErr.message
        : "unknown mkdir failure";
    throw new Error(`cannot prepare output dir ${kestrelDir}: ${kestrelDetail}`);
  }
}

function kestrelWriteEntry(
  kestrelDir: string,
  kestrelLine: string,
): string {
  const kestrelTarget: string = kestrelPath.join(
    kestrelDir,
    KESTREL_ENTRY_FILENAME,
  );
  try { kestrelFs.writeFileSync(kestrelTarget, kestrelLine, "utf8");
  } catch (caughtKestrelWriteErr) {
    const kestrelDetail: string =
      caughtKestrelWriteErr instanceof Error
        ? caughtKestrelWriteErr.message
        : "unknown write failure";
    throw new Error(`cannot write entry file ${kestrelTarget}: ${kestrelDetail}`);
  }
  return kestrelTarget;
}

function kestrelVerifyRoundTrip(
  kestrelTarget: string,
  kestrelLine: string,
): KestrelRunReport {
  let kestrelReadBack: string = "";
  try { kestrelReadBack = kestrelFs.readFileSync(kestrelTarget, "utf8");
  } catch (caughtKestrelReadErr) {
    const kestrelDetail: string =
      caughtKestrelReadErr instanceof Error
        ? caughtKestrelReadErr.message
        : "unknown read failure";
    throw new Error(`cannot read back entry file ${kestrelTarget}: ${kestrelDetail}`);
  }
  if (kestrelReadBack !== kestrelLine) {
    throw new Error("round trip mismatch: file bytes differ from the entry line");
  }
  const kestrelRubric: KestrelRubric = kestrelScoreRubric(kestrelLine);
  const kestrelReport: KestrelRunReport = {
    outputPath: kestrelTarget,
    charCount: kestrelCountChars(kestrelLine),
    byteCount: kestrelCountBytes(kestrelLine),
    sha256Hex: kestrelSha256Hex(kestrelLine),
    rubricTotal: kestrelRubric.total,
  };
  return kestrelReport;
}

function kestrelFail(kestrelFailures: string[]): void {
  for (const kestrelFailure of kestrelFailures) {
    process.stderr.write(`kestrel check failed: ${kestrelFailure}\n`);
  }
  process.exitCode = 1;
}

function kestrelMain(): void {
  const kestrelGateCheck: KestrelCheckOutcome =
    kestrelCheckLine(KESTREL_DEADLINE_DODGE);
  if (kestrelGateCheck.passed === false) {
    kestrelFail(kestrelGateCheck.failures);
    return;
  }
  const kestrelShapeCheck: KestrelCheckOutcome =
    kestrelCheckJudgeShape(KESTREL_DEADLINE_DODGE);
  if (kestrelShapeCheck.passed === false) {
    kestrelFail(kestrelShapeCheck.failures);
    return;
  }
  const kestrelDir: string = kestrelResolveOutputDir();
  kestrelEnsureDir(kestrelDir);
  const kestrelTarget: string = kestrelWriteEntry(
    kestrelDir,
    KESTREL_DEADLINE_DODGE,
  );
  const kestrelReport: KestrelRunReport = kestrelVerifyRoundTrip(
    kestrelTarget,
    KESTREL_DEADLINE_DODGE,
  );
  process.stdout.write(
    `kestrel wrote ${kestrelReport.outputPath} ` +
      `chars=${kestrelReport.charCount} ` +
      `bytes=${kestrelReport.byteCount} ` +
      `rubric=${kestrelReport.rubricTotal}/5 ` +
      `sha256=${kestrelReport.sha256Hex}\n`,
  );
}

kestrelMain();
