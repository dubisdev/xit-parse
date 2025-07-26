import {describe, it, expect} from "bun:test"
import { ParseTXitDocumentToTextUseCase } from '../../src/application/parse-xit-document-to-text.use-case.ts';
import { XitDocTestInput, XitDocTestOutput } from './data/xitTest.ts';

console.log(XitDocTestOutput)

describe("ParseTXitDocumentToTextUseCase", () => {
    const parseUseCase = new ParseTXitDocumentToTextUseCase();

    it("should convert object back to xit string format", () => {
        const calculated = parseUseCase.execute(XitDocTestInput);
        const expected = XitDocTestOutput;
        
        expect(calculated).toBe(expected);
    });
});


