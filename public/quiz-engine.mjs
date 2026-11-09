/**
 * Pure quiz selection, shared by the browser and Node tests.
 * A question family appears at most once per session. History is keyed by familyId.
 * Unseen families come first; among seen families, errors and older visits increase weight.
 * weakOnly uses previous errors when available, otherwise falls back to the filtered pool.
 * Small pools return fewer questions instead of repeating a family.
 */

function randomUnit(rng) {
  const value = rng();
  if (!Number.isFinite(value) || value < 0 || value >= 1) {
    throw new RangeError('rng must return a number in [0, 1).');
  }
  return value;
}

function numberOrZero(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
}

function timestamp(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function previous(history, id) {
  return history && Object.hasOwn(history, id) ? history[id] || {} : {};
}

function shuffled(items, rng) {
  const copy = items.map(item => ({ ...item }));
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const other = Math.floor(randomUnit(rng) * (index + 1));
    [copy[index], copy[other]] = [copy[other], copy[index]];
  }
  return copy;
}

function chooseWithoutReplacement(items, count, weight, rng) {
  const pool = items.map(item => ({ item, weight: weight(item) }));
  const selected = [];
  while (selected.length < count && pool.length) {
    const total = pool.reduce((sum, entry) => sum + entry.weight, 0);
    let remaining = randomUnit(rng) * total;
    let index = 0;
    for (; index < pool.length - 1; index += 1) {
      remaining -= pool[index].weight;
      if (remaining < 0) break;
    }
    selected.push(pool.splice(index, 1)[0].item);
  }
  return selected;
}

function materialize(family, history, rng) {
  const { variations = [], ...base } = family;
  const alternatives = [base, ...variations];
  // Seen-count rotation changes a deterministic practice run too; randomness remains injectable.
  const visits = Math.floor(numberOrZero(previous(history, family.id).seen));
  const choice = (Math.floor(randomUnit(rng) * alternatives.length) + visits) % alternatives.length;
  const alternative = alternatives[choice];
  const result = { ...base, ...alternative, familyId: family.id };
  if (!Array.isArray(result.options) || result.options.length < 2) {
    throw new TypeError(`Question ${result.id} needs at least two options.`);
  }
  const ids = result.options.map(option => option.id);
  if (new Set(ids).size !== ids.length || !ids.includes(result.correctOptionId)) {
    throw new TypeError(`Question ${result.id} has invalid option IDs.`);
  }
  result.options = shuffled(result.options, rng);
  // An alternative may have different answer IDs, so never inherit its base's distractor feedback.
  result.whyOthers = (alternative.whyOthers || []).map(item => ({ ...item }));
  return result;
}

export function buildSession(questions, {
  level,
  topic = 'all',
  count = 10,
  history = {},
  weakOnly = false,
  rng = Math.random,
} = {}) {
  if (!Array.isArray(questions)) throw new TypeError('questions must be an array.');
  if (!Number.isInteger(count) || count < 0) throw new RangeError('count must be a non-negative integer.');
  if (typeof rng !== 'function') throw new TypeError('rng must be a function.');
  const families = new Map();
  for (const question of questions) {
    if (!question || typeof question.id !== 'string') throw new TypeError('Every question needs an ID.');
    if (level && level !== 'all' && question.level !== level) continue;
    if (topic && topic !== 'all' && question.topic !== topic) continue;
    if (!families.has(question.id)) families.set(question.id, question);
  }
  let pool = [...families.values()];
  if (weakOnly) {
    const weak = pool.filter(question => numberOrZero(previous(history, question.id).wrong) > 0);
    if (weak.length) pool = weak;
  }
  const target = Math.min(count, pool.length);
  if (!target) return [];
  const unseen = pool.filter(question => numberOrZero(previous(history, question.id).seen) === 0);
  const selected = chooseWithoutReplacement(unseen, target, () => 1, rng);
  if (selected.length < target) {
    const seen = pool.filter(question => numberOrZero(previous(history, question.id).seen) > 0);
    const times = seen.map(question => timestamp(previous(history, question.id).lastSeen));
    const oldest = Math.min(...times);
    const newest = Math.max(...times);
    const span = newest - oldest;
    const weight = question => {
      const record = previous(history, question.id);
      const recency = span > 0 ? 1 + 3 * (newest - timestamp(record.lastSeen)) / span : 1;
      const errors = 1 + Math.min(4, numberOrZero(record.wrong));
      const lastError = record.lastCorrect === false ? 2 : 1;
      return recency * errors * lastError;
    };
    selected.push(...chooseWithoutReplacement(seen, target - selected.length, weight, rng));
  }
  return selected.map(question => materialize(question, history, rng));
}

/** score is an integer percentage from 0 through 100; skips stay in the denominator. */
export function summarizeAnswers(answers) {
  if (!Array.isArray(answers)) throw new TypeError('answers must be an array.');
  const summary = { total: answers.length, correct: 0, skipped: 0, score: 0, topics: [] };
  const topics = new Map();
  for (const answer of answers) {
    if (!answer?.question) throw new TypeError('Each answer needs its question.');
    const topic = answer.question.topic || 'General';
    if (!topics.has(topic)) topics.set(topic, { topic, total: 0, correct: 0, skipped: 0 });
    const result = topics.get(topic);
    result.total += 1;
    const skipped = answer.skipped === true || answer.selectedOptionId == null || answer.selectedOptionId === '';
    if (skipped) {
      summary.skipped += 1;
      result.skipped += 1;
    } else if (answer.selectedOptionId === answer.question.correctOptionId) {
      summary.correct += 1;
      result.correct += 1;
    }
  }
  summary.score = summary.total ? Math.round(100 * summary.correct / summary.total) : 0;
  summary.topics = [...topics.values()];
  return summary;
}
