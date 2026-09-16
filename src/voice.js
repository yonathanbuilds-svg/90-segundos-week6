import { normalizeChoice } from './engine.js';

export function createVoiceControl({ button, status, onChoice }) {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) {
    button.disabled = true;
    status.textContent = 'Voz no disponible en este navegador · usa los botones';
    return { available: false, stop() {} };
  }

  const recognition = new Recognition();
  recognition.lang = 'es-MX';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  let listening = false;

  function finish(message) {
    listening = false;
    button.textContent = 'Usar voz';
    button.setAttribute('aria-pressed', 'false');
    status.textContent = message;
  }

  button.addEventListener('click', () => {
    if (listening) {
      recognition.stop();
      finish('Voz detenida · también puedes tocar una opción');
      return;
    }
    try {
      recognition.start();
      listening = true;
      button.textContent = 'Escuchando…';
      button.setAttribute('aria-pressed', 'true');
      status.textContent = 'Di A, B o C · no se guarda el audio';
    } catch {
      finish('No se pudo iniciar la voz · usa los botones');
    }
  });

  recognition.addEventListener('result', event => {
    const transcript = event.results?.[0]?.[0]?.transcript || '';
    const choice = normalizeChoice(transcript);
    if (choice) {
      finish(`Se escuchó opción ${choice}`);
      onChoice(choice);
    } else {
      finish('No reconocí A, B o C · intenta de nuevo o toca una opción');
    }
  });
  recognition.addEventListener('error', () => finish('La voz no respondió · usa los botones'));
  recognition.addEventListener('end', () => { if (listening) finish('La escucha terminó · usa voz o toca una opción'); });

  return { available: true, stop() { if (listening) recognition.stop(); } };
}
