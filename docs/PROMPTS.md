# Prompts and build instructions

## Packet challenge

> Do not give me an earthquake information app. Challenge whether a phone-based 3D rehearsal can produce behavior evidence without pretending that a simulation proves real readiness. Keep the product to three scenarios and expose every simulated capability.

## Implementation prompt

Build a mobile-first single-page web prototype named 90 Segundos. Use Vite, vanilla JavaScript, and Three.js. The first viewport must begin the activity rather than advertise it. Create one inline 3D apartment scene and three timed, branching earthquake decisions. Implement an explainable adaptive engine: after safe answers reduce cues and shorten the next timer; after an unsafe answer show one concise consequence and add one cue. Add optional Spanish browser voice input with a clear unsupported fallback. Store nothing remotely. Label the experience "Simulación formativa" and say it neither predicts earthquakes nor certifies readiness. Include keyboard support, reduced-motion handling, unit tests for the engine and voice parser, and a Vercel-ready build. Commit in small slices and close every work session by updating DECISIONS.md.

## Acceptance criteria

- User completes exactly three scenario decisions.
- Scene is rendered in real-time 3D, with a non-WebGL fallback.
- Adaptive timer/cues change based on prior performance.
- Touch, keyboard, and optional voice can select A/B/C.
- Result distinguishes simulation performance from real-world capacity.
- No secret, account, personal data, or unvalidated free text.
- `npm test` and `npm run build` pass.
