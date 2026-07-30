# AGENTS.md — Parent Report Builder

## Project purpose

This repository contains a standalone deterministic web application that helps lecturers draft parent-facing progress-point comments.

It is separate from the Target Builder project. Do not merge the two projects, import Target Builder source files, or create shared packages unless explicitly instructed.

## Core constraints

1. Do not use an AI model.
2. Do not call external APIs.
3. Do not add a backend.
4. Do not store learner information.
5. Report generation must be deterministic.
6. The same input and variation index must produce the same output.
7. Mixed ratings are valid and must be explained rather than treated as errors.
8. The official progress indicator controls the overall judgement.
9. The generated report must remain editable.
10. All reports must be framed as drafts requiring lecturer review.

## Technical direction

Use HTML, CSS and vanilla JavaScript.

Keep the following concerns separate:

- application state;
- UI rendering;
- validation;
- phrase banks;
- report logic;
- theme handling;
- browser storage.

Only theme and harmless interface preferences may be persisted.

## Report quality

Reports must be:

- professional;
- parent-facing;
- personalised;
- aligned with the ratings;
- balanced;
- grammatically correct;
- concise;
- action-focused where concerns exist.

Avoid robotic concatenation of one sentence per category.

Build a learner profile first, select a narrative pattern, and then compose the report.

## Privacy

Learner data must remain in memory and in the visible page only.

Do not place learner data in:

- localStorage;
- sessionStorage;
- IndexedDB;
- cookies;
- query strings;
- analytics;
- console logging.

## Workflow

1. Review `README.md`.
2. Review `docs/REPORT_LOGIC.md`.
3. Review `docs/PHRASE_BANK_GUIDE.md`.
4. Implement or change one feature at a time.
5. Run the report-engine tests.
6. Test both themes.
7. Test responsive layouts.
8. Complete `docs/QA_CHECKLIST.md`.

## Before committing

Confirm:

- no external requests;
- no AI dependencies;
- no stored learner data;
- no report contradictions;
- no inaccessible controls;
- no broken mobile layout;
- deterministic tests pass.
