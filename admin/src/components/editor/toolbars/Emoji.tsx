import { forwardRef, useState, useEffect, useMemo, useRef } from "react";
import {
  Activity,
  Car,
  Cat,
  Clock,
  Coffee,
  Flag,
  Hash,
  Lightbulb,
  Search,
  Smile,
} from "../icons";
import { useEditorContext } from "../partials/EditorProvider";
import ToolbarButton, { ToolbarButtonProps } from "../partials/ToolbarButton";
import { Popover } from "@strapi/design-system";
import styled from "styled-components";
import { gitHubEmojis } from "@tiptap/extension-emoji";

// Styled Components
const EmojiIcon = styled(Smile)`
  width: 16px;
  height: 16px;
`;

const PopoverContent = styled(Popover.Content)`
  padding: 0;
  background: ${({ theme }) => theme.colors.neutral0};
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  box-shadow: ${({ theme }) => theme.shadows.filterShadow};
  border-radius: 4px;
  width: 320px;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const SearchContainer = styled.div`
  padding: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral200};
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: ${({ theme }) => theme.colors.neutral0};
`;

const SearchIcon = styled(Search)`
  width: 14px;
  height: 14px;
  color: ${({ theme }) => theme.colors.neutral500};
`;

const SearchInput = styled.input`
  border: none;
  background: none;
  outline: none;
  width: 100%;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.neutral800};

  &::placeholder {
    color: ${({ theme }) => theme.colors.neutral500};
  }
`;

const ScrollContainer = styled.div`
  max-height: 280px;
  height: 280px;
  overflow-y: auto;
  padding: 12px;
  scroll-behavior: smooth;
`;

const EmojiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 4px;
  margin-bottom: 12px;
`;

const EmojiItem = styled.button`
  border: none;
  background: none;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral100};
  }
`;

const TabBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral200};
  background-color: ${({ theme }) => theme.colors.neutral100};
`;

const TabButton = styled.button<{ $isActive: boolean }>`
  border: none;
  background: none;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  color: ${({ theme, $isActive }) =>
        $isActive ? theme.colors.primary600 : theme.colors.neutral500};
  background-color: ${({ theme, $isActive }) =>
        $isActive ? theme.colors.primary100 : 'transparent'};

  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral200};
    color: ${({ theme }) => theme.colors.neutral700};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const SectionTitle = styled.div`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.neutral500};
  margin-bottom: 4px;
  margin-top: 4px;
`;

type Category = 'recent' | 'smileys' | 'nature' | 'food' | 'activity' | 'travel' | 'objects' | 'symbols' | 'flags';

const CATEGORIES: { id: Category; icon: any; title: string, tags: string[] }[] = [
    { id: 'recent', icon: Clock, title: 'Recent', tags: [] },
    { id: 'smileys', icon: Smile, title: 'Smileys & People', tags: ['face', 'smile', 'person', 'joy', 'happy', 'sad', 'mad', 'hand', 'body'] },
    { id: 'nature', icon: Cat, title: 'Animals & Nature', tags: ['animal', 'nature', 'cat', 'dog', 'plant', 'flower', 'weather'] },
    { id: 'food', icon: Coffee, title: 'Food & Drink', tags: ['food', 'drink', 'fruit', 'vegetable', 'meal'] },
    { id: 'activity', icon: Activity, title: 'Activity', tags: ['activity', 'sport', 'game', 'play'] },
    { id: 'travel', icon: Car, title: 'Travel & Places', tags: ['travel', 'place', 'car', 'vehicle', 'building', 'map'] },
    { id: 'objects', icon: Lightbulb, title: 'Objects', tags: ['object', 'tool', 'computer', 'device', 'light'] },
    { id: 'symbols', icon: Hash, title: 'Symbols', tags: ['symbol', 'shape', 'sign', 'arrow'] },
    { id: 'flags', icon: Flag, title: 'Flags', tags: ['flag'] },
];

const EmojiToolbar = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
    ({ className, onClick, children, ...props }, ref) => {
        const { editor } = useEditorContext();
        const [open, setOpen] = useState(false);
        const [activeCategory, setActiveCategory] = useState<Category>('recent');
        const [recent, setRecent] = useState<string[]>([]);
        const [searchQuery, setSearchQuery] = useState("");
        const searchInputRef = useRef<HTMLInputElement>(null);
        const scrollRef = useRef<HTMLDivElement>(null);

        // Initialize Recent
        useEffect(() => {
            const stored = localStorage.getItem("tiptap-recent-emojis");
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    setRecent(parsed);
                    if (parsed.length === 0) {
                        setActiveCategory('smileys');
                    }
                } catch (e) {
                    console.error("Failed to parse recent emojis", e);
                    setActiveCategory('smileys');
                }
            } else {
                setActiveCategory('smileys');
            }
        }, []);

        // Focus search on open
        useEffect(() => {
            if (open) {
                setTimeout(() => {
                    searchInputRef.current?.focus();
                }, 100);
            } else {
                setSearchQuery("");
            }
        }, [open]);

        const handleEmojiSelect = (emoji: any) => {
            editor.chain().focus().setEmoji(emoji.name).run();

            const newRecent = [emoji.name, ...recent.filter((n) => n !== emoji.name)].slice(0, 24);
            setRecent(newRecent);
            localStorage.setItem("tiptap-recent-emojis", JSON.stringify(newRecent));

            setOpen(false);
        };

        const scrollToCategory = (catId: Category) => {
            setActiveCategory(catId);
            const element = document.getElementById(`emoji-category-${catId}`);
            if (element && scrollRef.current) {
                scrollRef.current.scrollTop = element.offsetTop - scrollRef.current.offsetTop - 10;
            }
        };

        // Prepare all data once (or memoized)
        const categorizedEmojis = useMemo(() => {
            const groups: Record<string, any[]> = {};

            // Recent
            groups['recent'] = recent
                .map((name) => gitHubEmojis.find((e) => e.name === name))
                .filter(Boolean);

            // Other categories
            CATEGORIES.slice(1).forEach(cat => {
                groups[cat.id] = gitHubEmojis.filter(emoji =>
                    emoji.tags.some(tag => cat.tags.some(catTag => tag.includes(catTag)))
                ).slice(0, 100);
            });

            return groups;

        }, [recent]);


        const searchResults = useMemo(() => {
            if (!searchQuery.trim()) return [];
            const query = searchQuery.toLowerCase();
            return gitHubEmojis.filter(e =>
                e.name.toLowerCase().includes(query) ||
                e.shortcodes.some(s => s.includes(query)) ||
                e.tags.some(t => t.includes(query))
            ).slice(0, 100);
        }, [searchQuery]);

        return (
            <Popover.Root open={open} onOpenChange={setOpen}>
                <Popover.Trigger>
                    <ToolbarButton
                        tooltip="Insert Emoji"
                        aria-label="Insert emoji"
                        ref={ref}
                        isActive={open}
                        {...props}
                    >
                        {children || <EmojiIcon />}
                    </ToolbarButton>
                </Popover.Trigger>
                <PopoverContent align="start" sideOffset={4}>
                    <TabBar>
                        {CATEGORIES.map((cat) => {
                            const Icon = cat.icon;
                            return (
                                <TabButton
                                    key={cat.id}
                                    $isActive={activeCategory === cat.id && !searchQuery}
                                    onClick={() => scrollToCategory(cat.id)}
                                    title={cat.title}
                                    type="button"
                                >
                                    <Icon />
                                </TabButton>
                            );
                        })}
                    </TabBar>

                    <SearchContainer>
                        <SearchIcon />
                        <SearchInput
                            ref={searchInputRef}
                            placeholder="Search emojis..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </SearchContainer>

                    <ScrollContainer ref={scrollRef}>
                        {searchQuery ? (
                            <>
                                {searchResults.length > 0 ? (
                                    <EmojiGrid>
                                        {searchResults.map((item: any) => (
                                            <EmojiItem
                                                key={item.name}
                                                onClick={() => handleEmojiSelect(item)}
                                                title={item.name}
                                                type="button"
                                            >
                                                {item.emoji}
                                            </EmojiItem>
                                        ))}
                                    </EmojiGrid>
                                ) : (
                                    <div style={{ textAlign: 'center', color: '#666', fontSize: '13px', paddingTop: '20px' }}>No results found</div>
                                )}
                            </>
                        ) : (
                            <>
                                {CATEGORIES.map(cat => {
                                    const emojis = categorizedEmojis[cat.id];
                                    if (!emojis || emojis.length === 0) return null;

                                    return (
                                        <div key={cat.id} id={`emoji-category-${cat.id}`}>
                                            <SectionTitle>{cat.title}</SectionTitle>
                                            <EmojiGrid>
                                                {emojis.map((item: any) => (
                                                    <EmojiItem
                                                        key={item.name}
                                                        onClick={() => handleEmojiSelect(item)}
                                                        title={item.name}
                                                        type="button"
                                                    >
                                                        {item.emoji}
                                                    </EmojiItem>
                                                ))}
                                            </EmojiGrid>
                                        </div>
                                    );
                                })}
                            </>
                        )}
                    </ScrollContainer>
                </PopoverContent>
            </Popover.Root>
        );
    }
);

EmojiToolbar.displayName = "EmojiToolbar";

export { EmojiToolbar };
