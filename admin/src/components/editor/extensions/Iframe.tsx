import { Node, NodeViewProps } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { useState } from "react";
import styled from "styled-components";
import { Edit3, Trash } from "lucide-react";
import { Button } from "../../ui/button";

function normalizeYoutubeToEmbed(raw: string): string {
  const input = (raw ?? "").trim();
  if (!input) return input;

  // If it's already an embed URL, keep as-is.
  if (/^https?:\/\/(www\.)?youtube\.com\/embed\//i.test(input)) {
    return input;
  }

  // Only attempt parsing for absolute URLs.
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    return input;
  }

  const host = url.hostname.replace(/^www\./i, "").toLowerCase();
  const isYoutubeHost = host === "youtube.com" || host === "m.youtube.com";
  const isYoutuBeHost = host === "youtu.be";
  if (!isYoutubeHost && !isYoutuBeHost) return input;

  let videoId: string | null = null;

  if (isYoutuBeHost) {
    // https://youtu.be/<id>
    videoId = url.pathname.split("/").filter(Boolean)[0] ?? null;
  } else {
    // youtube.com patterns
    const pathname = url.pathname;
    if (pathname === "/watch") {
      videoId = url.searchParams.get("v");
    } else if (pathname.startsWith("/shorts/")) {
      videoId = pathname.split("/").filter(Boolean)[1] ?? null;
    } else if (pathname.startsWith("/live/")) {
      videoId = pathname.split("/").filter(Boolean)[1] ?? null;
    } else if (pathname.startsWith("/embed/")) {
      videoId = pathname.split("/").filter(Boolean)[1] ?? null;
    }
  }

  if (!videoId) return input;

  // Preserve some common params that make sense on embed.
  const embed = new URL(`https://www.youtube.com/embed/${videoId}`);
  const list = url.searchParams.get("list");
  const start = url.searchParams.get("start") ?? url.searchParams.get("t");
  if (list) embed.searchParams.set("list", list);
  if (start) {
    // Convert t=1m30s to seconds if possible; otherwise pass through.
    const seconds = parseYoutubeTimeToSeconds(start);
    embed.searchParams.set("start", seconds != null ? String(seconds) : start);
  }

  return embed.toString();
}

function parseYoutubeTimeToSeconds(value: string): number | null {
  const v = (value ?? "").trim();
  if (!v) return null;
  if (/^\d+$/.test(v)) return Number(v);

  // 1h2m3s / 90s / 3m
  const match = v.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/i);
  if (!match) return null;
  const [, h, m, s] = match;
  const hours = h ? Number(h) : 0;
  const minutes = m ? Number(m) : 0;
  const seconds = s ? Number(s) : 0;
  const total = hours * 3600 + minutes * 60 + seconds;
  return Number.isFinite(total) && total > 0 ? total : null;
}

export interface IframeOptions {
  allowFullscreen: boolean;
  HTMLAttributes: {
    [key: string]: any;
  };
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    iframe: {
      /**
       * Add an iframe
       */
      setIframe: (options: {
        src: string
        width?: string | number;
        height?: string | number;
        allowfullscreen?: boolean;
        frameborder?: number;
      }) => ReturnType;
    };
  }
}

export const Iframe = Node.create<IframeOptions>({
  name: "iframe",

  group: "block",

  atom: true,

  addOptions() {
    return {
      allowFullscreen: true,
      HTMLAttributes: {
        class: "iframe-wrapper",
      },
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      frameborder: {
        default: 0,
      },
      allowfullscreen: {
        default: this.options.allowFullscreen,
        parseHTML: () => this.options.allowFullscreen,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "iframe",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", this.options.HTMLAttributes, ["iframe", {
      ...HTMLAttributes,
      allow:
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
      allowfullscreen: HTMLAttributes.allowfullscreen ?? true,
      referrerpolicy: "strict-origin-when-cross-origin"
    }]];
  },

  addCommands() {
    return {
      setIframe:
        (options: { src: string }) =>
          ({ tr, dispatch }) => {
            const { selection } = tr;
            const node = this.type.create({
              ...options,
              src: normalizeYoutubeToEmbed(options.src),
            });

            if (dispatch) {
              tr.replaceRangeWith(selection.from, selection.to, node);
            }

            return true;
          },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(TiptapIframeComponent);
  },
});

// === React component untuk iframe node ===
function TiptapIframeComponent({ node, selected, deleteNode, updateAttributes }: NodeViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempSrc, setTempSrc] = useState(node.attrs.src || "");

  const handleSave = () => {
    updateAttributes({ src: normalizeYoutubeToEmbed(tempSrc) });
    setIsEditing(false);
  };

  return (
    <IframeWrapper $selected={selected}>
      <div className="iframe-toolbar">
        {isEditing ? (
          <>
            <input
              value={tempSrc}
              onChange={(e) => setTempSrc(e.target.value)}
              placeholder="https://www.youtube.com/embed/..."
            />
            <Button onClick={handleSave} size="sm">Save</Button>
          </>
        ) : (
          <>
            <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)}>
              <Edit3 size={14} />
            </Button>
            <Button size="icon" variant="ghost" onClick={deleteNode}>
              <Trash size={14} />
            </Button>
          </>
        )}
      </div>

      {node.attrs.src ? (
        <iframe
          src={node.attrs.src}
          width={node.attrs.width}
          height={node.attrs.height}
          title={node.attrs.title}
          allowFullScreen={node.attrs.allowfullscreen}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <Placeholder>Click edit to set iframe URL</Placeholder>
      )}
    </IframeWrapper>
  );
}

// === Styled Components ===
const IframeWrapper = styled(NodeViewWrapper) <{ $selected?: boolean }>`
  position: relative;
  border: 2px solid ${(p) => (p.$selected ? "#4f46e5" : "transparent")};
  border-radius: 0;
  overflow: hidden;
  background: #f8f8f8;
  padding: 0;
  margin: 1em 0;

  .iframe-toolbar {
    position: absolute;
    top: 4px;
    right: 4px;
    display: flex;
    gap: 4px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 4px;
    z-index: 2;
  }

  iframe {
    display: block;
    width: 100%;
    min-height: 300px;
    border: none;
  }

  input {
    width: 240px;
    padding: 4px 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
`;

const Placeholder = styled.div`
  width: 100%;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-style: italic;
  background: #fafafa;
`;

