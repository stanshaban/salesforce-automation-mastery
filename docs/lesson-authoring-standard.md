# SAM lesson authoring standard

All learner-facing content is written in English. Titles describe the topic directly. A lesson explains a mechanism before asking the learner to configure it.

## Teaching sequence

1. Name the people, the business task and the existing data.
2. Explain new terms in ordinary language.
3. Work through one concrete example, including the result and why it occurs.
4. Give guided steps with an observable expected result.
5. Discuss a relevant failure, limitation or alternative.
6. Set an independent exercise with clear acceptance criteria.
7. Ask review questions and provide explanations for the answers.

Junior starts with CRM and company workflows. Apex, triggers and execution order come after the necessary concepts. Middle connects features into a complete function. Senior diagnoses constraints, compares alternatives and checks the effect of a decision.

## Visual callouts

Use real blockquotes in the portal and Markdown exports. These are teaching notes, not quotations attributed to another author.

> 💡 **Idea** — the principle that explains the example.

> ⚡ **Action** — a specific next step for the learner.

> 🔎 **Check** — an observable result, including where to look.

> ⚠️ **Watch out** — a concrete condition that changes the result.

Use these selectively. Do not decorate every paragraph. Never rely on colour or an emoji alone: retain the label and text.

## Technical claims

- State the relevant API version or execution context when it changes behaviour. Examples target API 68.0 unless stated otherwise.
- Link to primary Salesforce documentation for platform behaviour.
- Identify illustrative telemetry, mock integrations and code fragments.
- Describe every extra field or permission before a sample uses it.
- Distinguish a local check from a Salesforce deployment or a live Agentforce test.
- State org, edition or licensing requirements without implying every Playground includes every product.

## Lesson illustrations

Each lesson has its own generated cover, tied to one teaching idea. Use a restrained editorial illustration, simple forms, generous space and the SAM navy/ivory/blue/teal palette. People are drawn, not photorealistic. Keep all headings outside the image. No logos, tiny interface text or decorative clutter.

Illustrations establish context; code, explanations and interactive diagrams carry exact technical meaning.

## Skool export

Export each lesson as readable Markdown with its image reference, descriptive headings, code fences and blockquote callouts. Skool's editor may require using its own quote control when pasting; a Markdown export is not a promise of one-click rich-text import. Preview a lesson in Skool before publishing the whole course.
