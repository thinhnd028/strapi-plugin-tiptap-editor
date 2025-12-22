import React from "react";
import { useIntl } from "react-intl";
import { ContentEditor } from "./editor/ContentEditor";
import type { Content } from "@tiptap/react";
import { TiptapJSONInputProps } from "../types";
import { Field, Flex } from '@strapi/design-system';
import styled from "styled-components";
import { GlobalStyling } from "./GlobalStyling";
import { CustomComponentProvider } from "./editor/extensions/custom-component/Store";

const Container = styled(Flex)`
  flex-direction: column;
  gap: 4px;
  align-items: stretch;
`;

const RequiredIndicator = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.neutral600};
  margin-top: 4px;
`;

const EditorContainer = styled.div`
  min-height: 200px;
`;

/**
 * Tiptap Editor custom field input (Content/Full Version).
 * Renders the full-featured editor with all toolbars and extensions.
 */
const ContentEditorInput = React.memo(React.forwardRef<{ focus: () => void }, TiptapJSONInputProps>(
    (
        {
            name,
            hint,
            error,
            placeholder,
            label,
            attribute,
            labelAction = null,
            disabled = false,
            required = false,
            onChange,
            value,
        }: TiptapJSONInputProps,
        forwardedRef
    ) => {
        const { formatMessage } = useIntl();

        const handleEditorChange = React.useCallback((content: Content) => {
            if (!onChange) return;

            // Construct a ChangeEvent-like object and cast it to satisfy the expected type
            const evt = {
                target: {
                    name,
                    value: content,
                    type: "json",
                },
            } as unknown as React.ChangeEvent<any>;

            onChange(evt);
        }, [name, onChange]);

        const isFieldLocalized = attribute?.pluginOptions?.i18n?.localized ?? false;

        return (
            <Field.Root
                name={name}
                id={name}
                error={error}
                hint={hint}
                required={required}
            >
                <Container>
                    <Field.Label action={labelAction}>
                        {label}
                    </Field.Label>


                    <GlobalStyling />

                    <CustomComponentProvider>
                        <EditorContainer>
                            <ContentEditor
                                value={value}
                                onChange={handleEditorChange}
                                disabled={disabled}
                            />
                        </EditorContainer>
                    </CustomComponentProvider>

                    <Field.Hint />
                    <Field.Error />

                    {required && (
                        <RequiredIndicator>* required</RequiredIndicator>
                    )}
                </Container>
            </Field.Root>
        );
    },
));

ContentEditorInput.displayName = "ContentEditorInput";

export default ContentEditorInput;
