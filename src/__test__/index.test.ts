import { describe, test, expect, beforeEach, mock } from "bun:test";
import app from "../index";

const mockD1 = () => {
    const results: any[] = [];

    return {
        prepare: mock((query: string) => ({
            bind: mock((...args: any[]) => ({
                run: mock().mockResolvedValue({ success: true }),
                first: mock().mockResolvedValue(results[0] || null),
                all: mock().mockResolvedValue({ results })
            })),
            run: mock().mockResolvedValue({ success: true }),
            first: mock().mockResolvedValue(results[0] || null),
            all: mock().mockResolvedValue({ results })
        })),
        setResults: (data: any[]) => {
            results.length = 0;
            results.push(...data);
        }
    };
};

describe("Task Manager API", () => {
    let db: ReturnType<typeof mockD1>;

    beforeEach(() => {
        db = mockD1();
    });

    describe("GET /", () => {
        test("retorna información de la API", async () => {
            const req = new Request("http://localhost/");
            const res = await app.fetch(req, { DB: db as any });

            expect(res.status).toBe(200);
            const data = await res.json();
            expect(data.message).toBe("Task Manager API - Cloudflare Workers");
            expect(data.version).toBe("1.0.0");
            expect(data.endpoints.tasks).toBe("/api/tasks");
        });
    });

    describe("POST /api/tasks", () => {
        test("crea una tarea con todos los campos", async () => {
            const taskData = {
                title: "Nueva tarea",
                description: "Descripción de prueba",
                status: "PENDING"
            };

            const req = new Request("http://localhost/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(taskData)
            });

            const res = await app.fetch(req, { DB: db as any });

            expect(res.status).toBe(201);
            const data = await res.json();
            expect(data.title).toBe(taskData.title);
            expect(data.description).toBe(taskData.description);
            expect(data.status).toBe(taskData.status);
            expect(data.id).toBeDefined();
            expect(data.createdAt).toBeDefined();
            expect(data.updatedAt).toBeDefined();
        });

        test("crea una tarea solo con título", async () => {
            const taskData = { title: "Solo título" };

            const req = new Request("http://localhost/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(taskData)
            });

            const res = await app.fetch(req, { DB: db as any });

            expect(res.status).toBe(201);
            const data = await res.json();
            expect(data.title).toBe(taskData.title);
            expect(data.status).toBe("PENDING");
        });

        test("rechaza tarea sin título", async () => {
            const taskData = { description: "Sin título" };

            const req = new Request("http://localhost/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(taskData)
            });

            const res = await app.fetch(req, { DB: db as any });

            expect(res.status).toBe(400);
            const data = await res.json();
            expect(data.error).toBe("Validation error");
        });

        test("rechaza tarea con status inválido", async () => {
            const taskData = {
                title: "Tarea",
                status: "INVALID_STATUS"
            };

            const req = new Request("http://localhost/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(taskData)
            });

            const res = await app.fetch(req, { DB: db as any });

            expect(res.status).toBe(400);
        });
    });

    describe("GET /api/tasks", () => {
        test("retorna lista vacía cuando no hay tareas", async () => {
            db.setResults([]);

            const req = new Request("http://localhost/api/tasks");
            const res = await app.fetch(req, { DB: db as any });

            expect(res.status).toBe(200);
            const data = await res.json();
            expect(Array.isArray(data)).toBe(true);
            expect(data.length).toBe(0);
        });

        test("retorna todas las tareas", async () => {
            db.setResults([
                {
                    id: "1",
                    title: "Tarea 1",
                    description: "Desc 1",
                    status: "PENDING",
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                },
                {
                    id: "2",
                    title: "Tarea 2",
                    description: null,
                    status: "COMPLETED",
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                }
            ]);

            const req = new Request("http://localhost/api/tasks");
            const res = await app.fetch(req, { DB: db as any });

            expect(res.status).toBe(200);
            const data = await res.json();
            expect(data.length).toBe(2);
            expect(data[0].title).toBe("Tarea 1");
            expect(data[1].title).toBe("Tarea 2");
        });
    });

    describe("GET /api/tasks/:id", () => {
        test("retorna una tarea por ID", async () => {
            const task = {
                id: "test-id",
                title: "Tarea específica",
                description: "Descripción",
                status: "IN_PROGRESS",
                createdAt: Date.now(),
                updatedAt: Date.now()
            };
            db.setResults([task]);

            const req = new Request("http://localhost/api/tasks/test-id");
            const res = await app.fetch(req, { DB: db as any });

            expect(res.status).toBe(200);
            const data = await res.json();
            expect(data.id).toBe(task.id);
            expect(data.title).toBe(task.title);
        });

        test("retorna 404 cuando la tarea no existe", async () => {
            db.setResults([]);

            const req = new Request("http://localhost/api/tasks/non-existent");
            const res = await app.fetch(req, { DB: db as any });

            expect(res.status).toBe(404);
            const data = await res.json();
            expect(data.error).toBe("Task not found");
        });
    });

    describe("PATCH /api/tasks/:id", () => {
        test("actualiza el título de una tarea", async () => {
            const updatedTask = {
                id: "test-id",
                title: "Título actualizado",
                description: "Desc",
                status: "PENDING",
                createdAt: Date.now(),
                updatedAt: Date.now()
            };
            db.setResults([updatedTask]);

            const req = new Request("http://localhost/api/tasks/test-id", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: "Título actualizado" })
            });

            const res = await app.fetch(req, { DB: db as any });

            expect(res.status).toBe(200);
            const data = await res.json();
            expect(data.title).toBe("Título actualizado");
        });

        test("actualiza el status de una tarea", async () => {
            const updatedTask = {
                id: "test-id",
                title: "Tarea",
                description: null,
                status: "COMPLETED",
                createdAt: Date.now(),
                updatedAt: Date.now()
            };
            db.setResults([updatedTask]);

            const req = new Request("http://localhost/api/tasks/test-id", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "COMPLETED" })
            });

            const res = await app.fetch(req, { DB: db as any });

            expect(res.status).toBe(200);
            const data = await res.json();
            expect(data.status).toBe("COMPLETED");
        });

        test("rechaza actualización con datos inválidos", async () => {
            const req = new Request("http://localhost/api/tasks/test-id", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "INVALID" })
            });

            const res = await app.fetch(req, { DB: db as any });

            expect(res.status).toBe(400);
        });
    });

    describe("DELETE /api/tasks/:id", () => {
        test("elimina una tarea", async () => {
            const req = new Request("http://localhost/api/tasks/test-id", {
                method: "DELETE"
            });

            const res = await app.fetch(req, { DB: db as any });

            expect(res.status).toBe(204);
        });
    });

    describe("CORS", () => {
        test("permite solicitudes CORS", async () => {
            const req = new Request("http://localhost/api/tasks", {
                method: "OPTIONS"
            });

            const res = await app.fetch(req, { DB: db as any });

            expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
        });
    });
});

