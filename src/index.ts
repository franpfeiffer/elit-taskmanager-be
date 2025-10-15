import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { z } from 'zod';

type Bindings = {
    DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', cors({
    origin: '*',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS', 'PATCH', 'DELETE'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: false,
}));

const CreateTaskSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional()
});

const UpdateTaskSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional()
});

app.get('/', (c) => {
    return c.json({
        message: 'Task Manager API - Cloudflare Workers',
        version: '1.0.0',
        endpoints: {
            tasks: '/api/tasks'
        }
    });
});

app.post('/api/tasks', async (c) => {
    try {
        const body = await c.req.json();
        const data = CreateTaskSchema.parse(body);

        const id = crypto.randomUUID();
        const now = Date.now();

        await c.env.DB.prepare(
            'INSERT INTO tasks (id, title, description, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)'
        ).bind(
            id,
            data.title,
            data.description || null,
            data.status || 'PENDING',
            now,
            now
        ).run();

        const task = {
            id,
            title: data.title,
            description: data.description || null,
            status: data.status || 'PENDING',
            createdAt: new Date(now).toISOString(),
            updatedAt: new Date(now).toISOString()
        };

        return c.json(task, 201);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return c.json({ error: 'Validation error', details: error.errors }, 400);
        }
        console.error('Error creating task:', error);
        return c.json({ error: 'Internal server error' }, 500);
    }
});

app.get('/api/tasks', async (c) => {
    try {
        const { results } = await c.env.DB.prepare(
            'SELECT * FROM tasks ORDER BY createdAt DESC'
        ).all();

        const tasks = results.map((row: any) => ({
            id: row.id,
            title: row.title,
            description: row.description,
            status: row.status,
            createdAt: new Date(row.createdAt).toISOString(),
            updatedAt: new Date(row.updatedAt).toISOString()
        }));

        return c.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return c.json({ error: 'Internal server error' }, 500);
    }
});

app.get('/api/tasks/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const task = await c.env.DB.prepare(
            'SELECT * FROM tasks WHERE id = ?'
        ).bind(id).first();

        if (!task) {
            return c.json({ error: 'Task not found' }, 404);
        }

        return c.json({
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            createdAt: new Date(task.createdAt as number).toISOString(),
            updatedAt: new Date(task.updatedAt as number).toISOString()
        });
    } catch (error) {
        console.error('Error fetching task:', error);
        return c.json({ error: 'Internal server error' }, 500);
    }
});

app.patch('/api/tasks/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        const data = UpdateTaskSchema.parse(body);

        const updates: string[] = [];
        const values: any[] = [];

        if (data.title) {
            updates.push('title = ?');
            values.push(data.title);
        }
        if (data.description !== undefined) {
            updates.push('description = ?');
            values.push(data.description);
        }
        if (data.status) {
            updates.push('status = ?');
            values.push(data.status);
        }

        updates.push('updatedAt = ?');
        values.push(Date.now());
        values.push(id);

        await c.env.DB.prepare(
            `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`
        ).bind(...values).run();

        const task = await c.env.DB.prepare(
            'SELECT * FROM tasks WHERE id = ?'
        ).bind(id).first();

        if (!task) {
            return c.json({ error: 'Task not found' }, 404);
        }

        return c.json({
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            createdAt: new Date(task.createdAt as number).toISOString(),
            updatedAt: new Date(task.updatedAt as number).toISOString()
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return c.json({ error: 'Validation error', details: error.errors }, 400);
        }
        console.error('Error updating task:', error);
        return c.json({ error: 'Task not found' }, 404);
    }
});

app.delete('/api/tasks/:id', async (c) => {
    try {
        const id = c.req.param('id');
        await c.env.DB.prepare(
            'DELETE FROM tasks WHERE id = ?'
        ).bind(id).run();

        return c.body(null, 204);
    } catch (error) {
        console.error('Error deleting task:', error);
        return c.json({ error: 'Task not found' }, 404);
    }
});

export default app;
