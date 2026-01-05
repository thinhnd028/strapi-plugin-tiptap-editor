import { useEditorContext } from "./EditorProvider";
import styled from "styled-components";
import { Typography } from "@strapi/design-system";

const FooterContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 8px 12px;
  border-top: 1px solid ${(props) => props.theme.colors.neutral200};
  background-color: ${(props) => props.theme.colors.neutral0};
  color: ${(props) => props.theme.colors.neutral600};
`;

const CountItem = styled.div`
  display: flex;
  gap: 4px;
  font-size: 12px;
`;

export const EditorFooter = () => {
    const { editor } = useEditorContext();

    if (!editor) {
        return null;
    }

    // Safety check for characterCount storage
    if (!editor.storage.characterCount) {
        console.warn("Tiptap Editor: characterCount extension not found in storage.", editor.storage);
        return null;
    }

    const characterCount = editor.storage.characterCount.characters?.() || 0;
    const wordCount = editor.storage.characterCount.words?.() || 0;

    return (
        <FooterContainer>
            <CountItem>
                <Typography variant="pi" textColor="neutral600">
                    {characterCount} characters
                </Typography>
                <Typography variant="pi" textColor="neutral600">
                    •
                </Typography>
                <Typography variant="pi" textColor="neutral600">
                    {wordCount} words
                </Typography>
            </CountItem>
        </FooterContainer>
    );
};
