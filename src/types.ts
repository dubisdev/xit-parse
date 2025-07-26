import { TaskItemStatusValue } from "./TaskItemStatus";

enum XitDocumentItemType {
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
    priority?: number;
    dueDate?: Date;
}

type XitDocumentGroup = {
    id: string;
    type: XitDocumentItemType.GROUP;
    title: string;
    items: TaskItem[];
}

type XitDocumentLine = {
    id: string;
    type: XitDocumentItemType.BLANK_LINE;
}

type XitDocumentItem = {
    id: string;
    type: XitDocumentItemType;
} & (XitDocumentLine | XitDocumentGroup);

export type XitDocument = {
    fileName: string;
    items: XitDocumentItem[];
}
