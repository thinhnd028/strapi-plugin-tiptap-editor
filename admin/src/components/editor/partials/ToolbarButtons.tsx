import { Fragment, memo, useMemo, lazy, Suspense } from "react";
import { Separator } from "../../ui/separator";
import styled from "styled-components";

// Styled Components
const FlexGap = styled.div`
  flex-grow: 1;
  min-width: 16px; /* optional */
`;

const StyledSeparator = styled(Separator)`
  height: 24px;
`;

// Lazy imports for toolbars (tanpa next/dynamic)
const ToolbarDefinitions = {
  // === GRUP 1: HEADING & TEXT STYLE ===
  heading: lazy(() =>
    import("../toolbars/Heading").then((mod) => ({
      default: mod.HeadingToolbar,
    }))
  ),
  bold: lazy(() =>
    import("../toolbars/Bold").then((mod) => ({
      default: mod.BoldToolbar,
    }))
  ),
  italic: lazy(() =>
    import("../toolbars/Italic").then((mod) => ({
      default: mod.ItalicToolbar,
    }))
  ),
  strikethrough: lazy(() =>
    import("../toolbars/Strikethrough").then((mod) => ({
      default: mod.StrikeThroughToolbar,
    }))
  ),

  // === GRUP 2: LISTS & INDENTATION ===
  lists: lazy(() =>
    import("../toolbars/Lists").then((mod) => ({
      default: mod.ListsToolbar,
    }))
  ),
  blockquote: lazy(() =>
    import("../toolbars/Blockquote").then((mod) => ({
      default: mod.BlockquoteToolbar,
    }))
  ),

  // === GRUP 3: ALIGNMENT & FORMATTING ===
  alignment: lazy(() =>
    import("../toolbars/Alignment").then((mod) => ({
      default: mod.AlignmentToolbar,
    }))
  ),
  horizontalRule: lazy(() =>
    import("../toolbars/HorizontalRule").then((mod) => ({
      default: mod.HorizontalRuleToolbar,
    }))
  ),
  hardBreak: lazy(() =>
    import("../toolbars/HardBreak").then((mod) => ({
      default: mod.HardBreakToolbar,
    }))
  ),
  color: lazy(() =>
    import("../toolbars/ColorAndHighlight").then((mod) => ({
      default: mod.ColorAndHighlightToolbar,
    }))
  ),

  // === GRUP 4: MEDIA & LINKS ===
  link: lazy(() =>
    import("../toolbars/Link").then((mod) => ({
      default: mod.LinkToolbar,
    }))
  ),
  image: lazy(() =>
    import("../toolbars/ImagePlaceholder").then((mod) => ({
      default: mod.ImagePlaceholderToolbar,
    }))
  ),
  emoji: lazy(() =>
    import("../toolbars/Emoji").then((mod) => ({
      default: mod.EmojiToolbar,
    }))
  ),
  table: lazy(() =>
    import("../toolbars/Table").then((mod) => ({
      default: mod.TableToolbar,
    }))
  ),
  iframe: lazy(() =>
    import("../toolbars/Iframe").then((mod) => ({
      default: mod.IframeToolbar,
    }))
  ),

  // === GRUP 5: UTILS ===
  undo: lazy(() =>
    import("../toolbars/Undo").then((mod) => ({
      default: mod.UndoToolbar,
    }))
  ),
  redo: lazy(() =>
    import("../toolbars/Redo").then((mod) => ({
      default: mod.RedoToolbar,
    }))
  ),
  searchAndReplace: lazy(() =>
    import("../toolbars/SearchAndReplace").then((mod) => ({
      default: mod.SearchAndReplaceToolbar,
    }))
  ),
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
          <Suspense fallback={null} key={index}>
            <c.Component {...c.props} />
          </Suspense>
        ))}
      </Fragment>
    );
  },
);

ToolbarButtons.displayName = "ToolbarButtons";

export { ToolbarButtons };