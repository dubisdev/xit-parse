import { TaskItemStatus } from "./domain";

type TaskItemPrimitives = {
    content: string;
    status: string;
    priority: number;
    tags: string[];
    dueDate: Date | null;
};

export class TaskItem {
    private readonly _content: string;
    private readonly _status: TaskItemStatus;
    private readonly _priority: number;
    private readonly _tags: string[];
    private readonly _dueDate: Date | null;

    private constructor({
        content,
        status,
        priority,
        tags,
        dueDate
    }: TaskItemPrimitives) {
        this._content = content;
        this._status = new TaskItemStatus(status);
        this._priority = priority;
        this._tags = tags;
        this._dueDate = dueDate;
    }


    /**
     * Count of ! of the task item.
     * As the spec says, more ! means higher priority.
     */
    get priority(): number {
        return this._priority;
    }

    /**
     * List item content.
     * - Can be multiline.
     * - Can be empty or full of spaces.
     */
    get content(): string {
        return this._content;
    }


}
