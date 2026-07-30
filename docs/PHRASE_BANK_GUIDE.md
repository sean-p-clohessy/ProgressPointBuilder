# Phrase bank guide

## Organisation

Phrase banks will be grouped by purpose, rating band, category, narrative pattern, context, report length, and controlled tone. UI copy and phrase data must remain separate from composition logic.

## Placeholders and grammar tokens

Supported tokens should include learner name; subject, object, possessive and reflexive pronouns; capitalised forms; course; reporting period; percentages; and controlled actions. Name-only mode must have dedicated grammatical templates.

## Adding phrases

1. Place the phrase in the narrowest relevant bank.
2. Preserve the exact meaning of its rating band.
3. Use supported placeholders only.
4. Check singular-they and name-only grammar.
5. Add test coverage for the phrase and its contrast rules.
6. Confirm deterministic selection still holds.

## Banned phrasing

Do not include rating numbers, internal status labels, aggressive or clinical wording, unsupported claims, unexplained jargon, or language that blames a learner for sensitive circumstances. Avoid vague praise and repetitive sentence openings.

## Testing

Test every phrase with standard pronoun sets, custom pronouns, name-only mode, names ending in “s”, and adjacent sentences. Confirm punctuation, capitalisation, meaning, and absence of contradiction.
