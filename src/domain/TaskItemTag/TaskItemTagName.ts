/**
 * A tag starts with a hashtag, followed by letters (as of the Unicode letter category), digits, hyphens, or underscores.
 */
export class TaskItemTagName {
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
