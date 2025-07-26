/**
 * A tag starts with a hashtag, followed by letters (as of the Unicode letter category), digits, hyphens, or underscores.
 */
class TaskItemTagName {
    value: string;

    constructor(value: string) {
        if (!/^#[\p{L}\p{N}_-]+$/u.test(value)) {
            throw new Error(`Invalid tag name: ${value}. A tag name must start with a hastag and consist of letters, digits, hyphens, or underscores.`);
        }

        this.value = value.slice(1); // Remove the leading hashtag
    }
}


export class TaskItemTag {
    private readonly _name: TaskItemTagName;
    private readonly _value: null | string;

    constructor(tagContent: string) {
        const { name, value } = getTaskItemTagParts(tagContent);

        this._name = name;
        this._value = value;
    }

    get name(): string {
        return this._name.value;
    }

    get value(): null | string {
        return this._value;
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
        value
    }
}
