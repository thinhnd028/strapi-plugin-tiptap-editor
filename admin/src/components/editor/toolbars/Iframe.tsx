import { Popover, Grid } from "@strapi/design-system";
import { Youtube } from "../icons";
import { forwardRef, useCallback, useState } from "react";
import { Typography } from "@strapi/design-system";
import styled from "styled-components";
import { useEditorContext } from "../partials/EditorProvider";
import ToolbarButton, { ToolbarButtonProps } from "../partials/ToolbarButton";

// Styled Components
const IframeIcon = styled(Youtube)`
  width: 20px;
  height: 20px;
`;

const PopoverContent = styled(Popover.Content)`
  width: 100%;
  min-width: 360px;
  padding: 12px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 6px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.neutral700};
`;

const Input = styled.input`
  border: 1px solid ${(props) => props.theme.colors.neutral200};
  border-radius: 4px;
  padding: 6px 8px;
  font-size: 14px;
  width: 100%;
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary500};
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
  gap: 8px;
`;

const SmallButton = styled.button<{ variant?: "primary" | "ghost" }>`
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  border: none;
  background-color: ${({ variant, theme }) =>
    variant === "primary"
      ? theme.colors.primary600
      : theme.colors.neutral100};
  color: ${({ variant, theme }) =>
    variant === "primary"
      ? theme.colors.neutral0
      : theme.colors.neutral700};

  &:hover {
    opacity: 0.9;
  }
`;

export const IframeToolbar = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useEditorContext();
    const [open, setOpen] = useState(false);
    const [src, setSrc] = useState("");
    const [width, setWidth] = useState("560");
    const [height, setHeight] = useState("315");
    const [allowFullscreen, setAllowFullscreen] = useState(true);
    const [error, setError] = useState("");

    const onInsertIframe = useCallback(() => {
      if (!src) {
        setError("Please enter a URL");
        return;
      }

      try {
        new URL(src);
      } catch (e) {
        setError("Invalid URL format.");
        return;
      }

      editor
        ?.chain()
        .focus()
        .setIframe({
          src,
          width,
          height,
          allowfullscreen: allowFullscreen,
          frameborder: 0,
        })
        .run();
      setOpen(false);
      setSrc("");
      setError("");
    }, [editor, src, width, height, allowFullscreen]);

    return (
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger>
          <ToolbarButton
            tooltip="Insert Iframe"
            aria-label="Insert Iframe"
            isActive={editor?.isActive("iframe")}
            {...props}
            ref={ref}
          >
            <IframeIcon />
          </ToolbarButton>
        </Popover.Trigger>

        <PopoverContent align="start" side="bottom">
          <FormGroup>
            <Label>Iframe Source (URL)</Label>
            <Input
              type="url"
              placeholder="https://www.youtube.com/embed/xxxx"
              value={src}
              onChange={(e) => {
                setSrc(e.target.value);
                if (error) setError("");
              }}
              style={{ borderColor: error ? "#d02b20" : undefined }}
            />
            {error && (
              <Typography variant="pi" textColor="danger600">
                {error}
              </Typography>
            )}
          </FormGroup>

          <Grid.Root gap={6}>
            <Grid.Item xs={6}>
              <FormGroup>
                <Label>Width (px)</Label>
                <Input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                />
              </FormGroup>
            </Grid.Item>
            <Grid.Item xs={6}>
              <FormGroup>
                <Label>Height (px)</Label>
                <Input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </FormGroup>
            </Grid.Item>
          </Grid.Root>

          <FormGroup>
            <label style={{ fontSize: "13px", display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={allowFullscreen}
                onChange={(e) => setAllowFullscreen(e.target.checked)}
                style={{ marginRight: "6px" }}
              />
              Allow Fullscreen
            </label>
          </FormGroup>

          <ButtonRow>
            <SmallButton onClick={() => setOpen(false)}>Cancel</SmallButton>
            <SmallButton variant="primary" onClick={onInsertIframe}>
              Insert
            </SmallButton>
          </ButtonRow>
        </PopoverContent>
      </Popover.Root>
    );
  },
);

IframeToolbar.displayName = "IframeToolbar";
