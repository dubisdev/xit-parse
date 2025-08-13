import { describe, it, expect } from "bun:test";
import { TaskItemTagValue } from "../../src/domain";

describe("TaskItemTagValue", () => {
    describe("TaskItemTag Value detection", () => {
        it("Should detect valid values", () => {
            const TAG_VALUE_CASES = [
                { content: "value", expected: "value" },
                { content: "v-a-l-u-e", expected: "v-a-l-u-e" },
                { content: "日本", expected: "日本" },
                { content: null, expected: null },
                { content: '""', expected: "" }, // Empty double quoted value
                { content: "''", expected: "" }, // Empty single quoted value
                { content: '"v a l u e"', expected: "v a l u e" },
                { content: "'v!a.l?u+e'", expected: "v!a.l?u+e" },
                { content: "'foo'bar", expected: "foo" },
                { content: "'foo'-bar", expected: "foo" },
                { content: "'foo'!!", expected: "foo" },
            ]

            TAG_VALUE_CASES.forEach(({ content, expected }) => {
                const tag = new TaskItemTagValue(content);

                expect(tag.value).toBe(expected);
            });
        });

        it("Should not handle scaping characters", () => {
            const TAG_VALUE_CASES = [
                { content: "'It\\'s great'", expected: "It\\" },
            ]

            TAG_VALUE_CASES.forEach(({ content, expected }) => {
                const tag = new TaskItemTagValue(content);

                expect(tag.value).toBe(expected);
            });
        });

        it("Should not handle unfinished quoted values", () => {
            const TAG_VALUE_CASES = [
                { content: '"v a l u e', expected: null },
                { content: `"v a l u e'`, expected: null },
                { content: `"hello\nWorld!"`, expected: null },
            ]

            TAG_VALUE_CASES.forEach(({ content, expected }) => {
                const tag = new TaskItemTagValue(content);

                expect(tag.value).toBe(expected);
            });
        });
    });
});
