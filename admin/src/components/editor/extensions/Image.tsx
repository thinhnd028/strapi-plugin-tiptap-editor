import { NodeViewProps } from "@tiptap/core";
import Image from "@tiptap/extension-image";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Captions,
  Check,
  ImageUpscaleIcon,
  Link as LinkIcon,
  Replace,
  Save,
  Trash,
  X
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { type MediaFile, MediaLibraryModal } from "../../MediaLibraryModal";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../../ui/dropdown-menu";
import { Input } from "../../ui/input";

// === EXTENSION IMAGE DENGAN FITUR BARU ===
export const ImageExtension = Image.extend({
  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      width: { default: "90%" },
      pixelWidth: { default: null },
      pixelHeight: { default: null },
      originalWidth: { default: null },
      originalHeight: { default: null },
      media_id: { default: null },
      height: { default: 'auto' },
      align: { default: "left" }, // Default Left Align
      srcset: { default: null },
      maxWidth: { default: "100%" },
      aspectRatio: { default: null },
      objectFit: { default: "contain" },
      mobileWidth: { default: "100%" },
      mobileMaxWidth: { default: "100%" },
      useResponsive: { default: false },
      href: { default: null },
      caption: { default: null },
    };
  },

  addNodeView: () => ReactNodeViewRenderer(TiptapImageComponent),

  parseHTML() {
    return [
      {
        tag: 'figure',
        getAttrs: (dom) => {
          if (typeof dom === 'string') return {};
          const img = dom.querySelector('img');
          if (!img) return false;

          const width = img.getAttribute('width');
          const height = img.getAttribute('height');
          const dataMediaId = img.getAttribute('data-media-id');
          const dataOriginalWidth = img.getAttribute('data-original-width');
          const dataOriginalHeight = img.getAttribute('data-original-height');

          return {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt'),
            pixelWidth: width && !isNaN(+width) ? +width : null,
            pixelHeight: height && !isNaN(+height) ? +height : null,
            media_id: dataMediaId || null,
            originalWidth: dataOriginalWidth && !isNaN(+dataOriginalWidth) ? +dataOriginalWidth : null,
            originalHeight: dataOriginalHeight && !isNaN(+dataOriginalHeight) ? +dataOriginalHeight : null,
          };
        },
      },
      {
        tag: 'img[src]',
        getAttrs: (dom) => {
          if (typeof dom === 'string') return {};
          const element = dom as HTMLImageElement;
          const width = element.getAttribute('width');
          const height = element.getAttribute('height');
          const dataMediaId = element.getAttribute('data-media-id');
          const dataOriginalWidth = element.getAttribute('data-original-width');
          const dataOriginalHeight = element.getAttribute('data-original-height');

          return {
            src: element.getAttribute('src'),
            alt: element.getAttribute('alt'),
            pixelWidth: width && !isNaN(+width) ? +width : null,
            pixelHeight: height && !isNaN(+height) ? +height : null,
            media_id: dataMediaId || null,
            originalWidth: dataOriginalWidth && !isNaN(+dataOriginalWidth) ? +dataOriginalWidth : null,
            originalHeight: dataOriginalHeight && !isNaN(+dataOriginalHeight) ? +dataOriginalHeight : null,
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const {
      pixelWidth,
      pixelHeight,
      media_id,
      originalWidth,
      originalHeight,
      href,
      caption,
      align,
      ...imgAttrs
    } = HTMLAttributes;

    if (pixelWidth) imgAttrs.width = pixelWidth;
    if (pixelHeight) imgAttrs.height = pixelHeight;

    if (media_id) imgAttrs['data-media-id'] = media_id;
    if (originalWidth) imgAttrs['data-original-width'] = originalWidth;
    if (originalHeight) imgAttrs['data-original-height'] = originalHeight;

    // Apply alignment style to image if needed
    if (align) {
      imgAttrs.style = `${imgAttrs.style || ''}float:${align};margin:${align === 'center' ? '0 auto' : '0'};display:${align === 'center' ? 'block' : 'inline-block'};`;
    }

    let image = ['img', imgAttrs];

    if (href) {
      image = ['a', { href, target: '_blank', rel: 'noopener noreferrer' }, image];
    }

    if (caption) {
      const figureStyle = `width:${imgAttrs.width || '100%'};`;
      return [
        'figure',
        { style: figureStyle, class: `image-style-${align || 'center'}` },
        image,
        ['figcaption', { style: "text-align: center; font-style: italic; color: #666; margin-top: 8px;" }, caption]
      ];
    }

    return image as any;
  },
});

const ImageWrapper = styled(NodeViewWrapper) <{ $align?: string }>`
  position: relative;
  display: flex;
  width: 100%;
  margin: 0;
  cursor: text; /* Suggests text selection is possible here */

  /* Handle Alignment via Flex */
  justify-content: ${props => {
    switch (props.$align) {
      case "left": return "flex-start";
      case "right": return "flex-end";
      default: return "center";
    }
  }};
`;

const ImageContainer = styled.div<{
  $objectFit?: string;
  $selected?: boolean;
  $width?: string;
  $maxWidth?: string;
  $mobileWidth?: string;
  $mobileMaxWidth?: string;
  $useResponsive?: boolean;
}>`
  position: relative;
  display: flex;
  flex-direction: column;
  /* overflow: hidden; Removed to prevent clipping of toolbar on small images */
  border: 2px solid transparent;
  
  /* Sizing Logic moved here */
  width: ${props => props.$width || "90%"};
  max-width: ${props => props.$maxWidth || "100%"};

  ${props => props.$selected && `
    border-color: ${props.theme.colors.primary500};
    z-index: 100;
  `}

  @media (max-width: 768px) {
    ${props => props.$useResponsive && `
      width: ${props.$mobileWidth || "100%"} !important;
      max-width: ${props.$mobileMaxWidth || "100%"} !important;
    `}
  }
`;

const StyledImage = styled.img<{ $aspectRatio?: string }>`
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
  ${props => props.$aspectRatio && `aspect-ratio: ${props.$aspectRatio};`}
`;

const ImageControls = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  /* right: 8px; Removed */
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: ${props => props.theme.colors.neutral0};
  border: 1px solid ${props => props.theme.colors.neutral200};
  padding: 4px;
  border-radius: 4px; /* Added border-radius */
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  z-index: 50;
  white-space: nowrap;
`;

const ControlButton = styled(Button)`
  height: 28px;
  padding: 0 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.primary100} !important;
  }

  &[data-active="true"] {
    background-color: ${props => props.theme.colors.primary100};
    color: ${props => props.theme.colors.primary600};
    border-color: ${props => props.theme.colors.primary500};
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const ControlSeparator = styled.div`
  width: 1px;
  height: 16px;
  background-color: ${props => props.theme.colors.neutral200};
  margin: 0 2px;
`;

// === HELPER ===
const normalizeImageAttributes = (attrs: any) => {
  const normalized = { ...attrs };

  if (attrs.src && !attrs.width && !attrs.align) {
    normalized.width = "90%";
    normalized.align = "left"; // Default Left
    normalized.maxWidth = "100%";
    normalized.objectFit = "contain";
    normalized.mobileWidth = "100%";
    normalized.mobileMaxWidth = "100%";
    normalized.useResponsive = false;
  }

  if (attrs.pixelWidth && !attrs.originalWidth) {
    normalized.originalWidth = attrs.pixelWidth;
  }
  if (attrs.pixelHeight && !attrs.originalHeight) {
    normalized.originalHeight = attrs.pixelHeight;
  }

  return normalized;
};

// === KOMPONEN UTAMA ===
export function TiptapImageComponent(props: NodeViewProps) {
  const { node, editor, selected, deleteNode, updateAttributes } = props;
  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [mediaLibOpen, setMediaLibOpen] = useState(false);

  // Removed unused focus state logic

  // Click Outside to Deselect
  useEffect(() => {
    const handleClickStrays = (e: MouseEvent) => {
      if (!selected) return;
      if (!editor) return;

      const target = e.target as Node;

      // If clicking inside the image container -> do nothing (Tiptap handles selection)
      if (containerRef.current && containerRef.current.contains(target)) return;

      // If clicking inside the toolbar -> do nothing
      if (toolbarRef.current && toolbarRef.current.contains(target)) return;

      const editorDom = editor.view.dom;
      if (!editorDom.contains(target) && !toolbarRef.current?.contains(target)) {
        // Explicitly blur the editor to remove selection visual state
        if (editor.view.dom instanceof HTMLElement) {
          editor.view.dom.blur();
        } else if ((editor.view.dom as any).blur) {
          (editor.view.dom as any).blur();
        }
      }
    };

    window.addEventListener('mousedown', handleClickStrays);
    return () => window.removeEventListener('mousedown', handleClickStrays);
  }, [selected, editor]);

  // Editing Modes
  const [editingMode, setEditingMode] = useState<'none' | 'alt' | 'link' | 'caption'>('none');
  const [tempValue, setTempValue] = useState("");

  // Normalize attrs
  useEffect(() => {
    const normalizedAttrs = normalizeImageAttributes(node.attrs);
    const needsUpdate = Object.keys(normalizedAttrs).some(k => normalizedAttrs[k] !== node.attrs[k]);
    if (needsUpdate) updateAttributes(normalizedAttrs);
  }, [node.attrs, updateAttributes]);

  // Sync temp value based on mode
  useEffect(() => {
    if (editingMode === 'alt') setTempValue(node.attrs.alt || "");
    if (editingMode === 'link') setTempValue(node.attrs.href || "");
    if (editingMode === 'caption') setTempValue(node.attrs.caption || "");

    // Manual Focus with preventScroll to avoid jitter
    if (editingMode === 'link' || editingMode === 'alt') {
      setTimeout(() => {
        inputRef.current?.focus({ preventScroll: true });
      }, 10);
    }
  }, [editingMode, node.attrs.alt, node.attrs.href, node.attrs.caption]);

  // Handle media select
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
      pixelHeight: file.height,
      width: "auto",
      originalWidth: file.width,
      originalHeight: file.height,
      media_id: file.id,
      aspectRatio: file.width && file.height ? `${file.width}/${file.height}` : null,
      srcset,
    });
  };

  const toggleResponsive = () => updateAttributes({ useResponsive: !node.attrs.useResponsive });

  // Display width
  const getDisplayWidth = () => {
    if (!node.attrs.useResponsive && node.attrs.pixelWidth) {
      return `${node.attrs.pixelWidth}px`;
    }
    if (typeof node.attrs.width === 'string') return node.attrs.width;
    return 'auto';
  };

  const saveValue = () => {
    if (editingMode === 'alt') updateAttributes({ alt: tempValue });
    if (editingMode === 'link') updateAttributes({ href: tempValue });
    if (editingMode === 'caption') updateAttributes({ caption: tempValue });
    setEditingMode('none');
  };

  const deleteValueAttributes = () => {
    if (editingMode === 'link') updateAttributes({ href: null });
    if (editingMode === 'caption') updateAttributes({ caption: null });
    setEditingMode('none');
  };

  const { width, align, mobileWidth, useResponsive } = node.attrs;

  return (
    <>
      <ImageWrapper
        $align={align}
      >
        <ImageContainer
          ref={containerRef}
          $objectFit={node.attrs.objectFit}
          $selected={selected}
          $width={getDisplayWidth()}
          $maxWidth={node.attrs.maxWidth}
          $mobileWidth={mobileWidth}
          $mobileMaxWidth={node.attrs.mobileMaxWidth}
          $useResponsive={useResponsive}
        >
          <StyledImage
            ref={imageRef}
            src={node.attrs.src}
            alt={node.attrs.alt}
            title={node.attrs.title}
            $aspectRatio={node.attrs.aspectRatio}
          />

          {/* Caption Display */}
          {node.attrs.caption !== null && (
            <figcaption style={{
              width: '100%',
              textAlign: 'center'
            }}>
              <input
                className="caption-input"
                placeholder="Write a caption..."
                value={node.attrs.caption || ''}
                onChange={(e) => updateAttributes({ caption: e.target.value })}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: '100%',
                  border: 'none',
                  background: 'transparent',
                  textAlign: 'center',
                  fontSize: '14px',
                  color: '#666',
                  outline: 'none',
                  fontStyle: 'italic'
                }}
              />
            </figcaption>
          )}

          {/* Static Toolbar (Top-Right) */}
          {selected && (
            <ImageControls
              onClick={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
              onMouseDown={(e) => {
                const target = e.target as HTMLElement;
                // Allow interactions with Input, Button, within the toolbar: Stop propagation to prevent Tiptap theft
                // Only prevent default if clicking the container background to avoid blur
                if (['INPUT', 'BUTTON', 'SVG', 'path'].includes(target.tagName) || target.closest('button')) {
                  e.stopPropagation();
                } else {
                  e.preventDefault();
                }
              }}
            >
              {editingMode !== 'none' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 4 }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#333' }}>
                    {editingMode === 'link' ? "Link" : "Alt Text"}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Input
                      ref={inputRef}
                      placeholder={editingMode === 'link' ? "Paste link..." : "Alt text"}
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      style={{ height: '28px', width: '200px', fontSize: '13px' }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveValue();
                        if (e.key === 'Escape') setEditingMode('none');
                      }}
                    />
                    <ControlButton variant="ghost" size="sm" onClick={saveValue}>
                      <Save className="text-primary-600" />
                    </ControlButton>
                    {/* Show Delete only if value exists */}
                    {((editingMode === 'link' && node.attrs.href) || (editingMode === 'caption' && node.attrs.caption)) && (
                      <ControlButton variant="ghost" size="sm" onClick={deleteValueAttributes}>
                        <Trash className="text-danger-600" />
                      </ControlButton>
                    )}
                    <ControlButton variant="ghost" size="sm" onClick={() => setEditingMode('none')}>
                      <X className="text-neutral-500" />
                    </ControlButton>
                  </div>
                </div>
              ) : (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <ControlButton variant="ghost" size="sm" style={{ gap: 4 }}>
                        <ImageUpscaleIcon />
                        <span style={{ fontSize: '12px', fontWeight: 600 }}>
                          {useResponsive ? width : (width === 'auto' ? 'Original' : width)}
                        </span>
                      </ControlButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => updateAttributes({ width: 'auto', useResponsive: false })}>
                        Original
                        {!useResponsive && width === 'auto' && <Check className="ml-auto h-4 w-4" />}
                      </DropdownMenuItem>
                      <ControlSeparator style={{ margin: '4px 0', width: '100%', height: '1px' }} />
                      {[
                        { label: "50% page width", value: "50%" },
                        { label: "75% page width", value: "75%" },
                        { label: "100% page width", value: "100%" },
                      ].map(preset => (
                        <DropdownMenuItem
                          key={preset.value}
                          onClick={() => updateAttributes({ width: preset.value, useResponsive: true })}
                        >
                          {preset.label}
                          {useResponsive && width === preset.value && <Check className="ml-auto h-4 w-4" />}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <ControlSeparator />

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <ControlButton variant="ghost" size="sm">
                        {align === 'left' && <AlignLeft />}
                        {align === 'center' && <AlignCenter />}
                        {align === 'right' && <AlignRight />}
                      </ControlButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => updateAttributes({ align: 'left' })}>
                        <AlignLeft className="mr-2 h-4 w-4" /> Left
                        {align === 'left' && <Check className="ml-auto h-4 w-4" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateAttributes({ align: 'center' })}>
                        <AlignCenter className="mr-2 h-4 w-4" /> Center
                        {align === 'center' && <Check className="ml-auto h-4 w-4" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateAttributes({ align: 'right' })}>
                        <AlignRight className="mr-2 h-4 w-4" /> Right
                        {align === 'right' && <Check className="ml-auto h-4 w-4" />}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <ControlButton
                    size="sm"
                    data-active={!!node.attrs.href}
                    onClick={() => setEditingMode('link')}
                    title="Link"
                  >
                    <LinkIcon className={node.attrs.href ? "text-primary-600" : ""} />
                  </ControlButton>

                  <ControlButton
                    size="sm"
                    data-active={node.attrs.caption !== null}
                    onClick={() => {
                      // Toggle Caption: If exists (even empty), remove it. If null, add empty string.
                      if (node.attrs.caption !== null) {
                        updateAttributes({ caption: null });
                      } else {
                        updateAttributes({ caption: '' });
                        // Optional: focus logic could go here if we had a ref to the caption input
                      }
                    }}
                    title="Caption"
                  >
                    <Captions className={node.attrs.caption !== null ? "text-primary-600" : ""} />
                  </ControlButton>

                  {/* <ControlButton size="sm" onClick={() => setEditingMode('alt')}>
                    <span style={{ fontSize: '10px', fontWeight: 600 }}>ALT</span>
                  </ControlButton> */}

                  <ControlButton size="sm" onClick={() => setMediaLibOpen(true)}>
                    <Replace />
                  </ControlButton>

                  <ControlSeparator />

                  <ControlButton size="sm" onClick={deleteNode} className="text-danger-600">
                    <Trash />
                  </ControlButton>
                </>
              )}
            </ImageControls>
          )}

        </ImageContainer>
      </ImageWrapper >

      <MediaLibraryModal
        isOpen={mediaLibOpen}
        onClose={() => setMediaLibOpen(false)}
        onSelect={handleMediaSelect}
      />
    </>
  );
}