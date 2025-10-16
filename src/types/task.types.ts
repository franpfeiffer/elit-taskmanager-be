import { z } from 'zod';

export const StatusEnum = z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']);

export const CreateTaskSchema = z.object({
    title: z.string().min(1, 'Title is required').trim(),
    description: z.string().optional(),
    status: StatusEnum.optional()
});

export const UpdateTaskSchema = z.object({
    title: z.string().min(1).trim().optional(),
    description: z.string().optional(),
    status: StatusEnum.optional()
}).refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided'
});

export type CreateTaskDTO = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskDTO = z.infer<typeof UpdateTaskSchema>;
export type TaskStatus = z.infer<typeof StatusEnum>;

