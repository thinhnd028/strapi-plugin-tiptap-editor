import {
    List,
    ListOrdered,
    ListTodo,
    Check,
    ChevronDown,
} from "lucide-react";
import styled from "styled-components";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { useEditorContext } from "../partials/EditorProvider";
import ToolbarButton from "../partials/ToolbarButton";

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

export const ListsToolbar = () => {
    const { editor } = useEditorContext();

    const items = [
        {
            action: () => editor.commands.toggleBulletList(),
            isActive: () => editor.isActive("bulletList"),
            disabled: !editor.can().toggleBulletList(),
            title: "Bullet List",
            icon: <List />,
        },
        {
            action: () => editor.commands.toggleOrderedList(),
            isActive: () => editor.isActive("orderedList"),
            disabled: !editor.can().toggleOrderedList(),
            title: "Ordered List",
            icon: <ListOrdered />,
        },
        {
            action: () => editor.commands.toggleTaskList(),
            isActive: () => editor.isActive("taskList"),
            disabled: !editor.can().toggleTaskList(),
            title: "Task List",
            icon: <ListTodo />,
        },
    ];

    const isDisabled = items.every((item) => item.disabled);
    const activeItem = items.find((item) => item.isActive());

    return (
        <DropdownMenu>
            <DropdownMenuTrigger disabled={isDisabled} asChild>
                <ToolbarButton
                    tooltip="Lists"
                    aria-label="Lists"
                    disabled={isDisabled}
                    isActive={!!activeItem}
                    hasArrow
                >
                    <IconWrapper>
                        {activeItem ? activeItem.icon : <List size={16} />}
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
