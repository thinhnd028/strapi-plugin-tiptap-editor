import styled from "styled-components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
  Check,
  Heading,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6
} from "../icons";
import { useEditorContext } from "../partials/EditorProvider";
import ToolbarButton from "../partials/ToolbarButton";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

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

export const HeadingToolbar = () => {
  const { editor } = useEditorContext();
  const { extensions = [] } = editor.extensionManager ?? [];

  /* 
    Construct the items manually to ensure we have Headings 1-6 and Display 1-6.
    Display headings are implemented as headings with a class `display-{level}`.
  */

  const headingItems = [1, 2, 3, 4, 5, 6].map(level => {
    const Icon = [Heading1, Heading2, Heading3, Heading4, Heading5, Heading6][level - 1];
    return {
      action: () => editor.commands.toggleHeading({ level: level as HeadingLevel }),
      isActive: () => editor.isActive("heading", { level }) && !editor.getAttributes("heading").class,
      disabled: !editor.can().toggleHeading({ level: level as HeadingLevel }),
      title: `Heading ${level}`,
      icon: <Icon />,
      shortcutKeys: ["alt", "mod", `${level}`],
    };
  });

  const displayItems = [1, 2, 3, 4, 5, 6].map(level => {
    return {
      action: () => {
        // If it's already a heading of this level, we just need to ensure the class is set.
        // toggleHeading toggles the NODE. We might want to setAttributes if it's already a heading.
        if (editor.isActive("heading", { level })) {
          const currentClass = editor.getAttributes("heading").class;
          if (currentClass === `display-${level}`) {
            // Toggle off: back to paragraph or default heading?
            // Standard toggle behavior usually goes back to paragraph.
            // Let's stick to toggleHeading which handles the node type.
            editor.commands.toggleHeading({ level: level as HeadingLevel });
          } else {
            // It is a heading of this level, but different class (or no class).
            // Update the attribute.
            editor.chain().focus().updateAttributes("heading", { class: `display-${level}` }).run();
          }
        } else {
          // Not a heading of this level. Set it as such with the class.
          editor.chain().focus().setHeading({ level: level as HeadingLevel }).updateAttributes("heading", { class: `display-${level}` }).run();
        }
      },
      isActive: () => editor.isActive("heading", { level }) && editor.getAttributes("heading").class === `display-${level}`,
      disabled: !editor.can().toggleHeading({ level: level as HeadingLevel }), // Approximation
      title: `Display ${level}`,
      // Visual distinction for Display icons could be different, but for now using Type icon or reusing headings with a distinction
      icon: <span style={{ fontSize: '10px', fontWeight: 'bold' }}>D{level}</span>,
      shortcutKeys: [],
    };
  });

  const items = [
    ...headingItems,
    // ...displayItems,
  ];

  const isDisabled = items.every(item => item.disabled);
  const activeItem = items.find((k: any) => k.isActive());

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={isDisabled} asChild>
        <ToolbarButton
          tooltip="Text Heading"
          aria-label="Text Heading"
          disabled={isDisabled}
          hasArrow
        >
          <IconWrapper>
            {activeItem ? activeItem.icon : <Heading />}
          </IconWrapper>
        </ToolbarButton>
      </DropdownMenuTrigger>
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
};