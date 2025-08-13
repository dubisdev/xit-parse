/**
 * A tag starts with a hashtag, followed by letters (as of the Unicode letter category), digits, hyphens, or underscores.
 */
class TaskItemTagName {
    private readonly _value: string;

    constructor(value: string) {
        if (!/^#[\p{L}\p{N}_-]+$/u.test(value)) {
            throw new Error(`Invalid tag name: ${value}. A tag name must start with a hastag and consist of letters, digits, hyphens, or underscores.`);
        }

        this._value = value.slice(1); // Remove the leading hashtag
    }

    get value(): string {
        return this._value;
    }
}

const getQuotedValue = (value: string) => {
    const quotedValue = value.match(/^[']([^'\n]*)[']/);

    if (quotedValue) {
        return quotedValue[1];
    }

    const doubleQuotedValue = value.match(/^["]([^"\n]*)["]/);
    if (doubleQuotedValue) {
        return doubleQuotedValue[1];
    }

    return null;
}

export class TaskItemTagValue {
    private readonly _value: string | null;

    constructor(value: string | null) {
        if (!value) {
            this._value = null;
            return
        }

        // Handle values between quotes or double quotes
        const quotedValue = getQuotedValue(value);
        if (quotedValue !== null) {
            this._value = quotedValue;
            return;
        }

        const startsWithQuote = value.startsWith("'") || value.startsWith('"');
        if (startsWithQuote) { // Unfinished quoted value
            this._value = null;
            return;
        }

        if (/^[\p{L}\p{N}_-]+$/u.test(value)) {
            this._value = value;
            return
        }

        this._value = null;
    }

    get value(): string | null {
        return this._value;
    }

}


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
