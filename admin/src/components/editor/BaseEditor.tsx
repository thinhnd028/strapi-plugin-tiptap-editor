import { type Content, Editor, EditorContent } from "@tiptap/react";
import { LinkBubbleMenu } from "./partials/LinkBubbleMenu";
import { ImageBubbleMenu } from "./partials/ImageBubbleMenu";
import { EditorFooter } from "./partials/EditorFooter";
import { useEditor, type UseEditorOptions } from "./useEditor";
import { forwardRef, useImperativeHandle } from "react";
import { EditorProvider } from "./partials/EditorProvider";
import styled from "styled-components";
import { TooltipProvider } from "../ui/tooltip";
import { CustomComponentEditPopover } from "./extensions/custom-component/CustomComponentEditPopover";

/**
 * Props for the BaseEditor component.
 * Extends useEditor options but excludes some internal handlers.
 */
export interface BaseEditorProps
  extends Omit<UseEditorOptions, "onUpdate" | "editable"> {
  /** Callback fired when editor content changes */
  onChange?: (value: Content) => void;
  /** Toolbar component to render above the editor */
  toolbar?: React.ReactNode;
  /** Additional class names for the container */
  className?: string;
  /** Whether the editor is disabled (read-only) */
  disabled?: boolean;
}

const EditorContainer = styled.div<{ $hasToolbar?: boolean }>`
  border: 1px solid ${props => props.theme.colors.neutral300};
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  
  &:focus-within {
    border-color: ${props => props.theme.colors.primary600};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary600};
  }
`;

const ToolbarContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  padding: 4px;
  justify-content: space-between;
  border-bottom: 1px solid ${props => props.theme.colors.neutral200};
  position: sticky;
  top: 0;
  background-color: ${props => props.theme.colors.neutral0};
  z-index: 20;
`;

const ToolbarContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  justify-content: flex-start;
  width: 100%;
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  max-height: 100%;
  width: 100%;
  flex-direction: column;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  overflow-y: auto;
  background-color: ${props => props.theme.colors.neutral0};
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.neutral100};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.neutral300};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.neutral400};
  }
`;

const EditorContentStyled = styled(EditorContent)`
  outline: none;
  border: none;
`;

/**
 * Base Editor component that sets up the Tiptap editor instance,
 * providers, and layout.
 */
export const BaseEditor = forwardRef<Editor | null, BaseEditorProps>(
  (
    { toolbar, onChange, value, className, disabled = false, ...options },
    ref,
  ) => {
    const editor = useEditor({
      ...options,
      editorProps: {
        ...options?.editorProps,

      },
      onUpdate: onChange,
      value,
      editable: !disabled,
      output: options.output ?? "html",
    });

    useImperativeHandle(ref, () => editor as Editor, [editor]);

    if (!editor) {
      return null;
    }

    return (
      <TooltipProvider>
        <EditorProvider editor={editor}>
          <EditorContainer
            $hasToolbar={!!toolbar}
            className={className}
          >
            {typeof toolbar !== "undefined" ? (
              <ToolbarContainer>
                <ToolbarContent>
                  {toolbar}
                </ToolbarContent>
              </ToolbarContainer>
            ) : null}
            <ContentContainer
              onClick={() => {
                editor?.chain().focus().run();
              }}
            >
              <EditorContentStyled
                editor={editor}
              />
              <LinkBubbleMenu />
              <ImageBubbleMenu />
              <CustomComponentEditPopover />
            </ContentContainer>
            <EditorFooter />
          </EditorContainer>
        </EditorProvider>
      </TooltipProvider>
    );
  },
);

BaseEditor.displayName = "BaseEditor";