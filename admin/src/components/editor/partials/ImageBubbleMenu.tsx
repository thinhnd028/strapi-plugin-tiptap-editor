import { BubbleMenu } from "@tiptap/react/menus";
import { NodeSelection } from "@tiptap/pm/state";
import { Captions } from "lucide-react";
import { useCallback, useState } from "react";
import styled from "styled-components";
import { MediaFile, MediaLibraryModal } from "../../MediaLibraryModal";
import { Button } from "../../ui/button";
import { useEditorContext } from "../partials/EditorProvider";

// Custom Icons provided by user
const IconAlignLeft = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 2C4 1.44772 3.55228 1 3 1C2.44772 1 2 1.44772 2 2V22C2 22.5523 2.44772 23 3 23C3.55228 23 4 22.5523 4 22V2Z" fill="currentColor"></path>
        <path fillRule="evenodd" clipRule="evenodd" d="M10 4C8.34315 4 7 5.34315 7 7V17C7 18.6569 8.34315 20 10 20H19C20.6569 20 22 18.6569 22 17V7C22 5.34315 20.6569 4 19 4H10ZM9 7C9 6.44772 9.44772 6 10 6H19C19.5523 6 20 6.44772 20 7V17C20 17.5523 19.5523 18 19 18H10C9.44772 18 9 17.5523 9 17V7Z" fill="currentColor"></path>
    </svg>
);

const IconAlignCenter = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 1C12.5523 1 13 1.44772 13 2V22C13 22.5523 12.5523 23 12 23C11.4477 23 11 22.5523 11 22V2C11 1.44772 11.4477 1 12 1Z" fill="currentColor"></path>
        <path d="M2 7C2 5.34315 3.34315 4 5 4H7C7.55228 4 8 4.44772 8 5C8 5.55228 7.55228 6 7 6H5C4.44772 6 4 6.44772 4 7V17C4 17.5523 4.44772 18 5 18H7C7.55228 18 8 18.4477 8 19C8 19.5523 7.55228 20 7 20H5C3.34315 20 2 18.6569 2 17V7Z" fill="currentColor"></path>
        <path d="M19 4C20.6569 4 22 5.34315 22 7V17C22 18.6569 20.6569 20 19 20H17C16.4477 20 16 19.5523 16 19C16 18.4477 16.4477 18 17 18H19C19.5523 18 20 17.5523 20 17V7C20 6.44772 19.5523 6 19 6H17C16.4477 6 16 5.55228 16 5C16 4.44772 16.4477 4 17 4H19Z" fill="currentColor"></path>
    </svg>
);

const IconAlignRight = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M21 1C21.5523 1 22 1.44772 22 2V22C22 22.5523 21.5523 23 21 23C20.4477 23 20 22.5523 20 22V2C20 1.44772 20.4477 1 21 1Z" fill="currentColor"></path>
        <path fillRule="evenodd" clipRule="evenodd" d="M2 7C2 5.34315 3.34315 4 5 4H14C15.6569 4 17 5.34315 17 7V17C17 18.6569 15.6569 20 14 20H5C3.34315 20 2 18.6569 2 17V7ZM5 6C4.44772 6 4 6.44772 4 7V17C4 17.5523 4.44772 18 5 18H14C14.5523 18 15 17.5523 15 17V7C15 6.44772 14.5523 6 14 6H5Z" fill="currentColor"></path>
    </svg>
);


// Styled Components
const MenuContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: ${props => props.theme.colors.neutral0};
  border: 1px solid ${props => props.theme.colors.neutral200};
  padding: 4px;
  border-radius: 4px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  z-index: 50;
  white-space: nowrap;
`;

const ControlButton = styled(Button)`
  height: 28px;
  padding: 0 8px;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background-color: ${props => props.theme.colors.primary100} !important;
  }

  &[data-active="true"] {
    background-color: ${props => props.theme.colors.primary100};
    color: ${props => props.theme.colors.primary600};
    border-color: ${props => props.theme.colors.primary500};
  }
  
  svg {
    width: 20px; /* Adjusted slightly for the new icons which detailed */
    height: 20px;
  }
`;

export const ImageBubbleMenu = () => {
    const { editor } = useEditorContext();
    const [mediaLibOpen, setMediaLibOpen] = useState(false);

    // Only show if image is selected
    const shouldShow = useCallback(({ editor }: any) => {
        return editor.state.selection instanceof NodeSelection && editor.isActive('image');
    }, []);

    if (!editor) return null;

    const attrs = editor.getAttributes('image');

    // Update attributes helper
    const updateAttributes = (newAttrs: any) => {
        editor.chain().focus().updateAttributes('image', newAttrs).run();
    };

    const handleMediaSelect = (file: MediaFile) => {
        let srcset = undefined;
        if (file.formats) {
            const sets = Object.keys(file.formats)
                .sort((a, b) => file.formats[a].width - file.formats[b].width)
                .map(k => {
                    const f = file.formats[k];
                    const url = f.url.startsWith('http') ? f.url : `${window.strapi?.backendURL}${f.url}`;
                    return `${url} ${f.width}w`;
                });
            srcset = sets.join(', ');
        }
        const fullUrl = file.url.startsWith('http') ? file.url : `${window.strapi?.backendURL}${file.url}`;

        updateAttributes({
            src: fullUrl,
            alt: file.alt,
            title: file.name,
            pixelWidth: file.width,
            media_id: file.id,
            originalWidth: file.width,
            originalHeight: file.height,
            srcset,
        });
    };

    return (
        <>
            <BubbleMenu
                editor={editor}
                shouldShow={shouldShow}
                options={{
                    placement: "bottom",
                    offset: 10,
                    strategy: "absolute",
                }}
            >
                <MenuContainer
                    onMouseDown={(e) => {
                        e.preventDefault();
                    }}
                >
                    <ControlButton
                        variant="ghost"
                        size="sm"
                        onClick={() => updateAttributes({ align: 'left' })}
                        data-active={attrs.align === 'left'}
                        title="Align Left"
                    >
                        <IconAlignLeft />
                    </ControlButton>
                    <ControlButton
                        variant="ghost"
                        size="sm"
                        onClick={() => updateAttributes({ align: 'center' })}
                        data-active={attrs.align === 'center'}
                        title="Align Center"
                    >
                        <IconAlignCenter />
                    </ControlButton>
                    <ControlButton
                        variant="ghost"
                        size="sm"
                        onClick={() => updateAttributes({ align: 'right' })}
                        data-active={attrs.align === 'right'}
                        title="Align Right"
                    >
                        <IconAlignRight />
                    </ControlButton>

                    <ControlButton
                        variant="ghost"
                        size="sm"
                        data-active={attrs.caption !== false && attrs.caption !== null}
                        onClick={() => {
                            if (attrs.caption !== false && attrs.caption !== null) {
                                updateAttributes({ caption: false });
                            } else {
                                updateAttributes({ caption: '' });
                            }
                        }}
                        title="Caption"
                    >
                        <Captions />
                    </ControlButton>

                </MenuContainer>
            </BubbleMenu>

            <MediaLibraryModal
                isOpen={mediaLibOpen}
                onClose={() => setMediaLibOpen(false)}
                onSelect={handleMediaSelect}
            />
        </>
    );
};
