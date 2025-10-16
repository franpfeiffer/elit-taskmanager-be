import { describe, test, expect } from "bun:test";
import { CreateTaskSchema, UpdateTaskSchema, StatusEnum } from "../task.types";

describe("Task Types Validation", () => {
    describe("StatusEnum", () => {
        test("acepta valores válidos", () => {
            expect(() => StatusEnum.parse("PENDING")).not.toThrow();
            expect(() => StatusEnum.parse("IN_PROGRESS")).not.toThrow();
            expect(() => StatusEnum.parse("COMPLETED")).not.toThrow();
        });

        test("rechaza valores inválidos", () => {
            expect(() => StatusEnum.parse("INVALID")).toThrow();
            expect(() => StatusEnum.parse("")).toThrow();
            expect(() => StatusEnum.parse(null)).toThrow();
        });
    });

    describe("CreateTaskSchema", () => {
        test("valida tarea con todos los campos", () => {
            const task = {
                title: "Test Task",
                description: "Test Description",
                status: "PENDING" as const
            };
            const result = CreateTaskSchema.parse(task);
            expect(result.title).toBe("Test Task");
            expect(result.description).toBe("Test Description");
            expect(result.status).toBe("PENDING");
        });

        test("valida tarea solo con título", () => {
            const task = { title: "Test Task" };
            const result = CreateTaskSchema.parse(task);
            expect(result.title).toBe("Test Task");
            expect(result.description).toBeUndefined();
            expect(result.status).toBeUndefined();
        });

        test("rechaza tarea sin título", () => {
            const task = { description: "Test" };
            expect(() => CreateTaskSchema.parse(task)).toThrow();
        });

        test("rechaza título vacío", () => {
            const task = { title: "" };
            expect(() => CreateTaskSchema.parse(task)).toThrow();
        });

        test("rechaza título con solo espacios", () => {
            const task = { title: "   " };
            expect(() => CreateTaskSchema.parse(task)).toThrow();
        });

        test("rechaza status inválido", () => {
            const task = { title: "Test", status: "INVALID_STATUS" };
            expect(() => CreateTaskSchema.parse(task)).toThrow();
        });

        test("acepta descripción vacía", () => {
            const task = { title: "Test", description: "" };
            expect(() => CreateTaskSchema.parse(task)).not.toThrow();
        });
    });

    describe("UpdateTaskSchema", () => {
        test("valida actualización de todos los campos", () => {
            const update = {
                title: "Updated Task",
                description: "Updated Description",
                status: "COMPLETED" as const
            };
            const result = UpdateTaskSchema.parse(update);
            expect(result.title).toBe("Updated Task");
            expect(result.description).toBe("Updated Description");
            expect(result.status).toBe("COMPLETED");
        });

        test("valida actualización de un solo campo", () => {
            const update = { status: "IN_PROGRESS" as const };
            const result = UpdateTaskSchema.parse(update);
            expect(result.status).toBe("IN_PROGRESS");
        });

        test("rechaza actualización sin campos", () => {
            const update = {};
            expect(() => UpdateTaskSchema.parse(update)).toThrow();
        });

        test("rechaza título vacío en actualización", () => {
            const update = { title: "" };
            expect(() => UpdateTaskSchema.parse(update)).toThrow();
        });

        test("acepta descripción vacía en actualización", () => {
            const update = { description: "" };
            expect(() => UpdateTaskSchema.parse(update)).not.toThrow();
        });

        test("rechaza status inválido en actualización", () => {
            const update = { status: "WRONG_STATUS" };
            expect(() => UpdateTaskSchema.parse(update)).toThrow();
        });
    });
});
