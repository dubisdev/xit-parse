import { describe, it, expect } from "bun:test";
import { TaskItemTag } from "../../src/domain";

describe("TaskItemTag", () => {
    describe("tag name", () => {
        it("should create a TaskItemTag with valid Names", () => {
            const VALID_TAGS = [
                { content: "#tag", name: "tag", value: null },
                { content: "#T-A-G", name: "T-A-G", value: null },
                { content: "#--tag--", name: "--tag--", value: null },
                { content: "#__tag__", name: "__tag__", value: null },
                { content: "#t_a_g", name: "t_a_g", value: null },
                { content: "#123", name: "123", value: null },
                { content: "#___", name: "___", value: null },
                { content: "#---", name: "---", value: null },
                { content: "#1t2a3g", name: "1t2a3g", value: null },
                { content: "#täg", name: "täg", value: null },
                { content: "#今日は", name: "今日は", value: null },
                { content: "#გამარჯობა", name: "გამარჯობა", value: null },
            ]

            VALID_TAGS.forEach(({ content, name, value }) => {
                const tag = new TaskItemTag(content);

                expect(tag.name).toBe(name);
                expect(tag.value).toBe(value);

                if (!tag.hasValue()) {
                    expect(tag.value).toBe(null);
                }
            });
        });

        it("should throw an error when no tag names", () => {
            const INVALID_TAGS = [
                "#",
                "#=value",
                `#="value"`,
            ];

            INVALID_TAGS.forEach(tagContent => {
                expect(() => new TaskItemTag(tagContent)).toThrow(
                    `Invalid tag name: #. A tag name must start with a hastag and consist of letters, digits, hyphens, or underscores.`
                );
            });

        })
    });

   
});
