import { Popover } from "@strapi/design-system";
import type { Extension } from "@tiptap/core";
import type { ColorOptions } from "@tiptap/extension-color";
import type { HighlightOptions } from "@tiptap/extension-highlight";
import { BaselineIcon, Check, ChevronDown, HighlighterIcon } from "lucide-react";
import { useState } from "react";
import styled from "styled-components";
import { Separator } from "../../ui/separator";
import { useEditorContext } from "../partials/EditorProvider";
import ToolbarButton from "../partials/ToolbarButton";

export type TextStylingExtensions =
  | Extension<ColorOptions, any>
  | Extension<HighlightOptions, any>;

const TEXT_COLORS = [
  { name: "Default", color: "inherit" },
  { name: "Gray", color: "#6B7280" },
  { name: "Brown", color: "#92400E" },
  { name: "Orange", color: "#EA580C" },
  { name: "Yellow", color: "#CA8A04" },
  { name: "Green", color: "#16A34A" },
  { name: "Blue", color: "#2563EB" },
  { name: "Purple", color: "#9333EA" },
  { name: "Pink", color: "#DB2777" },
  { name: "Red", color: "#DC2626" },
  { name: "Black", color: "#000000" },
  { name: "White", color: "#FFFFFF" },
  { name: "Primary", color: "#1D2556" },
  { name: "Danger", color: "#e8222f" },
  { name: "Sky", color: "#0ea5e9" },
  { name: "Warning", color: "#FEF995" },
];

const HIGHLIGHT_COLORS = [
  { name: "Default", color: "transparent" },
  { name: "Gray", color: "#F3F4F6" },
  { name: "Brown", color: "#FEF3C7" },
  { name: "Orange", color: "#FFEDD5" },
  { name: "Yellow", color: "#FEF9C3" },
  { name: "Green", color: "#DCFCE7" },
  { name: "Blue", color: "#DBEAFE" },
  { name: "Purple", color: "#F3E8FF" },
  { name: "Pink", color: "#FCE7F3" },
  { name: "Red", color: "#FEE2E2" },
];

// Styled Components
const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 4px;
`;

const CompactColorButton = styled.button<{ $isActive?: boolean; $color: string; $isHighlight?: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${props => props.theme.colors.neutral200};
  
  ${props => props.$isHighlight
    ? `background-color: ${props.$color}; color: ${props.theme.colors.neutral800};`
    : props.$color.toLowerCase() === '#ffffff'
      ? `background-color: ${props.theme.colors.neutral800}; color: ${props.$color};`
      : `background-color: transparent; color: ${props.$color === 'inherit' ? props.theme.colors.neutral800 : props.$color};`
  }

  ${props => props.$color === 'inherit' && !props.$isHighlight && `
    background: linear-gradient(to bottom right, transparent 48%, #ff0000 48%, #ff0000 52%, transparent 52%);
    border-color: ${props.theme.colors.neutral300};
    color: ${props.theme.colors.neutral800};
  `}

  ${props => props.$color === 'transparent' && props.$isHighlight && `
    background: linear-gradient(to bottom right, transparent 48%, #ff0000 48%, #ff0000 52%, transparent 52%);
    background-color: ${props.theme.colors.neutral100};
  `}

  &:hover {
    border-color: ${props => props.theme.colors.primary500};
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  ${props => props.$isActive && `
    border-color: ${props.theme.colors.primary600};
    box-shadow: 0 0 0 1px ${props.theme.colors.primary600};
    transform: scale(1.05);
  `}
`;

const CheckIcon = styled(Check)`
  width: 12px;
  height: 12px;
  color: ${props => props.theme.colors.neutral800};
  filter: drop-shadow(0 0 1px white);
`;

const SectionTitle = styled.div`
  margin: 6px 0;
  padding: 0 4px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
  color: ${props => props.theme.colors.neutral600};
`;

const ChevronIcon = styled(ChevronDown)`
  width: 12px;
  height: 12px;
`;

const ToolbarContentWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 0 2px 0 2px;
`;

interface ToolbarContentProps {
  children: React.ReactNode;
  dropdown?: boolean;
}

const ToolbarContent = ({ children, dropdown }: ToolbarContentProps) => (
  <ToolbarContentWrapper>
    {children}
    {dropdown && <ChevronIcon />}
  </ToolbarContentWrapper>
);

const PopoverContent = styled(Popover.Content)`
  background-color: ${props => props.theme.colors.neutral0};
  border: 1px solid ${props => props.theme.colors.neutral300};
  border-radius: 4px;
  padding: 8px;
  width: 180px;
  box-shadow: ${props => props.theme.shadows.popupShadow};
`;

const SeparatorStyled = styled(Separator)`
  margin: 8px 0;
`;

interface ColorButtonProps {
  name: string;
  color: string;
  isActive: boolean;
  onClick: () => void;
  isHighlight?: boolean;
}

const ColorButtonComponent = ({
  name,
  color,
  isActive,
  onClick,
  isHighlight,
}: ColorButtonProps) => (
  <CompactColorButton
    $isActive={isActive}
    $color={color}
    $isHighlight={isHighlight}
    onClick={onClick}
    type="button"
    aria-label={name}
  >
    {/* Show styled A for text color, checkmark for highlight if needed, or just cleaner representation */}
    {!isHighlight && color !== 'inherit' && <BaselineIcon />}
    {isHighlight && isActive && <CheckIcon />}
  </CompactColorButton>
);

interface RecentColor {
  color: string;
  isHighlight: boolean;
}

export const ColorAndHighlightToolbar = () => {
  const { editor } = useEditorContext();
  const [recentColors, setRecentColors] = useState<RecentColor[]>([]);

  const currentColor = editor?.getAttributes("textStyle").color;
  const currentHighlight = editor?.getAttributes("highlight").color;

  const addToRecent = (color: string, isHighlight: boolean) => {
    // Determine the "default" or "transparent" value to avoid adding them to recent
    const isDefault = isHighlight ? color === 'transparent' : color === 'inherit' || color === '';
    if (isDefault) return;

    setRecentColors(prev => {
      const existing = prev.filter(c => !(c.color === color && c.isHighlight === isHighlight));
      return [{ color, isHighlight }, ...existing].slice(0, 5);
    });
  };

  const handleSetColor = (color: string) => {
    editor
      ?.chain()
      .focus()
      .setColor(color.toLowerCase() === currentColor?.toLowerCase() ? "" : color)
      .run();

    if (color !== currentColor) {
      addToRecent(color, false);
    }
  };

  const handleSetHighlight = (color: string) => {
    editor
      ?.chain()
      .focus()
      .setHighlight(color.toLowerCase() === currentHighlight?.toLowerCase() ? { color: "" } : { color })
      .run();

    if (color !== currentHighlight) {
      addToRecent(color, true);
    }
  };

  const isDisabled =
    !editor?.can().chain().setHighlight().run() ||
    !editor?.can().chain().setColor("").run();

  return (
    <Popover.Root>
      <div style={{ position: 'relative', height: '100%' }}>
        <Popover.Trigger disabled={isDisabled}>
          <ToolbarButton
            tooltip="Text Color & Highlight"
            aria-label="Set color & highlight"
            style={{
              color: currentColor,
              backgroundColor: currentHighlight,
            }}
          >
            <ToolbarContent>
              <HighlighterIcon />
            </ToolbarContent>
          </ToolbarButton>
        </Popover.Trigger>

        <PopoverContent align="start">
          {recentColors.length > 0 && (
            <>
              <SectionTitle>Recently Used</SectionTitle>
              <ColorGrid>
                {recentColors.map((recent, index) => (
                  <ColorButtonComponent
                    key={`${recent.color}-${recent.isHighlight}-${index}`}
                    name={recent.color}
                    color={recent.color}
                    isActive={
                      recent.isHighlight
                        ? (currentHighlight?.toLowerCase() === recent.color.toLowerCase())
                        : (currentColor?.toLowerCase() === recent.color.toLowerCase())
                    }
                    onClick={() => recent.isHighlight ? handleSetHighlight(recent.color) : handleSetColor(recent.color)}
                    isHighlight={recent.isHighlight}
                  />
                ))}
              </ColorGrid>
              <SeparatorStyled />
            </>
          )}

          <SectionTitle>Text Color</SectionTitle>
          <ColorGrid>
            {TEXT_COLORS.map(({ name, color }) => (
              <ColorButtonComponent
                key={name}
                name={name}
                color={color}
                isActive={
                  color === 'inherit'
                    ? !currentColor
                    : currentColor?.toLowerCase() === color.toLowerCase()
                }
                onClick={() => handleSetColor(color)}
              />
            ))}
          </ColorGrid>

          <SeparatorStyled />

          <SectionTitle>Background</SectionTitle>
          <ColorGrid>
            {HIGHLIGHT_COLORS.map(({ name, color }) => (
              <ColorButtonComponent
                key={name}
                name={name}
                color={color}
                isActive={
                  color === 'transparent'
                    ? !currentHighlight
                    : currentHighlight?.toLowerCase() === color.toLowerCase()
                }
                onClick={() => handleSetHighlight(color)}
                isHighlight
              />
            ))}
          </ColorGrid>
        </PopoverContent>
      </div>
    </Popover.Root>
  );
};