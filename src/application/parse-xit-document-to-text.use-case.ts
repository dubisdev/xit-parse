import { XitDocument } from "../types";
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
        const groupTexts: string[] = []

        xitObject.groups.forEach((group) => {
            const groupLines: string[] = []

            if (group.title) {
                groupLines.push(group.title)
            }

            group.items.forEach((line) => {
                // creating an item
                const checkBox = getCheckBox(line.status)
                const priority = line.priority && getPriorityString(line.priority)

                const { content, dueDate, tags } = line

                const tagString = (tags || []).map(t => `#${t}`).join(" ")
                const dueDateString = dueDate && `-> ${dueDate.textDue}`

                const textLine = [checkBox, priority, content, tagString, dueDateString].filter(Boolean).join(" ")

                groupLines.push(textLine.replaceAll("\n", "\n    "))
            });

            const groupText = groupLines.join("\n") + "\n"

            groupTexts.push(groupText)
        });

        return groupTexts.join("\n")
    };
}
