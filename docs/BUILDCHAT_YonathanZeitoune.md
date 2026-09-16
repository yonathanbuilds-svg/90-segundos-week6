# Build Chat - Week 6

**Builder:** Yonathan Zeitoune Mattout  
**Product:** 90 Segundos  
**Declared slice:** A phone-first family earthquake rehearsal with real-time 3D, explainable adaptation, and optional voice.

## 1. Packet challenge before code

**Builder prompt:** Do not give me an earthquake information app. Challenge whether a phone-based 3D rehearsal can produce behavior evidence without pretending that a simulation proves real readiness. Keep the product to three scenarios and expose every simulated capability.

**Model:** The strongest technical claim is not "VR feels real." It is "branching practice can expose and correct an unsafe instinct." A headset is optional until the product proves that behavior loop. Make the first slice browser-based, measure only in-simulation actions, and refuse to convert them into a universal readiness score.

**Builder:** I agree. The first version will be inline 3D, not fake full VR. WebXR is the upgrade path. The adaptive layer will be deterministic because there is no validated training set.

**Decision:** Packet approved before implementation. Primary vacuum: Family Rehearsal. Shadow clause: minimum necessary intensity.

## 2. Implementation prompt

**Builder prompt:** Build a mobile-first single-page prototype named 90 Segundos with Vite, vanilla JavaScript, and Three.js. Open on the activity, not a marketing page. Create one inline 3D apartment and three timed decisions. After safe answers, reduce cues and time; after unsafe answers, add one cue. Add optional Spanish browser voice input with an unsupported fallback. Store nothing remotely. Label the experience formative and say it does not predict earthquakes or certify readiness. Include keyboard support, reduced motion, unit tests, and a Vercel-ready build.

**Model:** I will isolate the decision engine first so the adaptive rules can be tested without the UI. Then I will connect the interface, 3D scene, and voice as separate layers. This keeps the Dragon Stack multiplicative and makes the evidence honest.

## 3. Engine argument

**Model:** Should a safe answer always make the next scenario harder?

**Builder:** Yes, but difficulty must remain humane. Shorten time only to a safe floor and remove prompts gradually. The product is practice, not punishment.

**Model:** What happens after an incorrect answer?

**Builder:** No negative personal label. Show one concrete consequence, reset the streak, and add one cue to the next scenario. Preserve the distinction between an unsafe choice in one scene and an unsafe person.

**Implemented:** Pure session state, three scenarios, safe/unsafe scoring, timer floor, timeout event, and Spanish A/B/C normalization.

**Mechanical result:** 10/10 engine tests passed.

## 4. Interface argument

**Model:** The image-generated mockup presents a cinematic apartment. Reproducing that literally could make the page heavy. What is the priority?

**Builder:** The live behavior matters more than photorealism. Use a lightweight real-time room with a table, window, door, shelf, and visible motion. Keep the decision cards large on mobile.

**Model:** Should the product explain itself before the first action?

**Builder:** Only enough to set the evidence boundary and choose the household profile. The first viewport must begin the activity, not sell it.

**Implemented:** Dark emergency-training interface, three large choices, keyboard input, timer, visible adaptation label, and a debrief that refuses a readiness claim.

## 5. Dragon Stack

**3D / simulation:** Three.js renders an apartment in real time. Camera and lamp movement visualize shaking. Reduced-motion preference disables strong motion.

**Adaptive logic:** An explainable local state machine changes timer and cues from prior behavior. It is not labeled as machine learning because no validated training set exists.

**Voice:** Browser SpeechRecognition accepts Spanish A/B/C phrases when supported. It is optional, capability-detected, and never replaces touch or keyboard.

**Model challenge:** Browser speech support is inconsistent and may involve browser-specific processing. Do not promise local processing.

**Builder response:** The interface says audio is not stored by this product, not that every browser processes it locally. Unsupported browsers receive a clear fallback.

## 6. Mechanical test, bug, and fix

**Observed bug:** If the timer expired while voice recognition remained active, the recognition callback could finish after the feedback panel appeared. The callback could then answer the next scenario invisibly.

**Builder:** That violates the evidence boundary because the history could include an action the user never saw.

**Fix:** Stop voice recognition on timeout and reject every answer unless the simulation panel is active.

**Retest:** All 10 tests passed; production build passed.

## 7. Persona test and correction

**Synthetic persona:** Mariana, 39, lives with her mother and child in a Mexico City apartment. She uses WhatsApp daily and quits when a control appears decorative or judgmental.

**Persona:** "Movilidad limitada" sounds like the app is diagnosing me. I selected it, but nothing changed. Why did you ask?

**Builder:** That is the worst confusion. A visible control cannot be decorative in a rehearsal product.

**Fix:** Rename it "Hogar con persona mayor," state that it adds a support cue, and connect the selection to the first scenario.

**Persona retest:** The selected household now changes a concrete planning prompt without claiming to model every accessibility need.

## 8. Security floor

- No keys, secrets, database, accounts, or remote personal data.
- No free-text input reaches storage or a prompt.
- Voice input is constrained to A/B/C and discarded.
- Demo persona is invented and labeled.
- No real injury image or real person's likeness.

## 9. Commit plan executed

1. `docs: define packet and technologist thesis`
2. `feat: add adaptive rehearsal engine`
3. `feat: build mobile rehearsal interface`
4. `feat: add 3d scene and optional voice control`
5. `fix: connect persona profile and stop late voice input`

## 10. Deployment cycle

**Deploy 1:** Preview created after the first complete Dragon Stack build.  
**Test/fix:** Voice timeout race and decorative profile problem corrected.  
**Deploy 2:** Production build created from the corrected source.

## Session close

DECISIONS.md was updated after packet, build, and test. The next move is to publish the same five-commit source to GitHub, verify public Vercel access, record the demo, and submit only after all links and files open without an account.
