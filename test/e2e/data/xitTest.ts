import { TaskItemStatusValue } from "../../../src/domain";
import { XitDocument, XitDocumentItemType } from "../../../src/types";

export const XitDocTestInput: XitDocument = {
    groups: [
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
                        padding: 2,
                        paddingPosition: "start"
                    },
                    dueDate: {
                        textDue: "2023-10-01",
                        date: new Date("2023-10-01")
                    }
                },
                {
                    id: "1.2",
                    content: "Task 2",
                    rawContent: "[x] Task 2",
                    status: TaskItemStatusValue.CHECKED
                }
            ]
        },
    ]
}

export const XitDocTestOutput = `Test Group
[ ] ..! Task 1 #tag1 #tag2 -> 2023-10-01
[x] Task 2
`;
