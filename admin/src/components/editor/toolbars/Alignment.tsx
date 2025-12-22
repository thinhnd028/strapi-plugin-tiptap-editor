import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../ui/tooltip";
import { useEditorContext } from "../partials/EditorProvider";
import ToolbarButton, { ToolbarButtonProps } from "../partials/ToolbarButton";
import styled from "styled-components";

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

const CheckIcon = styled(Check)`
  width: 12px;
  height: 12px;
  color: ${props => props.theme.colors.primary500};
`;

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

export const AlignmentToolbar = () => {
  const { editor } = useEditorContext();
  const handleAlign = (value: string) => {
    editor?.chain().focus().setTextAlign(value).run();
  };

  const isDisabled =
    (editor?.isActive("image") || editor?.isActive("video") || !editor) ??
    false;

  const currentTextAlign = () => {
    if (editor?.isActive({ textAlign: "left" })) {
      return "left";
    }
    if (editor?.isActive({ textAlign: "center" })) {
      return "center";
    }
    if (editor?.isActive({ textAlign: "right" })) {
      return "right";
    }
    if (editor?.isActive({ textAlign: "justify" })) {
      return "justify";
    }

    return "left";
  };

  const alignmentOptions = [
    {
      name: "Left Align",
      value: "left",
      icon: <AlignLeft />,
    },
    {
      name: "Center Align",
      value: "center",
      icon: <AlignCenter />,
    },
    {
      name: "Right Align",
      value: "right",
      icon: <AlignRight />,
    },
    {
      name: "Justify Align",
      value: "justify",
      icon: <AlignJustify />,
    },
  ];

  const findIndex = (value: string) => {
    return alignmentOptions.findIndex((option) => option.value === value);
  };

  const currentAlignment = currentTextAlign();
  const currentOption = alignmentOptions[findIndex(currentAlignment)];

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger disabled={isDisabled} asChild>
            <ToolbarButton
              aria-label="Text Alignment"
              disabled={isDisabled}
              hasArrow
            >
              {currentOption.icon && <currentOption.icon.type size={16} />}
            </ToolbarButton>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <StyledTooltipContent>Text Alignment</StyledTooltipContent>
      </Tooltip>
      <DropdownMenuContent
        align="start"
        loop
        onCloseAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <DropdownMenuGroup>
          {alignmentOptions.map((option, index) => (
            <DropdownMenuItemStyled
              key={index}
              onSelect={() => handleAlign(option.value)}
            >
              <div style={{ width: 12, height: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {option.value === currentAlignment && <CheckIcon />}
              </div>
              <IconWrapper>
                {option.icon}
              </IconWrapper>
              {option.name}
            </DropdownMenuItemStyled>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};