import { TaskItemTagName } from "./TaskItemTagName";
import { TaskItemTagValue } from "./TaskItemTagValue";

export class TaskItemTag {
    private readonly _name: TaskItemTagName;
    private readonly _value: TaskItemTagValue;

    constructor(tagContent: string) {
        const { name, value } = getTaskItemTagParts(tagContent);

        this._name = name;
        this._value = value;
    }

    get name(): string {
        return this._name.value;
    }

    get value(): null | string {
        return this._value.value;
    }

    hasValue(): boolean {
        return this._value !== null
    }
}

function getTaskItemTagParts(tag: string) {
    const [name = null, value = null] = tag.split("=", 2)

    if (!name) {
        throw new Error(`Invalid tag format: ${tag}. Expected format is 'name' or 'name=value'.`);
    }

    return {
        name: new TaskItemTagName(name),
        value: new TaskItemTagValue(value)
    }
}
