import { randomUUID } from 'crypto';
import { TaskItemStatusValue } from './domain';
import { XitDocument, XitDocumentGroup, XitDocumentItem, XitDocumentItemType } from './types';
import { ParseXitDocumentToTextUseCase } from './application/parse-xit-document-to-text.use-case';

// To be used when looking at *entire* line to determine type
const xitLineTypePatterns = {
    title: /^([a-zA-Z0-9].*|\[(?!x\])[a-zA-Z0-9].*)/gm,
    status: /^\[(?<open>[ ])|(?<ongoing>[@])|(?<checked>[x])|(?<obsolete>[~])|(?<inQuestion>[\?])\] .*/,
    itemDetails: /^([\t]+|[ ]{4}).*/gm,
};

// To be used when splitting raw content out into "human readable"/sanitized content
// TODO -> Is this a good solution? Or is there a way to modify the regex we have above?
const xitItemStatusDelimiterPatterns = {
    openItem: /^\[ \] /gm,
    checkedItem: /^\[x\] /gm,
    ongoingItem: /^\[@\] /gm,
    obsoleteItem: /^\[~\] /gm,
    inQuestionItem: /^\[\?\] /gm,
};

// To be used when looking at line tokens to determine modifiers
const xitLineModifierPatterns = {
    priorityLine: /^\[[ @~x?]{1}\] ((?<padEnd>[!]+[.]*)|(?<padStart>[.]+[!]*)){1}[^.!]*$/,
    priority: /[!.]{1,} /gm,
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
    const hasPriority = line.match(xitLineModifierPatterns.priorityLine);

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

const getContentWithoutStatus = (content: string, status: TaskItemStatusValue): string => {
    let readableContent = content;
    switch (status) {
        case TaskItemStatusValue.OPEN:
            readableContent = readableContent.replace(xitItemStatusDelimiterPatterns.openItem, '');
            break;
        case TaskItemStatusValue.CHECKED:
            readableContent = readableContent.replace(xitItemStatusDelimiterPatterns.checkedItem, '');
            break;
        case TaskItemStatusValue.ONGOING:
            readableContent = readableContent.replace(xitItemStatusDelimiterPatterns.ongoingItem, '');
            break;
        case TaskItemStatusValue.OBSOLETE:
            readableContent = readableContent.replace(xitItemStatusDelimiterPatterns.obsoleteItem, '');
            break;
        case TaskItemStatusValue.IN_QUESTION:
            readableContent = readableContent.replace(xitItemStatusDelimiterPatterns.inQuestionItem, '');
            break;
    }

    return readableContent
}

const getContentWithoutPriority = (content: string): string => {
    return content.replace(xitLineModifierPatterns.priority, '');
}


const processGroup = (content: string): XitDocumentGroup => {
    const lines = content.split('\n')

    const groupInfo: XitDocumentGroup = {
        id: randomUUID(),
        type: XitDocumentItemType.GROUP,
        items: []
    }

    const firstLineIsEmpty = lines[0].trim() === '';

    lines.forEach((content, i) => {
        const isFirstLine = (i === 0) || (i === 1 && firstLineIsEmpty);
        const isHeading = content.match(xitLineTypePatterns.title);

        // First line might be a heading
        if (isFirstLine && isHeading) {
            groupInfo.title = content
            return
        }

        const isBlankLine = content.trim() === '';
        if (isBlankLine) {
            groupInfo.items.push({
                id: randomUUID(),
                blankLine: true
            })

            return
        }

        // Get item tags
        // Get item due date
        // Get item content

        // Get item status
        const status = getItemStatus(content);
        if (!status) throw new Error(`Invalid item status: ${content}`);

        // Get item priority
        const priority = getItemPriority(content) || undefined;

        const contentWithoutStatus = getContentWithoutStatus(content, status);
        const contentWithoutPriority = getContentWithoutPriority(contentWithoutStatus);

        groupInfo.items.push({
            id: randomUUID(),
            rawContent: content,
            status,
            content: contentWithoutPriority,
            priority,
        })
    })

    return groupInfo
}


/**
 * Given a string (the raw xit file contents), represent the xit file 
 * as a JSON object
 */
export function toObject(xitString: string): XitDocument {
    // Split text into groups separated by blank lines, keeping the separators
    const splitResult = xitString.split(/(\n[ \t]*\n)/);

    // Create ordered array with content groups and separators, filtering out empty items
    const groups: XitDocumentItem[] = [];

    splitResult.forEach((item, index) => {
        const isEmpty = item.trim() === '';
        const isBlankLine = index % 2 !== 0;

        if (isBlankLine) {
            // Add as much lines as there are blank lines
            // This is a separator, so we add it as a blank line item
            const totalLines = item.split('\n').length - 1; // Count the number of newlines

            const lines = Array.from({ length: totalLines }, () => ({
                id: randomUUID(),
                type: XitDocumentItemType.BLANK_LINE
            }) as const
            );

            groups.push(...lines);

            return
        }

        // the last line is included in the split, so we need to check if it is empty
        if (!isEmpty) {
            groups.push(processGroup(item));
        }
    });

    return { items: groups }
};

export const toString = (input: XitDocument) => {
    const uc = new ParseXitDocumentToTextUseCase()
    return uc.execute(input)
}
