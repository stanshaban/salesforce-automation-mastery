import test from 'node:test';
import assert from 'node:assert/strict';
import { renderFullLesson, callout } from '../public/lesson-reader.mjs';

const sample = {
  id: 'J01',
  track: 'junior',
  title: 'CRM basics',
  minutes: 35,
  summary: 'One clear process.',
  prerequisites: ['No Salesforce knowledge required.'],
  learningObjectives: ['Explain CRM.'],
  sections: [
    {
      heading: 'A customer record',
      body: ['<script>bad()</script>'],
      callouts: [{ kind: 'idea', text: '<img src=x onerror=bad()> is text.' }],
      codeBlocks: [{ caption: 'Example', language: 'apex', code: 'List<Contact> people;' }],
      steps: [
        { title: 'Open a record', instruction: 'Use your training org.', expected: 'A record appears.' },
      ],
    },
  ],
  exercise: {
    title: 'Explain a process',
    brief: 'Use synthetic data.',
    steps: ['Write three steps.'],
    acceptance: ['Roles are explicit.'],
  },
  knowledgeCheck: [{ question: 'Who uses the CRM?', answer: 'An authorised business user.' }],
  recap: ['Roles matter.'],
  sources: [
    { title: 'Documentation', url: 'https://example.com/docs' },
    { title: 'Unsafe', url: 'javascript:alert(1)' },
  ],
  illustration: { alt: 'A customer record connected to a task.' },
};
test('reader escapes prose, code and callouts; keeps semantic learning elements', () => {
  const html = renderFullLesson(sample);
  assert.ok(!html.includes('<script>'));
  assert.ok(!html.includes('<img src=x'));
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(html.includes('List&lt;Contact&gt;'));
  assert.ok(html.includes('<blockquote class="lesson-callout idea">'));
  assert.ok(html.includes('<details class="lesson-row knowledge-check">'));
  assert.ok(html.includes('Expected result'));
  assert.ok(!html.includes('javascript:'));
});
test('reader links to full text and next lesson, while completion remains self-reported', () => {
  const html = renderFullLesson(sample, {
    completed: true,
    sequence: [
      { id: 'J01', title: 'CRM basics' },
      { id: 'J02', title: 'People and roles' },
    ],
  });
  assert.ok(html.includes('/lesson-images/J01.jpg'));
  assert.ok(html.includes('/lesson-exports/J01.md'));
  assert.ok(html.includes('#/lesson/J02'));
  assert.ok(html.includes('aria-pressed="true"'));
  assert.ok(html.includes('separate from instructor review'));
});
test('all callout types have an accessible label and unknown types fall back safely', () => {
  for (const [kind, label] of [
    ['idea', 'Key idea'],
    ['action', 'Try it'],
    ['warning', 'Watch out'],
    ['check', 'Check your understanding'],
  ])
    assert.ok(callout(kind, 'Text').includes(label));
  assert.ok(callout('" onclick="bad()', 'Text').includes('lesson-callout idea'));
  assert.ok(!callout('" onclick="bad()', 'Text').includes('onclick'));
});
