import { randomUUID } from 'crypto';
import { TaskItemStatusValue } from "../domain";
import { TaskItem, XitDocument, XitDocumentGroup, XitDocumentItemType } from "../types";
import { assertIsNever } from "../utils/assertIsNever";

// To be used when looking at *entire* line to determine type
const xitLineTypePatterns = {
    status: /^(\[(?:(?<open> )|(?<ongoing>@)|(?<checked>x)|(?<obsolete>~)|(?<inQuestion>\?))\]) /
};

const checkIsBlankLine = (line: string): boolean => {
    return line.trim() === '';
}

const checkIsTaskLine = (line: string): boolean => {
    const taskLinePattern = /^(\[(?:(?<open> )|(?<ongoing>@)|(?<checked>x)|(?<obsolete>~)|(?<inQuestion>\?))\]) /

    return line.match(taskLinePattern) !== null;
}

const checkIsTaskSubline = (line: string): boolean => {
    return line.match(/^([\t]+|[ ]{4}).*/gm) !== null;
}

const checkIsGroupTitle = (line: string): boolean => {
    const titlePattern = /^([a-zA-Z0-9].*|\[(?!x\])[a-zA-Z0-9].*)/gm

    return line.match(titlePattern) !== null;
}


// To be used when looking at line tokens to determine modifiers
const xitLineModifierPatterns = {
    dueDate: /-> ([0-9]{4}(-|\/){0,1}([qQwW]{0,1}[0-9]{1,2}){0,1})(-|\/){0,1}([0-9]{2}){0,1}/gm,
    tag: /#[^ ]{1,}/gm,
};

const getItemStatus = (line: string): TaskItemStatusValue | null => {
    const statusMatch = line.match(xitLineTypePatterns.status);
    if (!statusMatch) return null;

    const { open, ongoing, checked, obsolete, inQuestion } = statusMatch.groups || {}

    if (open) {
        return TaskItemStatusValue.OPEN;
    } else if (checked) {
        return TaskItemStatusValue.CHECKED;
    } else if (ongoing) {
        return TaskItemStatusValue.ONGOING;
    } else if (obsolete) {
        return TaskItemStatusValue.OBSOLETE;
    } else if (inQuestion) {
        return TaskItemStatusValue.IN_QUESTION;
    }

    return null;
};

const getItemPriority = (line: string): {
    number: number;
    padding: number;
    paddingPosition: 'start' | 'end';
} | null => {
    const priorityPattern = /^\[[ @~x?]{1}\] ((?<padEnd>[!]+[.]*)|(?<padStart>[.]+[!]*)){1}[^.!]*$/
    const hasPriority = line.match(priorityPattern);

    if (!hasPriority) return null;

    const matchedPart = hasPriority[1];
    const isPadStart = matchedPart.startsWith('.');

    const padLength = matchedPart.match(/[.]/g)?.length || 0;

    return {
        number: matchedPart.length,
        padding: padLength,
        paddingPosition: isPadStart ? 'start' : 'end', // Default to start if neither
    }
}

const getContentWithoutStatus = (content: string): string => {
    return content.replace(xitLineTypePatterns.status, '');
}

const getContentWithoutPriority = (content: string): string => {
    return content.replace(/[!.]{1,} /, '');
}

export class ParseTextToXitDocumentUseCase {
    public execute(text: string): XitDocument {
        return this.toObject(text)
    }

    private toObject(xitString: string): XitDocument {
        const lines = xitString.split('\n')

        const groups: XitDocumentGroup[] = [];

        let currentGroup: XitDocumentGroup | null = null;
        let currentTaskItem: TaskItem | null = null;

        for (const line of lines) {
            const isBlankLine = checkIsBlankLine(line);
            const isTaskSubline = checkIsTaskSubline(line)
            const isGroupTitle = checkIsGroupTitle(line);
            const isTaskLine = checkIsTaskLine(line);

            if (isBlankLine) {
                if (!currentGroup) {
                    // If we have a blank line and no current group, we just skip it
                    continue;
                }

                if (currentGroup) {
                    // If we have a group and we hit a blank line, we end the task & group

                    // Finish processing current task
                    if (currentTaskItem) {
                        currentGroup.items.push(currentTaskItem)

                        currentTaskItem = null
                    }

                    // Finish processing current group

                    groups.push(currentGroup);

                    currentGroup = null;
                    continue;
                }

                assertIsNever(currentGroup)
                continue
            }

            // Not a blank line, ensure we are in a group
            if (currentGroup === null) {
                // If we don't have a group, we create one
                currentGroup = {
                    id: randomUUID(),
                    type: XitDocumentItemType.GROUP,
                    items: []
                }
            }

            if (isGroupTitle) {
                if (currentGroup.title) {
                    throw new Error("Trying to add a title to an already titled group")
                }

                currentGroup.title = line.trim()
                continue
            }

            if (isTaskSubline) {
                if (!currentTaskItem) {
                    throw new Error("Cannot add a task subline outside a task")
                }

                currentTaskItem.content += ("\n" + line.trim())
            }

            if (isTaskLine) {
                // Add previous task to group
                if (currentTaskItem) {
                    currentGroup.items.push(currentTaskItem)
                }

                // Get item status
                const status = getItemStatus(line);
                if (!status) throw new Error(`Invalid item status: ${line}`);

                // Get item priority
                const priority = getItemPriority(line) || undefined;

                const lineWithoutStatus = getContentWithoutStatus(line);
                const contentWithoutPriority = getContentWithoutPriority(lineWithoutStatus);

                currentTaskItem = {
                    id: randomUUID(),
                    content: contentWithoutPriority,
                    rawContent: line,
                    status,
                    priority: priority || undefined
                }

            }
        }

        return { groups: groups }
    };
}
