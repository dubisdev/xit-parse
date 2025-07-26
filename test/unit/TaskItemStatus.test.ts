import { describe, it, expect } from "bun:test";
import { TaskItemStatus, TaskItemStatusValue } from "../../src/TaskItemStatus";

describe("TaskItemStatus", () => {
    describe("constructor", () => {
        it("should create a TaskItemStatus with valid 'Open' status", () => {
            const status = new TaskItemStatus("Open");
            expect(status.value).toBe("Open");
        });

        it("should create a TaskItemStatus with valid 'Ongoing' status", () => {
            const status = new TaskItemStatus("Ongoing");
            expect(status.value).toBe("Ongoing");
        });

        it("should create a TaskItemStatus with valid 'Checked' status", () => {
            const status = new TaskItemStatus("Checked");
            expect(status.value).toBe("Checked");
        });

        it("should create a TaskItemStatus with valid 'Obsolete' status", () => {
            const status = new TaskItemStatus("Obsolete");
            expect(status.value).toBe("Obsolete");
        });

        it("should create a TaskItemStatus with valid 'In Question' status", () => {
            const status = new TaskItemStatus("In Question");
            expect(status.value).toBe("In Question");
        });

        it("should throw an error for invalid status", () => {
            expect(() => new TaskItemStatus("Invalid")).toThrow(
                "Invalid task status: Invalid. Valid statuses are: Open, Ongoing, Checked, Obsolete, In Question"
            );
        });

        it("should throw an error for empty string", () => {
            expect(() => new TaskItemStatus("")).toThrow(
                "Invalid task status: . Valid statuses are: Open, Ongoing, Checked, Obsolete, In Question"
            );
        });

        it("should throw an error for null value", () => {
            expect(() => new TaskItemStatus(null as any)).toThrow();
        });

        it("should throw an error for undefined value", () => {
            expect(() => new TaskItemStatus(undefined as any)).toThrow();
        });

        it("should be case sensitive", () => {
            expect(() => new TaskItemStatus("open")).toThrow();
            expect(() => new TaskItemStatus("OPEN")).toThrow();
            expect(() => new TaskItemStatus("Open ")).toThrow(); // trailing space
            expect(() => new TaskItemStatus(" Open")).toThrow(); // leading space
        });
    });

    describe("value getter", () => {
        it("should return the correct value for each valid status", () => {
            const validStatuses = ["Open", "Ongoing", "Checked", "Obsolete", "In Question"] as const;
            
            validStatuses.forEach(status => {
                const taskStatus = new TaskItemStatus(status);
                expect(taskStatus.value).toBe(status);
            });
        });

        it("should return immutable value", () => {
            const status = new TaskItemStatus("Open");
            const value1 = status.value;
            const value2 = status.value;
            
            expect(value1).toBe(value2);
            expect(value1).toBe("Open");
        });
    });

    describe("edge cases", () => {
        it("should handle status with special characters correctly", () => {
            // "In Question" contains a space, which is valid
            const status = new TaskItemStatus("In Question");
            expect(status.value).toBe("In Question");
        });

        it("should throw descriptive error messages", () => {
            const invalidStatuses = ["pending", "completed", "draft", "123", "!@#"];
            
            invalidStatuses.forEach(invalidStatus => {
                expect(() => new TaskItemStatus(invalidStatus)).toThrow(
                    `Invalid task status: ${invalidStatus}. Valid statuses are: Open, Ongoing, Checked, Obsolete, In Question`
                );
            });
        });
    });

    describe("type safety", () => {
        it("should maintain type safety for valid statuses", () => {
            const status = new TaskItemStatus("Open");
            // TypeScript should infer the correct type
            const value: TaskItemStatusValue = status.value;
            expect(value).toBe("Open");
        });
    });
});
