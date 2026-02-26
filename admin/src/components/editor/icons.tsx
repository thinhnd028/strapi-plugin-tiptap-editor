/**
 * Inline SVG icons extracted from Lucide (MIT/ISC license).
 * Replaces lucide-react dependency.
 */
import type { SVGProps } from "react";

const defaultProps: Partial<SVGProps<SVGSVGElement>> = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export interface IconProps extends Partial<SVGProps<SVGSVGElement>> {
  size?: number;
}

function createIcon(inner: string) {
  return (props: IconProps) => {
    const { size = 24, ...rest } = props;
    return (
      <svg
        {...defaultProps}
        width={size}
        height={size}
        {...rest}
        dangerouslySetInnerHTML={{ __html: inner }}
      />
    );
  };
}

export const Activity = createIcon(
  '<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path>'
);
export const AlignCenter = createIcon(
  '<path d="M17 12H7"></path><path d="M19 18H5"></path><path d="M21 6H3"></path>'
);
export const AlignJustify = createIcon(
  '<path d="M3 12h18"></path><path d="M3 18h18"></path><path d="M3 6h18"></path>'
);
export const AlignLeft = createIcon(
  '<path d="M15 12H3"></path><path d="M17 18H3"></path><path d="M21 6H3"></path>'
);
export const AlignRight = createIcon(
  '<path d="M21 12H9"></path><path d="M21 18H7"></path><path d="M21 6H3"></path>'
);
export const ArrowDown = createIcon(
  '<path d="M12 5v14"></path><path d="m19 12-7 7-7-7"></path>'
);
export const ArrowLeft = createIcon(
  '<path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path>'
);
export const ArrowRight = createIcon(
  '<path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path>'
);
export const ArrowUp = createIcon(
  '<path d="m5 12 7-7 7 7"></path><path d="M12 19V5"></path>'
);
export const Bold = createIcon(
  '<path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"></path>'
);
export const Captions = createIcon(
  '<rect width="18" height="14" x="3" y="5" rx="2" ry="2"></rect><path d="M7 15h4M15 15h2M7 11h2M13 11h4"></path>'
);
export const Car = createIcon(
  '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><path d="M9 17h6"></path><circle cx="17" cy="17" r="2"></circle>'
);
export const Cat = createIcon(
  '<path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z"></path><path d="M8 14v.5"></path><path d="M16 14v.5"></path><path d="M11.25 16.25h1.5L12 17l-.75-.75Z"></path>'
);
export const Check = createIcon('<path d="M20 6 9 17l-5-5"></path>');
export const ChevronDown = createIcon('<path d="m6 9 6 6 6-6"></path>');
export const Clock = createIcon(
  '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>'
);
export const Coffee = createIcon(
  '<path d="M10 2v2"></path><path d="M14 2v2"></path><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"></path><path d="M6 2v2"></path>'
);
export const Columns3 = createIcon(
  '<rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M9 3v18"></path><path d="M15 3v18"></path>'
);
export const Copy = createIcon(
  '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>'
);
export const Edit3 = createIcon(
  '<path d="M12 20h9"></path><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"></path>'
);
export const ExternalLink = createIcon(
  '<path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>'
);
export const Flag = createIcon(
  '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" x2="4" y1="22" y2="15"></line>'
);
export const Hash = createIcon(
  '<line x1="4" x2="20" y1="9" y2="9"></line><line x1="4" x2="20" y1="15" y2="15"></line><line x1="10" x2="8" y1="3" y2="21"></line><line x1="16" x2="14" y1="3" y2="21"></line>'
);
export const Heading = createIcon(
  '<path d="M6 12h12"></path><path d="M6 20V4"></path><path d="M18 20V4"></path>'
);
export const Heading1 = createIcon(
  '<path d="M4 12h8"></path><path d="M4 18V6"></path><path d="M12 18V6"></path><path d="m17 12 3-2v8"></path>'
);
export const Heading2 = createIcon(
  '<path d="M4 12h8"></path><path d="M4 18V6"></path><path d="M12 18V6"></path><path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1"></path>'
);
export const Heading3 = createIcon(
  '<path d="M4 12h8"></path><path d="M4 18V6"></path><path d="M12 18V6"></path><path d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2"></path><path d="M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2"></path>'
);
export const Heading4 = createIcon(
  '<path d="M12 18V6"></path><path d="M17 10v3a1 1 0 0 0 1 1h3"></path><path d="M21 10v8"></path><path d="M4 12h8"></path><path d="M4 18V6"></path>'
);
export const Heading5 = createIcon(
  '<path d="M4 12h8"></path><path d="M4 18V6"></path><path d="M12 18V6"></path><path d="M17 13v-3h4"></path><path d="M17 17.7c.4.2.8.3 1.3.3 1.5 0 2.7-1.1 2.7-2.5S19.8 13 18.3 13H17"></path>'
);
export const Heading6 = createIcon(
  '<path d="M4 12h8"></path><path d="M4 18V6"></path><path d="M12 18V6"></path><circle cx="19" cy="16" r="2"></circle><path d="M20 10c-2 2-3 3.5-3 6"></path>'
);
export const Highlighter = createIcon(
  '<path d="m9 11-6 6v3h9l3-3"></path><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"></path>'
);
export const Image = createIcon(
  '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>'
);
export const Italic = createIcon(
  '<line x1="19" x2="10" y1="4" y2="4"></line><line x1="14" x2="5" y1="20" y2="20"></line><line x1="15" x2="9" y1="4" y2="20"></line>'
);
export const Link2 = createIcon(
  '<path d="M9 17H7A5 5 0 0 1 7 7h2"></path><path d="M15 7h2a5 5 0 1 1 0 10h-2"></path><line x1="8" x2="16" y1="12" y2="12"></line>'
);
export const Lightbulb = createIcon(
  '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path><path d="M9 18h6"></path><path d="M10 22h4"></path>'
);
export const List = createIcon(
  '<path d="M3 12h.01"></path><path d="M3 18h.01"></path><path d="M3 6h.01"></path><path d="M8 12h13"></path><path d="M8 18h13"></path><path d="M8 6h13"></path>'
);
export const ListOrdered = createIcon(
  '<path d="M10 12h11"></path><path d="M10 18h11"></path><path d="M10 6h11"></path><path d="M4 10h2"></path><path d="M4 6h1v4"></path><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>'
);
export const ListTodo = createIcon(
  '<rect x="3" y="5" width="6" height="6" rx="1"></rect><path d="m3 17 2 2 4-4"></path><path d="M13 6h8"></path><path d="M13 12h8"></path><path d="M13 18h8"></path>'
);
export const Minus = createIcon('<path d="M5 12h14"></path>');
export const Pencil = createIcon(
  '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path><path d="m15 5 4 4"></path>'
);
export const Pilcrow = createIcon(
  '<path d="M13 4v16"></path><path d="M17 4v16"></path><path d="M19 4H9.5a4.5 4.5 0 0 0 0 9H13"></path>'
);
export const Quote = createIcon(
  '<path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path>'
);
export const Repeat = createIcon(
  '<path d="m17 2 4 4-4 4"></path><path d="M3 11v-1a4 4 0 0 1 4-4h14"></path><path d="m7 22-4-4 4-4"></path><path d="M21 13v1a4 4 0 0 1-4 4H3"></path>'
);
export const Redo2 = createIcon(
  '<path d="m15 14 5-5-5-5"></path><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13"></path>'
);
export const Rows3 = createIcon(
  '<rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M21 9H3"></path><path d="M21 15H3"></path>'
);
export const Search = createIcon(
  '<circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path>'
);
export const Smile = createIcon(
  '<circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" x2="9.01" y1="9" y2="9"></line><line x1="15" x2="15.01" y1="9" y2="9"></line>'
);
export const Table = createIcon(
  '<path d="M12 3v18"></path><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M3 9h18"></path><path d="M3 15h18"></path>'
);
export const Table2 = createIcon(
  '<path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"></path>'
);
export const Trash = createIcon(
  '<path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>'
);
export const Trash2 = createIcon(
  '<path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line>'
);
export const Type = createIcon(
  '<polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" x2="15" y1="20" y2="20"></line><line x1="12" x2="12" y1="4" y2="20"></line>'
);
export const Undo2 = createIcon(
  '<path d="M9 14 4 9l5-5"></path><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"></path>'
);
export const Unlink2 = createIcon(
  '<path d="M15 7h2a5 5 0 0 1 0 10h-2m-6 0H7A5 5 0 0 1 7 7h2"></path>'
);
export const WrapText = createIcon(
  '<line x1="3" x2="21" y1="6" y2="6"></line><path d="M3 12h15a3 3 0 1 1 0 6h-4"></path><polyline points="16 16 14 18 16 20"></polyline><line x1="3" x2="10" y1="18" y2="18"></line>'
);
export const X = createIcon(
  '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>'
);
export const Youtube = createIcon(
  '<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path><path d="m10 15 5-3-5-3z"></path>'
);

// Aliased exports for backward compatibility
export const BoldIcon = Bold;
export const ItalicIcon = Italic;
export const HighlighterIcon = Highlighter;
export const LucideImage = Image;
export const SeparatorHorizontal = Minus;
export const TextQuote = Quote;
export const BaselineIcon = Type;
