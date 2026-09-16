import './style.css';
import { answer, createSession, expire, scenarios } from './engine.js';

const $ = selector => document.querySelector(selector);
const intro = $('#intro');
const simulation = $('#simulation');
const feedback = $('#feedback');
const results = $('#results');
const choices = $('#choices');
let session = createSession();
let timerId;
let startedAt = 0;
let remaining = session.seconds;

function setOnly(active) {
  [intro, simulation, feedback, results].forEach(panel => { panel.hidden = panel !== active; });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function formatTime(seconds) {
  return `00:${String(Math.max(0, seconds)).padStart(2, '0')}`;
}

function renderScenario() {
  const scenario = scenarios[session.index];
  if (!scenario) return renderResults();
  $('#scenario-eyebrow').textContent = scenario.eyebrow;
  $('#scenario-prompt').textContent = scenario.prompt;
  $('#step-count').textContent = `DECISIÓN ${session.index + 1} DE ${scenarios.length}`;
  $('#adaptive-label').textContent = session.level === 1 ? 'NIVEL 1 · CON PISTAS' : session.level === 2 ? 'NIVEL 2 · MENOS TIEMPO' : 'NIVEL 3 · SIN PISTAS';
  $('#scenario-cue').textContent = session.level >= 3 ? '' : scenario.cue;
  choices.replaceChildren(...scenario.choices.map(choice => {
    const button = document.createElement('button');
    button.className = 'choice-button';
    button.type = 'button';
    button.dataset.choice = choice.id;
    button.innerHTML = `<span class="choice-letter">${choice.id}</span><span>${choice.label}</span>`;
    button.addEventListener('click', () => submitChoice(choice.id));
    return button;
  }));
  remaining = session.seconds;
  $('#timer-value').textContent = formatTime(remaining);
  startedAt = Date.now();
  clearInterval(timerId);
  timerId = setInterval(() => {
    remaining -= 1;
    $('#timer-value').textContent = formatTime(remaining);
    if (remaining <= 0) {
      clearInterval(timerId);
      const outcome = expire(session);
      session = outcome.session;
      renderFeedback(outcome.result);
    }
  }, 1000);
  setOnly(simulation);
  $('#decision-panel').focus();
}

function submitChoice(choiceId) {
  if (!scenarios[session.index]) return;
  clearInterval(timerId);
  const elapsed = (Date.now() - startedAt) / 1000;
  const outcome = answer(session, choiceId, elapsed);
  if (!outcome.result) return;
  session = outcome.session;
  renderFeedback(outcome.result);
}

function renderFeedback(result) {
  const safe = result.safe;
  $('#feedback-status').textContent = safe ? 'DECISIÓN SEGURA EN ESTA ESCENA' : result.choiceId === 'TIME' ? 'TIEMPO AGOTADO' : 'RIESGO DETECTADO';
  $('#feedback-status').style.color = safe ? 'var(--cyan)' : 'var(--danger)';
  $('#feedback-title').textContent = safe ? 'La próxima ronda será más exigente.' : 'La próxima ronda te dará una pista.';
  $('#feedback-copy').textContent = result.feedback;
  $('#adaptation-copy').textContent = safe ? `Tendrás ${session.seconds} segundos y menos ayuda.` : 'Mantendrá más tiempo y mostrará una pista concreta.';
  $('#next-button').textContent = session.index >= scenarios.length ? 'Ver debrief' : 'Siguiente escenario';
  setOnly(feedback);
}

function renderResults() {
  clearInterval(timerId);
  $('#score-value').textContent = `${session.score}/${scenarios.length}`;
  $('#result-list').replaceChildren(...session.history.map((record, index) => {
    const item = document.createElement('div');
    item.className = 'result-item';
    item.innerHTML = `<strong>Decisión ${index + 1}</strong><span>${record.safe ? 'Segura' : record.choiceId === 'TIME' ? 'Sin respuesta' : 'A revisar'} · ${record.elapsedSeconds}s</span>`;
    return item;
  }));
  setOnly(results);
}

$('#start-button').addEventListener('click', renderScenario);
$('#next-button').addEventListener('click', () => session.index >= scenarios.length ? renderResults() : renderScenario());
$('#restart-button').addEventListener('click', () => { session = createSession(); setOnly(intro); });
$('#about-button').addEventListener('click', event => {
  const panel = $('#about-panel');
  panel.hidden = !panel.hidden;
  event.currentTarget.setAttribute('aria-expanded', String(!panel.hidden));
});
document.querySelectorAll('.profile-card').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.profile-card').forEach(card => card.classList.toggle('is-selected', card === button));
}));
window.addEventListener('keydown', event => {
  if (!simulation.hidden && ['a', 'b', 'c'].includes(event.key.toLowerCase())) submitChoice(event.key.toUpperCase());
});
