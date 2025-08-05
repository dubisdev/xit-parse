import { XitDocument } from './types';
import { ParseXitDocumentToTextUseCase } from './application/parse-xit-document-to-text.use-case';
import { ParseTextToXitDocumentUseCase } from './application/parse-text-to-xit-document.use-case';

/**
 * Given a string (the raw xit file contents), represent the xit file 
 * as a JSON object
 */
export const toObject = (xitString: string): XitDocument => {
    const uc = new ParseTextToXitDocumentUseCase()
    return uc.execute(xitString)
};

export const toString = (input: XitDocument): string => {
    const uc = new ParseXitDocumentToTextUseCase()
    return uc.execute(input)
}
