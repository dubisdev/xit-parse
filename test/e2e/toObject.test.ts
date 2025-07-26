import { resolve } from 'path';
import { readFileSync } from 'fs';
import * as xit from '../../src/index.ts';
import { describe, it, expect } from "bun:test";

const fileInputContent = readFileSync(resolve(__dirname, './data/input.xit'), 'utf-8');

describe("toObject", () => {
    it("should convert xit string to object", () => {
        const xitObject = xit.toObject(fileInputContent);
        expect(xitObject).toBeDefined();
        expect(xitObject.items.length).toBeGreaterThan(0);
    });

    it("should convert object back to xit string format", () => {
        const xitString = xit.toString(xit.toObject(fileInputContent));
        expect(xitString).toBe(fileInputContent);
    });
});
