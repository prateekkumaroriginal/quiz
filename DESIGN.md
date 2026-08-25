# Design preferences

- Avoid cards.
- Avoid separators.
- Round every visibly distinct shape, including code blocks and buttons.
- Give each code block a functional border and a copy button overlaid in its top-right corner. Reveal the button on hover or keyboard focus without reserving layout space.
- Let list markers inherit their list item's text color.
- Use spacing to clearly associate each definition with its heading.
- If and only if Q&A exists, keep it at the end.
- Emphasize focus words with color.
- Use [COLORS.md](COLORS.md) for page colors, text hierarchy, and syntax highlighting.
- Keep heading text free of code-pill backgrounds.
- Dark mode only.
- Use Inter for all non-code text, including headings. Keep code in ui-monospace font.
- Use browser-default font sizes.
- Use the main content width `min(900px, calc(100% - 2rem))` for paragraphs, headings, and text callouts. Do not set a separate `max-width` on these elements.
- Use `line-height: 1.5` for code snippets.

## Don't use these css properties until necessary:

- Margin
- line-height
- flex shrink
- flex shorthand

## Spacing

- One owner per gap. Set each vertical gap on one element or one container so adjacent spacing does not add together.
- Reset the default margins on headings, paragraphs, code blocks, lists, and figures before applying these rules.
- Use `5rem` of vertical page padding. Reduce it to `3rem` on screens up to `720px` wide.
- The main content owns the gap after the page header with `padding-top: 3rem`.
- Later sections own the space between sections with `section + section { padding-top: 2.5rem; }`.
- Give the main heading `0.75rem` of space below it.
- Give section headings `0.75rem` of space below them. Section headings have no space above them because the section owns that gap.
- Put `1.75rem` between related examples or definitions. Apply it with a container `gap` or an adjacent-sibling rule such as `.example + .example`.
- Put `2rem` between quiz items. Apply it only to quiz items after the first.
- Use `1.25rem` of padding inside code blocks.

## Writing Style

- No eyebrow, kicker, or overline on headings.
- Main heading should be crystal clear.
- Do not use em dashes.
- Refrain from numbering headings unless the number suggest an order among them.

## Q&A

- Include a Q&A section only when it helps the reader check their understanding.
- Use an ordered list for the questions.
- Hide each answer inside `<details>` with `Show answer` as the `<summary>`.
- Provide answer with explanation.
