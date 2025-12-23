import { WalletCardsIcon } from "lucide-react";
import { forwardRef, Fragment } from "react";
import styled from "styled-components";
import { useEditorContext } from "../partials/EditorProvider";
import ToolbarButton, { ToolbarButtonProps } from "../partials/ToolbarButton";

// Styled Components
const WalletCardsIconStyled = styled(WalletCardsIcon)`
  width: 16px;
  height: 16px;
`;

const TooltipContent = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const speakerCardTemplate = {
  type: "table",
  content: [
    {
      type: "tableRow",
      content: [
        {
          type: "tableCell",
          // Set column widths via colwidth (px) for a ~30/70 split.
          // ProseMirror tables use this to size columns.
          attrs: { colspan: 2, colwidth: [300, 700] },
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Diễn giả Hoàng Trung Nghĩa",
                  marks: [{ type: "bold" }],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "tableRow",
      content: [
        {
          type: "tableCell",
          attrs: { colwidth: [300] },
          content: [
            { type: "image-placeholder" },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Title short: ",
                },
                {
                  type: "text",
                  text: "Diễn giả",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: { color: "var(--tiptap-color-danger)" },
                    },
                  ],
                },
              ],
            },
            {
              type: "paragraph",
              content: [
                { type: "text", text: "Name: " },
                {
                  type: "text",
                  text: "Hoàng Trung Nghĩa",
                  marks: [{ type: "bold" }],
                },
              ],
            },
            {
              type: "paragraph",
              content: [
                { type: "text", text: "Title display: " },
                {
                  type: "text",
                  text: "...",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: { color: "var(--tiptap-color-muted-2)" },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "tableCell",
          attrs: { colwidth: [700] },
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Description: ...",
                  // Approximate a "card" by highlighting the whole line.
                  // Uses CSS variables so colors follow theme (no hard-coded hex).
                  marks: [
                    {
                      type: "highlight",
                      attrs: { color: "var(--tiptap-color-desc-bg)" },
                    },
                    {
                      type: "textStyle",
                      attrs: { color: "var(--tiptap-color-desc-fg)" },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const CustomCardToolbar = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useEditorContext();
    return (
      <ToolbarButton
        tooltip={
          <Fragment>
            <TooltipContent>
              <span>Custom Card</span>
            </TooltipContent>
          </Fragment>
        }
        aria-label="Insert custom card"
        onClick={(e) => {
          if (!editor) return;
          editor.chain().focus().insertContent(speakerCardTemplate as any).run();
          onClick?.(e);
        }}
        ref={ref}
        {...props}
      >
        {children || <WalletCardsIconStyled />}
      </ToolbarButton>
    );
  },
);

CustomCardToolbar.displayName = "CustomCardToolbar";

export { CustomCardToolbar };
