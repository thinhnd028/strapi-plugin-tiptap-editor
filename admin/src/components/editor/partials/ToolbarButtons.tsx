import { Fragment, memo, useMemo } from "react";
import { Separator } from "../../ui/separator";
import styled from "styled-components";

import { HeadingToolbar } from "../toolbars/Heading";
import { BoldToolbar } from "../toolbars/Bold";
import { ItalicToolbar } from "../toolbars/Italic";
import { StrikeThroughToolbar } from "../toolbars/Strikethrough";
import { ListsToolbar } from "../toolbars/Lists";
import { BlockquoteToolbar } from "../toolbars/Blockquote";
import { AlignmentToolbar } from "../toolbars/Alignment";
import { HorizontalRuleToolbar } from "../toolbars/HorizontalRule";
import { HardBreakToolbar } from "../toolbars/HardBreak";
import { ColorAndHighlightToolbar } from "../toolbars/ColorAndHighlight";
import { LinkToolbar } from "../toolbars/Link";
import { ImageToolbar } from "../toolbars/Image";
import { EmojiToolbar } from "../toolbars/Emoji";
import { TableToolbar } from "../toolbars/Table";
import { IframeToolbar } from "../toolbars/Iframe";
import { UndoToolbar } from "../toolbars/Undo";
import { RedoToolbar } from "../toolbars/Redo";
import { SearchAndReplaceToolbar } from "../toolbars/SearchAndReplace";

// Styled Components
const FlexGap = styled.div`
  flex-grow: 1;
  min-width: 16px; /* optional */
`;

const StyledSeparator = styled(Separator)`
  height: 24px;
`;

// Static imports to avoid "Failed to fetch dynamically imported module" errors
// that occur when plugin chunks are served from incorrect paths after deployment
const ToolbarDefinitions = {
  heading: HeadingToolbar,
  bold: BoldToolbar,
  italic: ItalicToolbar,
  strikethrough: StrikeThroughToolbar,
  lists: ListsToolbar,
  blockquote: BlockquoteToolbar,
  alignment: AlignmentToolbar,
  horizontalRule: HorizontalRuleToolbar,
  hardBreak: HardBreakToolbar,
  color: ColorAndHighlightToolbar,
  link: LinkToolbar,
  image: ImageToolbar,
  emoji: EmojiToolbar,
  table: TableToolbar,
  iframe: IframeToolbar,
  undo: UndoToolbar,
  redo: RedoToolbar,
  searchAndReplace: SearchAndReplaceToolbar,
};

export type ToolbarButtonsType =
  | keyof typeof ToolbarDefinitions
  | "Separator"
  | "FlexGap";

const ToolbarButtons: React.FC<{ toolbars?: ToolbarButtonsType[] }> = memo(
  ({
    toolbars = [
      "undo",
      "redo",
      "Separator",
      "bold",
      "italic",
      "strikethrough",
      "link",
      "color",
      "hardBreak",
    ],
  }) => {
    const Components = useMemo<
      { Component: React.ComponentType<any>; props: Record<string, any> }[]
    >(
      () =>
        toolbars.map((toolbar) => {
          if (toolbar === "Separator") {
            return {
              Component: StyledSeparator,
              props: { orientation: "vertical" },
            };
          }

          if (toolbar === "FlexGap") {
            return {
              Component: FlexGap,
              props: {},
            };
          }

          return {
            Component:
              ToolbarDefinitions[toolbar as keyof typeof ToolbarDefinitions] || Fragment,
            props: {},
          };
        }),
      [toolbars],
    );

    return (
      <Fragment>
        {Components.map((c, index) => (
          <c.Component key={index} {...c.props} />
        ))}
      </Fragment>
    );
  },
);

ToolbarButtons.displayName = "ToolbarButtons";

export { ToolbarButtons };