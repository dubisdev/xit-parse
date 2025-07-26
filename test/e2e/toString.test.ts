import { resolve } from 'path';
import * as xit from '../../src/index.js';
import { readFileSync  } from 'fs';
import {describe, it, expect} from "bun:test"

const fileInputContent = readFileSync(resolve(__dirname, './data/input.xit'), 'utf-8');
const fileOutputContent = readFileSync(resolve(__dirname, './data/output.xit'), 'utf-8');

describe("toString", () => {
    it("should convert object back to xit string format", () => {
        const obj = xit.toObject(fileInputContent);
        const str = xit.toString(obj);
        expect(str).toBe(fileOutputContent);
    });

    it("should produce the same output for the same input", () => {
        const obj1 = xit.toObject(fileInputContent);
        const obj2 = xit.toObject(fileInputContent);
        const str1 = xit.toString(obj1);
        const str2 = xit.toString(obj2);
        expect(str1).toBe(str2);
    })

    // TODO - It would be nice that an input always produces the input as aoutput when converted back
    // it("should produce the same output for the same input", () => {
    //     const obj = xit.toObject(fileInputContent);
    //     const str = xit.toString(obj);
    //     expect(str).toBe(fileInputContent);
    // });
});


