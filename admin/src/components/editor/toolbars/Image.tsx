import { forwardRef, useCallback, useState } from "react";
import { LucideImage } from "lucide-react";
import { useEditorContext } from "../partials/EditorProvider";
import ToolbarButton, { ToolbarButtonProps } from "../partials/ToolbarButton";
import styled from "styled-components";
import { MediaFile, MediaLibraryModal } from "../../MediaLibraryModal";

// Styled Components
const ImageIcon = styled(LucideImage)`
  width: 16px;
  height: 16px;
`;

const ImageToolbar = forwardRef<
  HTMLButtonElement,
  ToolbarButtonProps
>(({ className, onClick, children, ...props }, ref) => {
  const { editor } = useEditorContext();
  const [mediaLibOpen, setMediaLibOpen] = useState(false);

  const handleMediaSelect = useCallback((file: MediaFile) => {
    if (!file) return;

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

    editor.chain().focus().setImage({
      src: file.url,
      alt: file.alt,
      title: file.name,
      pixelWidth: file.width,
      pixelHeight: file.height,
      originalWidth: file.width,
      originalHeight: file.height,
      media_id: file.id,
      width: "auto",
      aspectRatio: file.width && file.height ? `${file.width}/${file.height}` : null,
      srcset,
    } as any).run();

    setMediaLibOpen(false);
  }, [editor]);

  return (
    <>
      <ToolbarButton
        tooltip="Image"
        aria-label="Insert image"
        isActive={editor?.isActive("image")}
        onClick={(e) => {
          setMediaLibOpen(true);
          onClick?.(e);
        }}
        ref={ref}
        {...props}
      >
        {children || <ImageIcon />}
      </ToolbarButton>

      <MediaLibraryModal
        isOpen={mediaLibOpen}
        onClose={() => setMediaLibOpen(false)}
        onSelect={handleMediaSelect}
      />
    </>
  );
});

ImageToolbar.displayName = "ImageToolbar";

export { ImageToolbar };