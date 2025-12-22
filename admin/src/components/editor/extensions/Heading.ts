import Heading, { type HeadingOptions } from "@tiptap/extension-heading";

export const CustomHeading = Heading.extend<HeadingOptions>({
    addAttributes() {
        return {
            ...this.parent?.(),
            class: {
                default: null,
                parseHTML: (element) => element.getAttribute("class"),
                renderHTML: (attributes) => {
                    if (!attributes.class) {
                        return {};
                    }
                    return {
                        class: attributes.class,
                    };
                },
            },
        };
    },
});
