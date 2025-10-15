import { PrismaClient } from '@prisma/client';
import { CreateTaskDTO, UpdateTaskDTO } from '../types/task.types';

export class TaskService {
    constructor(private prisma: PrismaClient) {}

    async createTask(data: CreateTaskDTO) {
        return await this.prisma.task.create({
            data: {
                title: data.title,
                description: data.description,
                status: data.status || 'PENDING'
            }
        });
    }

    async getAllTasks() {
        return await this.prisma.task.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async getTaskById(id: string) {
        return await this.prisma.task.findUnique({
            where: { id }
        });
    }

    async updateTask(id: string, data: UpdateTaskDTO) {
        return await this.prisma.task.update({
            where: { id },
            data
        });
    }

    async deleteTask(id: string) {
        return await this.prisma.task.delete({
            where: { id }
        });
    }
}
