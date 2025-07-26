import { XitDocument } from "../types";

export class ParseTextToXitDocumentUseCase {
    public execute(text: string): XitDocument {
        return {
            items: []
        }
    }
}
