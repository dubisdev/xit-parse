import { XitDocument, XitDocumentGroup, XitDocumentItemType } from "../types";

export class ParseTXitDocumentToTextUseCase {
    execute(xit: XitDocument): string {
        return xit.items.map(item => 
            item.type === XitDocumentItemType.BLANK_LINE
                ? "\n"
                : this.parseXitGroupToText(item)
        ).join('');
    }

    parseXitGroupToText(group: XitDocumentGroup): string {
        let content = ''

        if (group.title) {
            content += group.title;
        }

        group.items.forEach(item => {
            content += '\n' + item.rawContent;
        });

        return content;
    }
}
