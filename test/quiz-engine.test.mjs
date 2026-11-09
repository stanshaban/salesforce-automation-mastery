import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildSession, summarizeAnswers } from '../public/quiz-engine.mjs';

const bank = JSON.parse(await readFile(new URL('../data/question-bank.json', import.meta.url), 'utf8'));

function fixture(id, extra = {}) {
  return {
    id, level: 'middle', topic: 'Security', title: `Question ${id}`,
    prompt: `Base condition ${id}`, difficulty: 2, kind: 'scenario',
    sourceUrl: 'https://developer.salesforce.com/',
    options: [
      { id: 'a', text: 'Base correct' }, { id: 'b', text: 'Base wrong B' },
      { id: 'c', text: 'Base wrong C' }, { id: 'd', text: 'Base wrong D' },
    ],
    correctOptionId: 'a', explanation: 'Base reason',
    whyOthers: [{ id: 'b', text: 'Why B fails' }],
    ...extra,
  };
}

function seeded(seed = 42) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function freezeDeep(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) freezeDeep(child);
  }
  return value;
}

test('bank has balanced levels, unique families and meaningful complete variants', () => {
  assert.equal(bank.length, 90);
  const allIds = new Set();
  const prompts = new Set();
  let variantFamilies = 0;
  for (const level of ['junior', 'middle', 'senior']) {
    assert.equal(bank.filter(question => question.level === level).length, 30);
  }
  for (const family of bank) {
    assert.ok(family.explanation && family.title && family.topic);
    const host = new URL(family.sourceUrl).hostname;
    assert.ok(host === 'git-scm.com' || host === 'salesforce.com' || host.endsWith('.salesforce.com'));
    if (family.variations?.length) variantFamilies += 1;
    for (const question of [family, ...(family.variations || [])]) {
      assert.ok(!allIds.has(question.id), `Repeated ID: ${question.id}`);
      allIds.add(question.id);
      assert.ok(!prompts.has(question.prompt), `Repeated prompt: ${question.id}`);
      prompts.add(question.prompt);
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options.map(option => option.id)).size, 4);
      assert.ok(question.options.some(option => option.id === question.correctOptionId));
      assert.equal(question.whyOthers.length, 3);
      assert.ok(question.whyOthers.every(item => item.id !== question.correctOptionId && item.text));
      assert.ok(question.explanation);
    }
    for (const variation of family.variations || []) {
      assert.notEqual(variation.prompt, family.prompt);
      const answer = question => question.options.find(option => option.id === question.correctOptionId).text;
      assert.notEqual(answer(variation), answer(family), `Variant keeps the exact same outcome: ${family.id}`);
    }
  }
  assert.ok(variantFamilies >= 30);
});

test('session filters level/topic and caps a small pool without duplicate families', () => {
  const input = [fixture('one'), fixture('one'), fixture('other-topic', { topic: 'Git' }), fixture('other-level', { level: 'junior' })];
  const session = buildSession(input, { level: 'middle', topic: 'Security', count: 10, rng: seeded() });
  assert.equal(session.length, 1);
  assert.equal(session[0].familyId, 'one');
  assert.deepEqual(buildSession(input, { level: 'senior' }), []);
  assert.deepEqual(buildSession(input, { count: 0 }), []);
});

test('semantic alternative carries its answer and feedback instead of the base answer', () => {
  const variant = {
    id: 'one-v1', prompt: 'Different condition, so access is denied',
    options: [{ id: 'x', text: 'Denied' }, { id: 'y', text: 'Allowed' }],
    correctOptionId: 'x', explanation: 'Different condition explains denial',
    whyOthers: [{ id: 'y', text: 'The grant was removed' }],
  };
  const [question] = buildSession([fixture('one', { variations: [variant] })], { rng: () => 0.99 });
  assert.equal(question.id, 'one-v1');
  assert.equal(question.familyId, 'one');
  assert.equal(question.correctOptionId, 'x');
  assert.equal(question.prompt, variant.prompt);
  assert.equal(question.explanation, variant.explanation);
  assert.deepEqual(question.whyOthers, variant.whyOthers);
  assert.equal(question.level, 'middle');
  assert.equal(question.variations, undefined);
  assert.deepEqual(summarizeAnswers([{ question, selectedOptionId: 'x' }]).score, 100);
});

test('option order changes while correct identity and source data remain intact', () => {
  const input = freezeDeep([fixture('one')]);
  const before = JSON.stringify(input);
  const [question] = buildSession(input, { rng: () => 0 });
  assert.notDeepEqual(question.options.map(option => option.id), ['a', 'b', 'c', 'd']);
  assert.deepEqual([...question.options.map(option => option.id)].sort(), ['a', 'b', 'c', 'd']);
  assert.equal(question.options.find(option => option.id === question.correctOptionId).text, 'Base correct');
  question.options[0].text = 'Edited session copy';
  assert.equal(JSON.stringify(input), before);
});

test('unseen families are visited before even a heavily missed seen family', () => {
  const history = freezeDeep({ old: { seen: 20, wrong: 20, lastSeen: 1, lastCorrect: false } });
  for (let seed = 0; seed < 30; seed += 1) {
    const [question] = buildSession([fixture('old'), fixture('new')], { count: 1, history, rng: seeded(seed) });
    assert.equal(question.familyId, 'new');
  }
});

test('weakOnly uses wrong families; no wrong history falls back to the available pool', () => {
  const input = [fixture('weak'), fixture('strong'), fixture('new')];
  const history = { weak: { seen: 2, wrong: 1 }, strong: { seen: 3, wrong: 0, correct: 3 } };
  const weak = buildSession(input, { weakOnly: true, history, count: 10, rng: seeded() });
  assert.deepEqual(weak.map(question => question.familyId), ['weak']);
  assert.equal(buildSession(input, { weakOnly: true, history: {}, count: 10, rng: seeded() }).length, 3);
});

test('repeated errors and older visits increase sampling frequency', () => {
  const input = [fixture('priority'), fixture('other')];
  const samples = (history, seed) => {
    const rng = seeded(seed);
    let priority = 0;
    for (let index = 0; index < 800; index += 1) {
      const [question] = buildSession(input, { count: 1, history, rng });
      if (question.familyId === 'priority') priority += 1;
    }
    return priority;
  };
  assert.ok(samples({ priority: { seen: 5, wrong: 4, lastSeen: 10 }, other: { seen: 5, wrong: 0, lastSeen: 10 } }, 44) > 600);
  assert.ok(samples({ priority: { seen: 5, wrong: 0, lastSeen: 10 }, other: { seen: 5, wrong: 0, lastSeen: 100 } }, 87) > 560);
});

test('visit rotation can change a semantic variant with the same deterministic random stream', () => {
  const family = fixture('one', { variations: [{
    id: 'one-v1', prompt: 'Changed condition',
    options: [{ id: 'a', text: 'Wrong now' }, { id: 'b', text: 'Right now' }],
    correctOptionId: 'b', explanation: 'Changed outcome',
  }] });
  assert.equal(buildSession([family], { rng: () => 0 })[0].id, 'one');
  assert.equal(buildSession([family], { history: { one: { seen: 1 } }, rng: () => 0 })[0].id, 'one-v1');
  assert.deepEqual(buildSession([family], { history: { one: { seen: 1 } }, rng: () => 0 })[0].whyOthers, []);
});

test('each real level can produce a full unique session with preserved answer IDs', () => {
  for (const level of ['junior', 'middle', 'senior']) {
    const questions = buildSession(bank, { level, count: 100, rng: seeded(15) });
    assert.equal(questions.length, 30);
    assert.equal(new Set(questions.map(question => question.familyId)).size, 30);
    for (const question of questions) {
      assert.equal(question.level, level);
      assert.ok(question.options.some(option => option.id === question.correctOptionId));
    }
  }
});

test('summary keeps skips in the score denominator and reports per-topic outcomes', () => {
  const security = fixture('security');
  const git = fixture('git', { topic: 'Git' });
  assert.deepEqual(summarizeAnswers([
    { question: security, selectedOptionId: 'a' },
    { question: security, selectedOptionId: 'b' },
    { question: git, selectedOptionId: 'a', skipped: true },
    { question: git },
  ]), {
    total: 4, correct: 1, skipped: 2, score: 25,
    topics: [{ topic: 'Security', total: 2, correct: 1, skipped: 0 }, { topic: 'Git', total: 2, correct: 0, skipped: 2 }],
  });
  assert.deepEqual(summarizeAnswers([]), { total: 0, correct: 0, skipped: 0, score: 0, topics: [] });
});

test('malformed options and invalid randomness fail explicitly', () => {
  assert.throws(() => buildSession([fixture('bad', { correctOptionId: 'missing' })]), /option IDs/);
  assert.throws(() => buildSession([fixture('one')], { rng: () => 1 }), /rng/);
  assert.throws(() => buildSession([fixture('one')], { count: -1 }), /count/);
});
