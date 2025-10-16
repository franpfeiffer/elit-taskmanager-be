import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';

export const createOpenAPIApp = () => {
    const app = new OpenAPIHono();

    app.doc('/doc', {
        openapi: '3.0.0',
        info: {
            version: '1.0.0',
            title: 'Task Manager API',
            description: 'API REST para gestión de tareas - Desafío Técnico Elit',
            contact: {
                name: 'API Support',
                url: 'https://elit-taskmanager.pfeifferf.com'
            }
        },
        servers: [
            {
                url: 'https://elit-taskmanager-api.pfeifferf.workers.dev',
                description: 'Production server'
            },
            {
                url: 'http://localhost:8787',
                description: 'Development server'
            }
        ],
        tags: [
            {
                name: 'Tasks',
                description: 'Operaciones CRUD de tareas'
            },
            {
                name: 'Health',
                description: 'Health checks y metadata'
            }
        ]
    });

    app.get('/swagger', swaggerUI({ url: '/doc' }));

    return app;
};
