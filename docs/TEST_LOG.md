# Mechanical test log

## Pass 1

- 10 engine tests passed.
- Production build passed.
- Keyboard A/B/C and touch share the same constrained input path.
- No network storage, free-text database input, secret, or real-person data exists.

## Bug found

When the timer reached zero while browser voice recognition was listening, recognition could finish after the UI had moved to feedback. Because the callback did not verify the active panel, it could record an answer for the next scenario invisibly.

## Fix

- Stop voice recognition on timer expiry.
- Ignore all choices unless the simulation panel is currently active.
- Rebuilt and reran the full test suite.

## Persona pass

The household profile initially changed only its visual selection state. The persona correctly treated this as a broken promise. The profile now changes a scenario cue and uses non-judgmental wording.
