import { describe, it, expect } from "bun:test"
import { ParseXitDocumentToTextUseCase } from '../../src/application/parse-xit-document-to-text.use-case.ts';
import { XitDocTestInput, XitDocTestOutput } from './data/xitTest.ts';

describe("ParseTXitDocumentToTextUseCase", () => {
    const parseUseCase = new ParseXitDocumentToTextUseCase();

    it("should convert object back to xit string format", () => {
        const calculated = parseUseCase.execute(XitDocTestInput);
        const expected = XitDocTestOutput;
        expect(calculated).toBe(expected);
    });
});


