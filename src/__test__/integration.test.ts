import { describe, test, expect } from "bun:test";
import app from "../index";

describe("Integration Tests", () => {
    test("flujo completo CRUD de tareas", async () => {
        const mockDB = {
            prepare: () => ({
                bind: () => ({
                    run: async () => ({ success: true }),
                    first: async () => null,
                    all: async () => ({ results: [] })
                }),
                run: async () => ({ success: true }),
                first: async () => null,
                all: async () => ({ results: [] })
            })
        };

        const createReq = new Request("http://localhost/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: "Tarea de prueba",
                description: "Esta es una prueba",
                status: "PENDING"
            })
        });

        const createRes = await app.fetch(createReq, { DB: mockDB as any });
        expect(createRes.status).toBe(201);

        const created = await createRes.json();
        expect(created.id).toBeDefined();
        expect(created.title).toBe("Tarea de prueba");
    });

    test("validación de flujo de estados", async () => {
        const states = ["PENDING", "IN_PROGRESS", "COMPLETED"];

        for (const state of states) {
            const mockDB = {
                prepare: () => ({
                    bind: () => ({
                        run: async () => ({ success: true }),
                        first: async () => null,
                        all: async () => ({ results: [] })
                    }),
                    run: async () => ({ success: true }),
                    first: async () => null,
                    all: async () => ({ results: [] })
                })
            };

            const req = new Request("http://localhost/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: `Tarea ${state}`,
                    status: state
                })
            });

            const res = await app.fetch(req, { DB: mockDB as any });
            expect(res.status).toBe(201);

            const data = await res.json();
            expect(data.status).toBe(state);
        }
    });
});


