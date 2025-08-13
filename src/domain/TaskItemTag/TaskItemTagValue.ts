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
