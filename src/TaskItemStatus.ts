const VALID_STATUSES = [
    "Open",
    "Ongoing",
    "Checked",
    "Obsolete",
    "In Question"
] as const

export type TaskItemStatusValue = (typeof VALID_STATUSES)[number];

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
