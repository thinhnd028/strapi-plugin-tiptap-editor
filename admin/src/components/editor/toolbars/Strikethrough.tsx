import { forwardRef } from "react";
import styled from "styled-components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { useEditorContext } from "../partials/EditorProvider";
import ToolbarButton, { ToolbarButtonProps } from "../partials/ToolbarButton";

// Styled Components
const DropdownMenuItemStyled = styled(DropdownMenuItem)`
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 6px 8px 6px 4px;
  font-size: 14px;
  
  &:hover {
    background-color: ${props => props.theme.colors.neutral100};
  }
  
  &:focus {
    background-color: ${props => props.theme.colors.neutral100};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const StrikethroughIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4H9a3 3 0 0 0-2.83 4" />
    <path d="M14 12a4 4 0 0 1 0 8H6" />
    <line x1="4" x2="20" y1="12" y2="12" />
  </svg>
);

const UnderlineIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
    <line x1="4" y1="21" x2="20" y2="21" />
  </svg>
);

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 20px;
  margin-right: 4px;
`;

const StyledTooltipContent = styled(TooltipContent)`
  background-color: ${props => props.theme.colors.neutral800};
  color: ${props => props.theme.colors.neutral0};
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 100;
`;

const StrikeThroughToolbar = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, children, ...props }, ref) => {
    const { editor } = useEditorContext();

    if (!editor) {
      return null;
    }

    const hasUnderline = editor.extensionManager.extensions.some((e) => e.name === "underline");

    const items = [
      ...(hasUnderline
        ? [
            {
              action: () => editor.chain().focus().toggleUnderline().run(),
              isActive: () => editor.isActive("underline"),
              disabled: !editor.can().chain().focus().toggleUnderline().run(),
              title: "Underline",
              icon: <UnderlineIcon />,
              shortcut: "mod+u",
            },
          ]
        : []),
      {
        action: () => editor.chain().focus().toggleStrike().run(),
        isActive: () => editor.isActive("strike"),
        disabled: !editor.can().chain().focus().toggleStrike().run(),
        title: "Strikethrough",
        icon: <StrikethroughIcon />,
        shortcut: "mod+shift+x",
      },
    ];

    const isDisabled = items.every((item) => item.disabled);

    // Choose icon to display on button:
    // If one is active, show it? Or default to Strikethrough (since it's replacing it)?
    // Or maybe show the last used? For simplicity, let's show Strikethrough as it was the original, 
    // OR create a generic "A" icon?
    // User asked to merge them. "Text Formatting" might be better represented by `Strikethrough` for now 
    // as it is the file name. Or we can just use the Strikethrough icon as the trigger like "Lists" uses List icon.
    // Let's stick to Strikethrough icon for the trigger for now, or maybe Underline is more common?
    // Let's use Strikethrough since that's what the button was.
    const activeItem = items.find((item) => item.isActive());

    return (
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger disabled={isDisabled} asChild>
              <ToolbarButton
                aria-label="Text Decoration"
                disabled={isDisabled}
                hasArrow
                isActive={!!activeItem}
                ref={ref}
                {...props}
              >
                <IconWrapper>
                  {activeItem ? activeItem.icon : <StrikethroughIcon />}
                </IconWrapper>
              </ToolbarButton>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <StyledTooltipContent>Text Decoration</StyledTooltipContent>
        </Tooltip>

        <DropdownMenuContent
          align="start"
          loop
          onCloseAutoFocus={(e) => {
            e.preventDefault();
          }}
        >
          <DropdownMenuGroup>
            {items.map((option, index) => (
              <DropdownMenuItemStyled
                onSelect={() => {
                  option.action();
                }}
                key={index}
              >
                <div style={{ width: 12, height: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {option.isActive() && <CheckIcon />}
                </div>
                <IconWrapper>
                  {option.icon}
                </IconWrapper>
                {option.title}
              </DropdownMenuItemStyled>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
);

StrikeThroughToolbar.displayName = "StrikeThroughToolbar";

export { StrikeThroughToolbar };
