import { NodeViewProps } from "@tiptap/core";
import Image from "@tiptap/extension-image";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { useEffect, useRef, useState, useCallback } from "react";
import styled from "styled-components";

// Types for Resize Config
interface ResizeConfig {
  enabled: boolean;
  directions: ('top' | 'bottom' | 'left' | 'right')[];
  minWidth: number;
  minHeight: number;
  alwaysPreserveAspectRatio: boolean;
}

// === EXTENSION IMAGE DENGAN FITUR BARU ===
export const ImageExtension = Image.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      resize: {
        enabled: true,
        directions: ['left', 'right'], // Default to side handles as before, but user can override
        minWidth: 50,
        minHeight: 50,
        alwaysPreserveAspectRatio: true,
      } as ResizeConfig,
    };
  },

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      width: { default: "90%" }, // Default width
      pixelWidth: { default: null },
      align: { default: "left" }, // Default Left Align
      maxWidth: { default: "100%" },
      aspectRatio: { default: null },
      objectFit: { default: "contain" },
      useResponsive: { default: false },
      href: { default: null },
      caption: { default: false },
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

          const figcaption = dom.querySelector('figcaption');
          const captionText = figcaption?.textContent?.trim() || null;

          const width = img.getAttribute('width');
          const height = img.getAttribute('height');

          return {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt'),
            pixelWidth: width && !isNaN(+width) ? +width : null,
            caption: captionText ? captionText : false,
          };
        },
      },
      {
        tag: 'img[src]',
        getAttrs: (dom) => {
          if (typeof dom === 'string') return {};
          const element = dom as HTMLImageElement;
          const width = element.getAttribute('width');

          return {
            src: element.getAttribute('src'),
            alt: element.getAttribute('alt'),
            pixelWidth: width && !isNaN(+width) ? +width : null,
            caption: false,
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
      useResponsive,
      maxWidth,
      objectFit,
      mobileWidth,
      mobileMaxWidth,
      ...imgAttrs
    } = HTMLAttributes;

    if (pixelWidth) imgAttrs.width = pixelWidth;

    // Determine valid CSS width for figure
    let cssWidth = '100%';
    if (imgAttrs.width) {
      cssWidth = typeof imgAttrs.width === 'number' ? `${imgAttrs.width}px` : imgAttrs.width;
    }

    const hasCaption = caption !== false && caption !== null && caption !== undefined;

    // Apply alignment style
    const alignStyles = align ? `margin-left:${align === 'center' || align === 'right' ? 'auto' : '0'};margin-right:${align === 'center' || align === 'left' ? 'auto' : '0'};display:block;` : '';

    if (!hasCaption) {
      const imgMargin = 'margin-top:1.5rem;margin-bottom:1.5rem;';
      imgAttrs.style = `${imgAttrs.style || ''}${imgMargin}${align ? alignStyles : ''}`;
    }

    // When inside a figure, ensure image is block to avoid inline gaps
    if (hasCaption) {
      imgAttrs.style = `${imgAttrs.style || ''}display:block;max-width:100%;height:auto;`;
    }

    let image = ['img', imgAttrs];

    if (href) {
      image = ['a', { href, target: '_blank', rel: 'noopener noreferrer' }, image];
    }

    // Render as <figure> when caption is enabled (string, possibly empty)
    if (hasCaption) {
      const figureStyle = `width:${cssWidth};max-width:100%;margin-top:1.5rem;margin-bottom:1.5rem;${alignStyles}`;
      return [
        'figure',
        { style: figureStyle, class: `image-style-${align || 'center'}` },
        image,
        [
          'figcaption',
          { style: "text-align: left; font-style: italic; color: #666; margin-top: 8px; border-left: 2px solid red; padding-left: 10px;" },
          caption || ''
        ]
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
  cursor: default;
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
}>`
  position: relative;
  display: flex;
  flex-direction: column;
  border: 2px solid transparent;
  width: ${props => props.$width || "90%"};
  max-width: ${props => props.$maxWidth || "100%"};

  ${props => props.$selected && `
    border-color: ${props.theme.colors.primary500};
    z-index: 10;
  `}
`;

const StyledImage = styled.img<{ $aspectRatio?: string }>`
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
  ${props => props.$aspectRatio && `aspect-ratio: ${props.$aspectRatio};`}
`;

// Caption Styles
const CaptionWrapper = styled.div`
  width: 100%;
  margin-top: 8px;
  border-left: 2px solid ${props => props.theme.colors.danger600};
  padding-left: 10px; 
  display: flex;
`;

const CaptionInput = styled.textarea`
  flex: 1;
  min-height: 24px;
  resize: vertical;
  text-align: left;
  font-style: italic;
  color: #666;
  font-size: 14px;
  border: none;
  background: transparent;
  outline: none;
  font-family: inherit;
  padding: 0; 
  line-height: 1.5;
  
  &::placeholder {
      color: #999;
  }
`;


// Handles
const BaseHandle = styled.div`
  position: absolute;
  z-index: 60;
  background: transparent; /* Hit area transparent */
  
  &::after {
    content: "";
    background-color: ${props => props.theme.colors.primary500};
    border-radius: 4px;
    box-shadow: 0 0 4px rgba(0,0,0,0.2);
    position: absolute;
    /* Center the visible handle in the hit area */
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`;

// Vertical Handles (Left/Right)
const VerticalHandle = styled(BaseHandle)`
  top: 0;
  bottom: 0;
  width: 12px;
  cursor: col-resize;

  &::after {
    width: 4px;
    height: 48px;
    max-height: 60%;
  }
`;

const ResizeHandleLeft = styled(VerticalHandle)`
  left: 0;
`;

const ResizeHandleRight = styled(VerticalHandle)`
  right: 0;
`;

// Horizontal Handles (Top/Bottom)
const HorizontalHandle = styled(BaseHandle)`
  left: 0;
  right: 0;
  height: 12px;
  cursor: row-resize;
  
  &::after {
     height: 4px;
     width: 48px;
     max-width: 60%;
  }
`;

const ResizeHandleTop = styled(HorizontalHandle)`
    top: 0;
`;

const ResizeHandleBottom = styled(HorizontalHandle)`
    bottom: 0;
`;



// === HELPER ===
const normalizeImageAttributes = (attrs: any) => {
  const normalized = { ...attrs };

  if (attrs.src && !attrs.width && !attrs.align) {
    normalized.width = "90%";
    normalized.align = "left"; // Default Left
    normalized.maxWidth = "100%";
    normalized.objectFit = "contain";
    normalized.useResponsive = false;
  }

  return normalized;
};

// === COMPONENT ===
export function TiptapImageComponent(props: NodeViewProps) {
  const { node, editor, selected, updateAttributes, extension } = props;
  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [resizing, setResizing] = useState(false);
  const [currentWidth, setCurrentWidth] = useState<string>('auto');

  // Conf
  const resizeOptions: ResizeConfig = extension.options.resize || {
    enabled: true,
    directions: ['left', 'right'],
    minWidth: 50,
    minHeight: 50,
    alwaysPreserveAspectRatio: true,
  };

  // Normalize attrs
  useEffect(() => {
    const normalizedAttrs = normalizeImageAttributes(node.attrs);
    const needsUpdate = Object.keys(normalizedAttrs).some(k => normalizedAttrs[k] !== node.attrs[k]);
    if (needsUpdate) updateAttributes(normalizedAttrs);
  }, [node.attrs, updateAttributes]);


  // Display width calculation
  const getDisplayWidth = useCallback(() => {
    if (resizing) return currentWidth;
    if (!node.attrs.useResponsive && node.attrs.pixelWidth) {
      return `${node.attrs.pixelWidth}px`;
    }
    if (typeof node.attrs.width === 'string') return node.attrs.width;
    return 'auto';
  }, [node.attrs.useResponsive, node.attrs.pixelWidth, node.attrs.width, resizing, currentWidth]);


  // Resize Logic
  const handleMouseDown = useCallback((e: React.MouseEvent, direction: 'left' | 'right' | 'top' | 'bottom') => {
    e.preventDefault();
    e.stopPropagation();

    if (!containerRef.current || !resizeOptions.enabled) return;

    // Initial dimensions
    const startWidth = containerRef.current.clientWidth;
    const startHeight = containerRef.current.clientHeight;
    const aspectRatio = startWidth / startHeight;

    const startX = e.clientX;
    const startY = e.clientY;

    setResizing(true);
    setCurrentWidth(`${startWidth}px`);

    const onMouseMove = (moveEvent: MouseEvent) => {
      const currentX = moveEvent.clientX;
      const currentY = moveEvent.clientY;

      const diffX = currentX - startX;
      const diffY = currentY - startY;

      let newWidth = startWidth;

      // Calculate new width based on direction
      // If Top/Bottom is used, we scale width based on height change to keep Aspect Ratio (since alwaysPreserveAspectRatio=true here implies we drive width)
      // Actually strictly speaking user said "alwaysPreserveAspectRatio: true", so changing Height means changing Width.

      if (direction === 'right') {
        newWidth = startWidth + diffX;
      } else if (direction === 'left') {
        newWidth = startWidth - diffX;
      } else if (direction === 'bottom') {
        // Dragging down increases height -> increases width
        const newHeight = startHeight + diffY;
        newWidth = newHeight * aspectRatio;
      } else if (direction === 'top') {
        // Dragging up increases height -> increases width
        const newHeight = startHeight - diffY;
        newWidth = newHeight * aspectRatio;
      }

      // Constraints
      newWidth = Math.max(resizeOptions.minWidth, newWidth);

      // Also check minHeight constraint (approx)
      if (newWidth / aspectRatio < resizeOptions.minHeight) {
        newWidth = resizeOptions.minHeight * aspectRatio;
      }

      setCurrentWidth(`${newWidth}px`);
    };

    const onMouseUp = (upEvent: MouseEvent) => {
      // ... (Similar logic to calculate final for safe measure or just take current)
      // Ideally we should recalculate using exact same logic to be pure
      // But for this simple implementation, let's just use the last scheduled update or re-run
      // Let's re-run logic:
      const currentX = upEvent.clientX;
      const currentY = upEvent.clientY;
      const diffX = currentX - startX;
      const diffY = currentY - startY;

      let finalWidth = startWidth;

      if (direction === 'right') {
        finalWidth = startWidth + diffX;
      } else if (direction === 'left') {
        finalWidth = startWidth - diffX;
      } else if (direction === 'bottom') {
        const newHeight = startHeight + diffY;
        finalWidth = newHeight * aspectRatio;
      } else if (direction === 'top') {
        const newHeight = startHeight - diffY;
        finalWidth = newHeight * aspectRatio;
      }

      finalWidth = Math.max(resizeOptions.minWidth, finalWidth);
      if (finalWidth / aspectRatio < resizeOptions.minHeight) {
        finalWidth = resizeOptions.minHeight * aspectRatio;
      }

      updateAttributes({
        width: `${finalWidth}px`,
        pixelWidth: finalWidth,
        useResponsive: false,
      });

      setResizing(false);

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [updateAttributes, resizeOptions]);


  const { align } = node.attrs;

  return (
    <ImageWrapper $align={align}>
      <ImageContainer
        ref={containerRef}
        $objectFit={node.attrs.objectFit}
        $selected={selected || resizing}
        $width={getDisplayWidth()}
        $maxWidth={node.attrs.maxWidth}
      >
        <StyledImage
          ref={imageRef}
          src={node.attrs.src}
          alt={node.attrs.alt}
          title={node.attrs.title}
          $aspectRatio={node.attrs.aspectRatio}
        />

        {node.attrs.caption !== false && node.attrs.caption !== null && (
          <CaptionWrapper>
            <CaptionInput
              rows={1}
              value={node.attrs.caption || ''}
              placeholder="Write a caption..."
              onChange={(e) => updateAttributes({ caption: e.target.value })}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            />
          </CaptionWrapper>
        )}

        {(selected || resizing) && resizeOptions.enabled && (
          <>
            {resizeOptions.directions.includes('left') && <ResizeHandleLeft onMouseDown={(e) => handleMouseDown(e, 'left')} />}
            {resizeOptions.directions.includes('right') && <ResizeHandleRight onMouseDown={(e) => handleMouseDown(e, 'right')} />}
            {resizeOptions.directions.includes('top') && <ResizeHandleTop onMouseDown={(e) => handleMouseDown(e, 'top')} />}
            {resizeOptions.directions.includes('bottom') && <ResizeHandleBottom onMouseDown={(e) => handleMouseDown(e, 'bottom')} />}
          </>
        )}

      </ImageContainer>
    </ImageWrapper >
  );
}