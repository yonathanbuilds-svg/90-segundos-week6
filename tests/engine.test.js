import test from 'node:test';
import assert from 'node:assert/strict';
import { answer, createSession, expire, normalizeChoice, scenarios, timeForLevel } from '../src/engine.js';

test('session starts at scenario one with no score', () => {
  assert.deepEqual(createSession(), { index: 0, score: 0, streak: 0, level: 1, history: [], seconds: 45 });
});

test('there are exactly three rehearsals', () => assert.equal(scenarios.length, 3));

test('safe decision increases score and level', () => {
  const outcome = answer(createSession(), 'B', 7);
  assert.equal(outcome.session.score, 1);
  assert.equal(outcome.session.level, 2);
  assert.equal(outcome.result.safe, true);
});

test('unsafe decision removes streak and never drops below level one', () => {
  const outcome = answer({ ...createSession(), streak: 2 }, 'A', 3);
  assert.equal(outcome.session.streak, 0);
  assert.equal(outcome.session.level, 1);
});

test('difficulty time has a safe lower limit', () => {
  assert.equal(timeForLevel(1), 45);
  assert.equal(timeForLevel(3), 29);
  assert.equal(timeForLevel(99), 20);
});

test('invalid answers do not mutate the session', () => {
  const session = createSession();
  const outcome = answer(session, 'Z');
  assert.equal(outcome.session, session);
  assert.equal(outcome.result, null);
});

test('Spanish voice phrases normalize to A B or C', () => {
  assert.equal(normalizeChoice('opción A'), 'A');
  assert.equal(normalizeChoice('me protejo bajo la mesa'), 'B');
  assert.equal(normalizeChoice('uso el elevador'), 'C');
});

test('unknown voice input is rejected', () => assert.equal(normalizeChoice('no entendí'), null));

test('timer expiry records hesitation and advances', () => {
  const outcome = expire(createSession());
  assert.equal(outcome.session.index, 1);
  assert.equal(outcome.result.choiceId, 'TIME');
  assert.equal(outcome.result.safe, false);
});

test('third answer finishes the session', () => {
  const session = { ...createSession(), index: 2 };
  assert.equal(answer(session, 'B').done, true);
});
