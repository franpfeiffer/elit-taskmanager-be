import { beforeAll, afterAll } from "bun:test";

beforeAll(() => {
    console.log("Iniciando tests...");
});

afterAll(() => {
    console.log("Tests completados");
});
