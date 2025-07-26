export enum TaskItemStatusValue {
    OPEN = "Open",
    ONGOING = "Ongoing",
    CHECKED = "Checked",
    OBSOLETE = "Obsolete",
    IN_QUESTION = "In Question"
}

const VALID_STATUSES = Object.values(TaskItemStatusValue);

export class TaskItemStatus {
    private readonly _value: TaskItemStatusValue;

    constructor(value: string){
        const status = this.ensureValidValue(value);

        this._value = status;
    }

    private ensureValidValue(value: string): TaskItemStatusValue {
        const testingValue = value as TaskItemStatusValue;
        
        if (!VALID_STATUSES.includes(testingValue)) {
            throw new Error(`Invalid task status: ${value}. Valid statuses are: ${VALID_STATUSES.join(", ")}`);
        }

        return testingValue;
    }

    get value(): TaskItemStatusValue {
        return this._value;
    }
}
