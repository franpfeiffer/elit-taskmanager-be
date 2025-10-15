import { Context } from 'hono';
import { TaskService } from '../services/task.service';
import { CreateTaskSchema, UpdateTaskSchema } from '../types/task.types';
import { ZodError } from 'zod';

export class TaskController {
    constructor(private taskService: TaskService) {}

    async create(c: Context) {
        try {
            const body = await c.req.json();
            const validatedData = CreateTaskSchema.parse(body);
            const task = await this.taskService.createTask(validatedData);
            return c.json(task, 201);
        } catch (error) {
            if (error instanceof ZodError) {
                return c.json({ error: 'Validation error', details: error.errors }, 400);
            }
            console.error('Error creating task:', error);
            return c.json({ error: 'Internal server error' }, 500);
        }
    }

    async getAll(c: Context) {
        try {
            const tasks = await this.taskService.getAllTasks();
            return c.json(tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            return c.json({ error: 'Internal server error' }, 500);
        }
    }

    async getById(c: Context) {
        try {
            const id = c.req.param('id');
            const task = await this.taskService.getTaskById(id);

            if (!task) {
                return c.json({ error: 'Task not found' }, 404);
            }

            return c.json(task);
        } catch (error) {
            console.error('Error fetching task:', error);
            return c.json({ error: 'Internal server error' }, 500);
        }
    }

    async update(c: Context) {
        try {
            const id = c.req.param('id');
            const body = await c.req.json();
            const validatedData = UpdateTaskSchema.parse(body);

            const task = await this.taskService.updateTask(id, validatedData);
            return c.json(task);
        } catch (error) {
            if (error instanceof ZodError) {
                return c.json({ error: 'Validation error', details: error.errors }, 400);
            }
            console.error('Error updating task:', error);
            return c.json({ error: 'Task not found' }, 404);
        }
    }

    async delete(c: Context) {
        try {
            const id = c.req.param('id');
            await this.taskService.deleteTask(id);
            return c.body(null, 204);
        } catch (error) {
            console.error('Error deleting task:', error);
            return c.json({ error: 'Task not found' }, 404);
        }
    }
}
