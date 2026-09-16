export const scenarios = [
  {
    id: 'shake',
    eyebrow: 'ESCENARIO 1 · EN CASA',
    prompt: 'Empieza un movimiento fuerte. ¿Qué haces primero?',
    choices: [
      { id: 'A', label: 'Corro hacia la salida', safe: false, feedback: 'Correr durante el movimiento aumenta el riesgo de caída y de objetos en la ruta.' },
      { id: 'B', label: 'Me protejo bajo una mesa firme', safe: true, feedback: 'Proteger cabeza y cuello bajo una superficie firme reduce exposición inmediata.' },
      { id: 'C', label: 'Me acerco a la ventana', safe: false, feedback: 'Ventanas y objetos que caen son una zona de riesgo.' }
    ],
    cue: 'Mira qué objetos podrían caer y dónde puedes proteger cabeza y cuello.'
  },
  {
    id: 'after',
    eyebrow: 'ESCENARIO 2 · TERMINÓ EL MOVIMIENTO',
    prompt: 'Percibes olor a gas y el pasillo está libre. ¿Qué haces?',
    choices: [
      { id: 'A', label: 'Enciendo la luz para revisar', safe: false, feedback: 'Una chispa puede encender gas acumulado. No uses interruptores ni flamas.' },
      { id: 'B', label: 'Evacúo sin accionar interruptores', safe: true, feedback: 'Salir con calma y evitar fuentes de ignición es la decisión más segura en este escenario.' },
      { id: 'C', label: 'Uso el elevador para bajar rápido', safe: false, feedback: 'El elevador puede fallar o detenerse después del movimiento.' }
    ],
    cue: 'Piensa qué acciones pueden producir una chispa y qué ruta no depende de energía.'
  },
  {
    id: 'meet',
    eyebrow: 'ESCENARIO 3 · FAMILIA SEPARADA',
    prompt: 'La red está saturada. ¿Qué acción ayuda más a reunirse?',
    choices: [
      { id: 'A', label: 'Cada quien regresa a casa', safe: false, feedback: 'Moverse sin coordinación puede exponer a la familia y duplicar búsquedas.' },
      { id: 'B', label: 'Seguimos el punto de reunión acordado', safe: true, feedback: 'Un punto acordado reduce decisiones improvisadas cuando la comunicación falla.' },
      { id: 'C', label: 'Publicamos nuestra ubicación', safe: false, feedback: 'Depender de red y compartir ubicación públicamente no sustituye un plan previo.' }
    ],
    cue: 'La mejor decisión debe seguir funcionando aunque no haya señal.'
  }
];

export function createSession() {
  return { index: 0, score: 0, streak: 0, level: 1, history: [], seconds: 45 };
}

export function normalizeChoice(value = '') {
  const clean = String(value).trim().toUpperCase();
  const letter = clean.match(/(?:^|\s)([ABC])(?:$|\s)/)?.[1];
  if (letter) return letter;
  if (/UNO|PRIMERA|CORRO|SALIDA/.test(clean)) return 'A';
  if (/DOS|SEGUNDA|PROTEJO|MESA|EVACUO|PUNTO DE REUNION|PUNTO DE REUNIÓN/.test(clean)) return 'B';
  if (/TRES|TERCERA|VENTANA|ELEVADOR|UBICACION|UBICACIÓN/.test(clean)) return 'C';
  return null;
}

export function timeForLevel(level) {
  return Math.max(20, 45 - (Math.max(1, level) - 1) * 8);
}

export function answer(session, choiceId, elapsedSeconds = 0) {
  const scenario = scenarios[session.index];
  if (!scenario) return { session, result: null, done: true };
  const choice = scenario.choices.find(item => item.id === choiceId);
  if (!choice) return { session, result: null, done: false };

  const nextStreak = choice.safe ? session.streak + 1 : 0;
  const nextLevel = choice.safe ? Math.min(3, session.level + 1) : Math.max(1, session.level - 1);
  const record = {
    scenarioId: scenario.id,
    choiceId,
    safe: choice.safe,
    elapsedSeconds: Math.max(0, Math.round(elapsedSeconds)),
    feedback: choice.feedback
  };
  const nextIndex = session.index + 1;
  const next = {
    ...session,
    index: nextIndex,
    score: session.score + (choice.safe ? 1 : 0),
    streak: nextStreak,
    level: nextLevel,
    history: [...session.history, record],
    seconds: timeForLevel(nextLevel)
  };
  return { session: next, result: record, done: nextIndex >= scenarios.length };
}

export function expire(session) {
  const scenario = scenarios[session.index];
  if (!scenario) return { session, result: null, done: true };
  const record = {
    scenarioId: scenario.id,
    choiceId: 'TIME',
    safe: false,
    elapsedSeconds: session.seconds,
    feedback: 'El tiempo terminó. En una emergencia, un plan previo reduce la carga de decidir desde cero.'
  };
  const nextIndex = session.index + 1;
  const next = {
    ...session,
    index: nextIndex,
    streak: 0,
    level: Math.max(1, session.level - 1),
    history: [...session.history, record],
    seconds: 45
  };
  return { session: next, result: record, done: nextIndex >= scenarios.length };
}
