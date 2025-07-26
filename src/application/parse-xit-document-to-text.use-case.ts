import { XitDocument, XitDocumentItemType } from "../types";
import { TaskItemStatusValue } from "../domain";

const checkBoxMap = {
    [TaskItemStatusValue.OPEN]: " ",
    [TaskItemStatusValue.CHECKED]: "x",
    [TaskItemStatusValue.IN_QUESTION]: "?",
    [TaskItemStatusValue.OBSOLETE]: "~",
    [TaskItemStatusValue.ONGOING]: "@"
} as const satisfies Record<TaskItemStatusValue, string>

const getCheckBox = (taskStatus: TaskItemStatusValue) => {
    return `[${checkBoxMap[taskStatus]}]` as const
}

const getPriorityString = ({ number, padding, paddingPosition }: { number: number, padding: number, paddingPosition: "start" | "end" }) => {
    const mainSymbolCount = number - padding
    const mainSymbol = "!".repeat(mainSymbolCount)

    const secondarySymbol = ".".repeat(padding)

    if (!secondarySymbol) return mainSymbol


    if (paddingPosition === 'start') {
        return `${secondarySymbol}${mainSymbol}`
    }

    return `${mainSymbol}${secondarySymbol}`
}

export class ParseXitDocumentToTextUseCase {
    execute(xit: XitDocument): string {
        return this.toString(xit)
    }

    toString(xitObject: XitDocument): string {
        let xitString = '';

        xitObject.items.forEach((item) => {
            if (item.type === XitDocumentItemType.BLANK_LINE) {
                xitString += "\n"
                return
            }

            // Group
            if (item.title) {
                xitString += item.title
            }

            item.items.forEach((line) => {
                // [checkbox] [priority] [...restOfContent: name, tags, etc]

                if ("blankLine" in line) {
                    xitString += "\n"
                    return
                }

                // creating an item
                const checkBox = getCheckBox(line.status)
                const priority = line.priority && getPriorityString(line.priority)

                const { content, dueDate, tags } = line

                const tagString = (tags || []).map(t => `#${t}`).join(" ")
                const dueDateString = dueDate && `-> ${dueDate.textDue}`

                const textLine = [checkBox, priority, content, tagString, dueDateString].filter(Boolean).join(" ")

                xitString += `\n${textLine}`
            });
        });

        return xitString;
    };
}
