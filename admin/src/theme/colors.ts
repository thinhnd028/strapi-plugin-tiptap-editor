import { css } from 'styled-components';

export const colors = css`
  ${({ theme }) => css`
    :root {
      --tiptap-color-body: ${theme.colors.neutral800};
      --tiptap-color-heading: ${theme.colors.neutral900};
      --tiptap-color-muted: ${theme.colors.neutral500};
      --tiptap-color-muted-2: ${theme.colors.neutral600};
      --tiptap-color-border: ${theme.colors.neutral200};
      --tiptap-color-bg: ${theme.colors.neutral0};
      --tiptap-color-code-bg: ${theme.colors.neutral100};
      --tiptap-color-primary: ${theme.colors.primary600};
      --tiptap-color-ring: ${theme.colors.primary200};

      /* Speaker card helpers */
      --tiptap-color-danger: ${theme.colors.danger500};
      --tiptap-color-desc-bg: ${theme.colors.primary700 ?? theme.colors.primary600};
      --tiptap-color-desc-fg: ${theme.colors.neutral0};
    }
  `}
`;
