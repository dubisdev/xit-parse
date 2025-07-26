import { TaskItemStatusValue } from "../../../src/domain";
import { XitDocument, XitDocumentItemType } from "../../../src/types";

export const XitDocTestInput: XitDocument = {
    items: [
        {
            id: "0",
            type: XitDocumentItemType.BLANK_LINE
        },
        {
            id: "1",
            type: XitDocumentItemType.GROUP,
            title: "Test Group",
            items: [
                {
                    id: "1.1",
                    content: "Task 1",
                    rawContent: "[ ] ..! Task 1 #tag1 #tag2 -> 2023-10-01",
                    status: TaskItemStatusValue.OPEN,
                    tags: ["tag1", "tag2"],
                    priority: {
                        number: 3,
                        paddingStart: 2,
                        paddingEnd: 1
                    },
                    dueDate: new Date("2023-10-01")
                },
                {
                    id: "1.2",
                    content: "Task 2",
                    rawContent: "[x] Task 2",
                    status: TaskItemStatusValue.CHECKED
                }
            ]
        },
        {
            id: "2",
            type: XitDocumentItemType.BLANK_LINE
        }
    ]
}

export const XitDocTestOutput = `
Test Group
[ ] ..! Task 1 #tag1 #tag2 -> 2023-10-01
[x] Task 2
`;
