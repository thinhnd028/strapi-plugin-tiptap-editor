import { css } from "styled-components";

export const common = css`
  ${({ theme }) => css`
    .ProseMirror {
      display: flex;
      flex-direction: column;
      max-width: 100%;
      padding: 8px 12px;
      cursor: text;
      z-index: 0;
      background-color: var(--tiptap-color-bg);
      color: var(--tiptap-color-body);
      font-size: ${theme.fontSizes[2]};
      line-height: 1.7;
    }

    .ProseMirror > *:first-child {
      margin-top: 0;
    }

    .ProseMirror.ProseMirror-focused {
      outline: none;
      box-shadow: 0 0 0 1px var(--tiptap-color-ring);
    }

    /* Placeholder */
    .ProseMirror p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      color: var(--tiptap-color-muted);
      float: left;
      height: 0;
      pointer-events: none;
    }

    /* Headings */
    .ProseMirror h1,
    .ProseMirror h2,
    .ProseMirror h3,
    .ProseMirror h4,
    .ProseMirror h5,
    .ProseMirror h6 {
      color: var(--tiptap-color-heading);
      font-weight: 600;
      margin-top: 1.5em;
      margin-bottom: 0.5em;
    }

    .ProseMirror h1 {
      font-size: 40px;
    }
    .ProseMirror h2 {
      font-size: 36px;
    }
    .ProseMirror h3 {
      font-size: 32px;
    }
    .ProseMirror h4 {
      font-size: 28px;
    }
    .ProseMirror h5 {
      font-size: 24px;
    }
    .ProseMirror h6 {
      font-size: 20px;
    }

    /* Blockquote */
    .ProseMirror blockquote {
      border-left: 3px solid var(--tiptap-color-border);
      color: var(--tiptap-color-muted);
      padding-left: 1rem;
      margin: 1rem 0;
      font-style: italic;
    }

    /* Inline code & pre */
    .ProseMirror code {
      background-color: var(--tiptap-color-code-bg);
      border-radius: ${theme.borderRadius};
      padding: 0.15em 0.3em;
      font-size: 0.9em;
      font-family: monospace;
    }

    .ProseMirror pre {
      background-color: var(--tiptap-color-code-bg);
      padding: 1rem;
      border-radius: ${theme.borderRadius};
      overflow-x: auto;
      font-family: monospace;
    }

    /* Lists */
    .ProseMirror ul,
    .ProseMirror ol {
      margin: 1rem 0 1rem 1.5rem;
      padding-left: 1.25rem;
    }

    .ProseMirror ul {
      list-style-type: disc;
    }

    .ProseMirror ol {
      list-style-type: decimal;
    }

    .ProseMirror ul ul {
      list-style-type: circle;
      margin-left: 1.25rem;
    }

    .ProseMirror ol ol {
      list-style-type: lower-alpha;
      margin-left: 1.25rem;
    }

    .ProseMirror ul[data-type="taskList"] {
      list-style-type: none;
      margin-left: 0;
      padding: 0
    }

    .ProseMirror ul[data-type="taskList"] li {
      display: flex;
      align-items: flex-start; 
    }

    .ProseMirror ul[data-type="taskList"] li label {
      flex: 0 0 auto;
      margin-right: 0.5rem;
      user-select: none;
    }

    .ProseMirror ul[data-type="taskList"] li div {
      flex: 1 1 auto;
    }

    .ProseMirror ul[data-type="taskList"] input[type="checkbox"] {
      cursor: pointer;
    }

    .ProseMirror ul[data-type="taskList"] ul {
      margin: 0;
    }

    .ProseMirror ul[data-type="taskList"] li div p:first-child {
      margin: 0;
    }

    .ProseMirror li {
      margin: 0.25rem 0;
    }

    /* Horizontal rule */
    .ProseMirror hr {
      border: none;
      border-top: 1px solid var(--tiptap-color-border);
      margin: 2rem 0;
    }

    /* Links */
    .ProseMirror a {
      color: var(--tiptap-color-primary);
      text-decoration: underline;
    }

    /* Images & figures */
    .ProseMirror img {
      max-width: 100%;
      border-radius: ${theme.borderRadius};
      /* margin: 1rem 0; */
    }

    .ProseMirror figure {
      margin: 1.5rem 0;
    }

    .ProseMirror figcaption {
      font-size: 0.875rem;
      color: var(--tiptap-color-muted);
      margin-top: 0.25rem;
      text-align: center;
    }

    /* Tables */
    .ProseMirror table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5rem 0;
      font-size: 0.95rem;
    }

    .ProseMirror table th,
    .ProseMirror table td {
      border: 1px solid var(--tiptap-color-border);
      padding: 0.5rem 0.75rem;
      text-align: left;
    }

    .ProseMirror table th {
      background-color: var(--tiptap-color-muted-bg);
      font-weight: 600;
    }

    .ProseMirror table tr:nth-child(even) {
      background-color: var(--tiptap-color-bg-alt);
    }

    .ProseMirror table tr:hover {
      background-color: var(--tiptap-color-hover-bg);
    }
  `}
`;
