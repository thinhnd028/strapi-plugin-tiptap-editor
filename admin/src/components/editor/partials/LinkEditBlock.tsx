import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styled from "styled-components";

export interface LinkEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultUrl?: string;
  defaultText?: string;
  defaultIsNewTab?: boolean;
  onSave: (url: string, text?: string, isNewTab?: boolean) => void;
}

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
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

export const LinkEditBlock = forwardRef<HTMLDivElement, LinkEditorProps>(
  ({ onSave, defaultIsNewTab, defaultUrl, defaultText, ...props }, ref) => {
    const formRef = useRef<HTMLDivElement>(null);
    const [url, setUrl] = useState(defaultUrl || "");
    const [text, setText] = useState(defaultText || "");
    const [isNewTab, setIsNewTab] = useState(defaultIsNewTab || false);

    // Handler to prevent event bubbling
    const handleInputMouseDown = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
    }, []);

    const handleInputClick = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
    }, []);

    const handleSave = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        onSave(url, text, isNewTab);
      },
      [onSave, url, text, isNewTab],
    );

    useImperativeHandle(ref, () => formRef.current as HTMLDivElement);

    return (
      <div ref={formRef} {...props}>
        <Container>
          <FormGroup>
            <Label>URL</Label>
            <Input
              type="url"
              required
              placeholder="Enter URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onMouseDown={handleInputMouseDown}
              onClick={handleInputClick}
            />

            <Label>Display Text (optional)</Label>
            <Input
              type="text"
              placeholder="Enter display text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onMouseDown={handleInputMouseDown}
              onClick={handleInputClick}
            />

            <label style={{ fontSize: "13px", display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={isNewTab}
                onChange={(e) => setIsNewTab(e.target.checked)}
                style={{ marginRight: "6px" }}
                onMouseDown={handleInputMouseDown}
                onClick={handleInputClick}
              />
              Open in New Tab
            </label>

            <ButtonRow>
              <SmallButton
                type="button"
                variant="primary"
                onClick={handleSave}
                onMouseDown={handleInputMouseDown}
              >
                Save
              </SmallButton>
            </ButtonRow>
          </FormGroup>
        </Container>
      </div>
    );
  },
);

LinkEditBlock.displayName = "LinkEditBlock";

export default LinkEditBlock;