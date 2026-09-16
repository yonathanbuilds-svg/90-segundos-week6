# Decisions

## 2026-09-16 - Packet close

- Chose the Family Rehearsal vacuum because the household decision gap is specific, testable, and reachable with a phone-first prototype.
- Chose inline Three.js instead of claiming full VR. The course permits a labeled video simulation; inline real-time 3D is a stronger honest slice while WebXR remains a later step.
- Chose deterministic adaptive logic instead of an opaque ML model. With no training set, calling a heuristic "AI" would be dishonest. The rule is visible and unit-tested.
- Chose voice as the third Dragon Stack layer, opt-in and capability-detected.
- Limited the experience to three scenarios to honor the possibility-inflation lesson.

Tomorrow's first move: implement and test the pure decision engine before connecting it to the interface.

## 2026-09-16 - First build close

- Implemented the adaptive engine as pure functions so its behavior can be tested without the interface.
- Built an inline real-time Three.js room rather than a prerecorded video; the label makes clear that it is a simulation, not an alert.
- Added Spanish browser voice only as an optional input. Unsupported browsers receive a visible fallback and touch/keyboard always remain available.
- Limited device pixel ratio to reduce GPU load on phones.

Tomorrow's first move: run mechanical and mobile tests, record one defect, fix it, then redeploy.

## 2026-09-16 - Test close

- Mechanical pass found and fixed a voice/timer race that could record an invisible late answer.
- Persona pass found that the household profile behaved like a decorative control. It now changes a concrete support cue.
- Preserved the evidence boundary in the debrief: session behavior is not real-world readiness.

Tomorrow's first move: capture the final demo, publish the source, and submit only after links and videos are verified.
