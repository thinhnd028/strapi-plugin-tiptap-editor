import { css } from "styled-components";

export const common = css`
  ${({ theme }) => css`
    .ProseMirror {
      /* List styles */
      /* Heading styles */
      /* Code and preformatted text styles */
      font-size: ${theme.fontSizes[2]};
      line-height: normal;
      color: var(--tiptap-color-body);
      background-color: var(--tiptap-color-bg);
      padding: 8px 12px;
      
      /* Ensure text wrapping */
      white-space: pre-wrap;
      overflow-wrap: break-word;
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

    .ProseMirror > *:first-child {
      margin-top: 0;
    }

    /* --- LISTS --- */
    .ProseMirror ul,
    .ProseMirror ol {
      padding: 0 1rem;
      margin: 1.25rem 1rem 1.25rem 0.4rem;
    }

    .ProseMirror ul li p,
    .ProseMirror ol li p {
      margin-top: 0.25em;
      margin-bottom: 0.25em;
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

    /* Task Lists */
    .ProseMirror ul[data-type='taskList'] {
      list-style: none;
      margin-left: 0;
      padding: 0;
    }

    .ProseMirror ul[data-type='taskList'] li {
      align-items: center;
      display: flex;
    }

    .ProseMirror ul[data-type='taskList'] li > label {
      flex: 0 0 auto;
      margin-right: 0.5rem;
      user-select: none;
    }

    .ProseMirror ul[data-type='taskList'] li > div {
      flex: 1 1 auto;
    }

    .ProseMirror ul[data-type='taskList'] input[type='checkbox'] {
      cursor: default;
      pointer-events: none;
    }

    /* --- HEADINGS --- */
    .ProseMirror h1,
    .ProseMirror h2,
    .ProseMirror h3,
    .ProseMirror h4,
    .ProseMirror h5,
    .ProseMirror h6 {
      line-height: 1.1;
      text-wrap: pretty;
      color: var(--tiptap-color-heading);
    }

    .ProseMirror h1 {
      font-size: calc(${theme.fontSizes[2]} * 2.25);
      font-weight: 800;
      margin-top: 2em;
      margin-bottom: 0.5em;
    }

    .ProseMirror h2 {
      font-size: calc(${theme.fontSizes[2]} * 1.5);
      font-weight: 700;
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      line-height: 1.35;
    }

    .ProseMirror h3 {
      font-size: calc(${theme.fontSizes[2]} * 1.25);
      font-weight: 600;
      margin-top: 1.5em;
      margin-bottom: 0.4em;
      line-height: 1.6;
    }

    .ProseMirror h4 {
      font-size: calc(${theme.fontSizes[2]} * 1.125);
      font-weight: 600;
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      line-height: 1.4;
    }

    .ProseMirror h5 {
      font-size: calc(${theme.fontSizes[2]} * 1);
      font-weight: 600;
      margin-top: 1.25em;
      margin-bottom: 0.5em;
      line-height: 1.5;
    }

    .ProseMirror h6 {
      font-size: calc(${theme.fontSizes[2]} * 0.875);
      font-weight: 600;
      margin-top: 1.25em;
      margin-bottom: 0.5em;
      line-height: 1.5;
    }

    /* --- PARAGRAPHS & ADJACENCY --- */
    .ProseMirror p {
      margin-top: 0.85em;
      margin-bottom: 0.85em;
      line-height: 1.6;
    }

    /* Remove top margin of paragraph/list if it follows a heading immediately */
    .ProseMirror h1 + p,
    .ProseMirror h1 + ul,
    .ProseMirror h1 + ol,
    .ProseMirror h2 + p,
    .ProseMirror h2 + ul,
    .ProseMirror h2 + ol,
    .ProseMirror h3 + p,
    .ProseMirror h3 + ul,
    .ProseMirror h3 + ol,
    .ProseMirror h4 + p,
    .ProseMirror h4 + ul,
    .ProseMirror h4 + ol {
      margin-top: 0 !important;
    }

    /* --- CODE BLOCK --- */
    .ProseMirror code {
      background-color: var(--tiptap-color-code-bg);
      border-radius: 0.4rem;
      color: var(--tiptap-color-heading); /* Using heading color (neutral900) for contrast */
      font-size: 0.85rem;
      padding: 0.25em 0.3em;
      font-family: monospace;
    }

    .ProseMirror pre {
      background: #0d1117; /* GitHub Dark bg */
      border-radius: 0.5rem;
      color: #fff;
      font-family: 'JetBrains Mono', monospace;
      margin: 1.5rem 0;
      padding: 0.75rem 1rem;
      overflow-x: auto;
    }

    .ProseMirror pre code {
      background: none;
      color: inherit;
      font-size: 0.8rem;
      padding: 0;
    }

    /* --- QUOTES --- */
    .ProseMirror blockquote {
      font-weight: 500;
      font-style: italic;
      color: var(--tiptap-color-body);
      border-left: 0.25rem solid var(--tiptap-color-border);
      margin: 1.6em 0;
      padding-left: 1em;
      quotes: "\\201C" "\\201D" "\\2018" "\\2019";
    }

    .ProseMirror hr {
      border: none;
      border-top: 1px solid var(--tiptap-color-border);
      margin: 2rem 0;
    }

    /* --- IMAGES & IFRAMES --- */
    .ProseMirror figure {
      float: none;
      margin-top: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .ProseMirror img {
      display: block;
      height: auto;
      max-width: 100%;
      float: none;
    }

    .ProseMirror iframe {
      width: 100%;
      aspect-ratio: 16 / 9;
    }

    /* Caption for Images - margin on figure, figcaption only spacing from image */
    .ProseMirror figcaption {
      text-align: left;
      font-style: italic;
      font-size: 0.9em;
      color: var(--tiptap-color-muted);
      margin-top: 0.5rem;
      margin-bottom: 0;
    }

    /* --- LINKS --- */
    .ProseMirror a {
      color: var(--tiptap-color-primary);
      text-decoration: underline;
      font-weight: 500;
    }

    .ProseMirror strong {
      font-weight: 700;
      color: var(--tiptap-color-heading);
    }

    /* --- TABLES --- */
    .ProseMirror table {
      border-collapse: collapse;
      margin: 0;
      overflow: hidden;
      table-layout: fixed;
      width: 100%;
    }

    .ProseMirror table td,
    .ProseMirror table th {
      border: 1px solid var(--tiptap-color-border);
      box-sizing: border-box;
      min-width: 1em;
      padding: 6px 8px;
      position: relative;
      vertical-align: top;
    }

    .ProseMirror table td > *,
    .ProseMirror table th > * {
      margin-bottom: 0;
    }

    .ProseMirror table th {
      background-color: var(--tiptap-color-code-bg); /* Using code-bg for slight contrast header */
      font-weight: bold;
      text-align: left;
    }

    .ProseMirror .tableWrapper {
      margin: 1.5rem 0;
      overflow-x: auto;
    }
  `}
`;
