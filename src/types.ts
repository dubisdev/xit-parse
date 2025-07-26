import { TaskItemStatusValue } from "./domain";

export enum XitDocumentItemType {
    BLANK_LINE = "blank-line",
    GROUP = "group"
}

type TaskItem = {
    id: string;
    /**
     * Content after being processed (removed tags, status, etc.). Just the "todo" part of the item.
     */
    content: string;
    /**
     * Original content of the item, including tags, status, etc. As it was in the Xit file.
     */
    rawContent: string;
    status: TaskItemStatusValue;
    tags?: string[];
    priority?: {
        /**
         * Total priority calculated from the number of ! and dots (.) in the content.
         */
        number: number;
        /**
         * Count of dots (.) to represent the priority visually.
         */
        padding: number;
        paddingPosition: "start" | "end"
    };
    dueDate?: {
        /**
         * Calculated JS date
         */
        date: Date
        /**
         * Text input for Date
         */
        textDue: string
    };
}

type BlankTaskItemLine = {
    id: string;
    blankLine: true;
}

export type XitDocumentGroup = {
    id: string;
    type: XitDocumentItemType.GROUP;
    title?: string;
    items: (TaskItem | BlankTaskItemLine)[];
}

type XitDocumentLine = {
    id: string;
    type: XitDocumentItemType.BLANK_LINE;
}

export type XitDocumentItem = {
    id: string;
    type: XitDocumentItemType;
} & (XitDocumentLine | XitDocumentGroup);

export type XitDocument = {
    items: XitDocumentItem[];
}
