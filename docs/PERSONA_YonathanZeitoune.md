# Persona Test - 90 Segundos

## Synthetic user

**Mariana, 39, Mexico City.** She lives in an apartment with her mother, who walks slowly, and her 10-year-old child. Mariana uses WhatsApp daily, reads quickly only when the text is short, has attended announced workplace drills, and quits an app when a label makes her feel judged or when a control appears to do nothing.

This is an invented testing persona. It is not a real person and contains no real personal data.

## Walkthrough

### Screen 1 - household choice

Mariana understood "Departamento" but hesitated at the original card labeled "Movilidad limitada." She said it sounded like the app was diagnosing her rather than describing her household. She selected it and expected the rehearsal to change, but the original build only changed the card highlight.

### Screen 2 - 3D decision

She understood the timer and the three large options. The label "3D en tiempo real - no es una alerta" reduced the risk that she would confuse the scene with an official warning. She noticed the voice button but preferred touch because she did not know whether audio would be saved. The nearby status text answered that concern once listening began.

### Screen 3 - feedback

The phrase "decision segura en esta escena" felt fair because it did not call her a safe or unsafe person. She understood that the next timer changed because of her prior answer. She wanted the family preset to affect at least one concrete cue.

### Screen 4 - debrief

She could read the three outcomes but initially treated 3/3 as a readiness grade. The boundary text corrected this by saying the result describes only this session and is not a prediction.

## Worst confusion

The profile card looked functional but did not change the experience. That is a trust-breaking defect: a visible control cannot be decorative in a rehearsal product.

## Fix made

1. Renamed the card from **"Movilidad limitada"** to **"Hogar con persona mayor"** so it describes context rather than labeling the user.
2. Added the promise **"El ensayo añade una pista de apoyo."**
3. Connected the selected profile to the first scenario, where it adds a concrete planning cue about agreeing who supports the older family member without exposing themselves.
4. Fixed a mechanical race: if the timer expired while voice recognition was still active, a late voice result could answer the next scenario behind the feedback screen. Timer expiry now stops voice input, and hidden scenarios reject late answers.

## Retest result

Mariana now saw a visible change after choosing the household profile and understood why it mattered. The interface still avoids claiming that a simulator result proves real-world readiness.
