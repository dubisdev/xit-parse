const checkIsBlankLine = (line: string): boolean => {
    return line.trim() === '';
}

const checkIsTaskLine = (line: string): boolean => {
    const taskLinePattern = /^(\[(?:(?<open> )|(?<ongoing>@)|(?<checked>x)|(?<obsolete>~)|(?<inQuestion>\?))\]) /

    return line.match(taskLinePattern) !== null;
}

const checkIsTaskSubline = (line: string): boolean => {
    const taskSublinePattern = /^([\t]+|[ ]{4}).*/gm

    return line.match(taskSublinePattern) !== null;
}

const checkIsGroupTitle = (line: string): boolean => {
    const titlePattern = /^([a-zA-Z0-9].*|\[(?!x\])[a-zA-Z0-9].*)/gm

    return line.match(titlePattern) !== null;
}

export enum TextLineTypes {
    BLANK = 'blank',
    TASK = 'task',
    TASK_SUBLINE = 'task_subline',
    GROUP_TITLE = 'group_title'
}

export class LineTypeDetector {

    static detect(line: string): TextLineTypes {
        if (checkIsBlankLine(line)) {
            return TextLineTypes.BLANK;
        }

        if (checkIsTaskLine(line)) {
            return TextLineTypes.TASK;
        }

        if (checkIsTaskSubline(line)) {
            return TextLineTypes.TASK_SUBLINE;
        }

        if (checkIsGroupTitle(line)) {
            return TextLineTypes.GROUP_TITLE;
        }

        throw new Error(`Unknown line type for line: ${line}`);
    }

}
