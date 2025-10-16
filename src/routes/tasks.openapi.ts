import { createRoute, z } from '@hono/zod-openapi';

const TaskStatusEnum = z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']);

const TaskSchema = z.object({
    id: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    title: z.string().min(1).openapi({ example: 'Completar desafío técnico' }),
    description: z.string().nullable().openapi({ example: 'Implementar API REST con TypeScript' }),
    status: TaskStatusEnum.openapi({ example: 'PENDING' }),
    createdAt: z.string().datetime().openapi({ example: '2024-10-16T15:30:00.000Z' }),
    updatedAt: z.string().datetime().openapi({ example: '2024-10-16T15:30:00.000Z' })
});

const CreateTaskSchema = z.object({
    title: z.string().min(1).openapi({
        example: 'Nueva tarea',
        description: 'Título de la tarea (requerido)'
    }),
    description: z.string().optional().openapi({
        example: 'Descripción detallada de la tarea',
        description: 'Descripción opcional de la tarea'
    }),
    status: TaskStatusEnum.optional().openapi({
        example: 'PENDING',
        description: 'Estado inicial de la tarea (por defecto: PENDING)'
    })
});

const UpdateTaskSchema = z.object({
    title: z.string().min(1).optional().openapi({ example: 'Tarea actualizada' }),
    description: z.string().optional().openapi({ example: 'Nueva descripción' }),
    status: TaskStatusEnum.optional().openapi({ example: 'IN_PROGRESS' })
});

const ErrorSchema = z.object({
    error: z.string().openapi({ example: 'Task not found' }),
    details: z.any().optional()
});

export const listTasksRoute = createRoute({
    method: 'get',
    path: '/api/tasks',
    tags: ['Tasks'],
    summary: 'Listar todas las tareas',
    description: 'Obtiene un listado de todas las tareas ordenadas por fecha de creación (más recientes primero)',
    responses: {
        200: {
            description: 'Lista de tareas obtenida exitosamente',
            content: {
                'application/json': {
                    schema: z.array(TaskSchema)
                }
            }
        },
        500: {
            description: 'Error interno del servidor',
            content: {
                'application/json': {
                    schema: ErrorSchema
                }
            }
        }
    }
});

export const getTaskRoute = createRoute({
    method: 'get',
    path: '/api/tasks/{id}',
    tags: ['Tasks'],
    summary: 'Obtener tarea por ID',
    description: 'Obtiene los detalles de una tarea específica mediante su ID',
    request: {
        params: z.object({
            id: z.string().uuid().openapi({
                param: { name: 'id', in: 'path' },
                example: '123e4567-e89b-12d3-a456-426614174000'
            })
        })
    },
    responses: {
        200: {
            description: 'Tarea encontrada',
            content: {
                'application/json': {
                    schema: TaskSchema
                }
            }
        },
        404: {
            description: 'Tarea no encontrada',
            content: {
                'application/json': {
                    schema: ErrorSchema
                }
            }
        },
        500: {
            description: 'Error interno del servidor',
            content: {
                'application/json': {
                    schema: ErrorSchema
                }
            }
        }
    }
});

export const createTaskRoute = createRoute({
    method: 'post',
    path: '/api/tasks',
    tags: ['Tasks'],
    summary: 'Crear nueva tarea',
    description: 'Crea una nueva tarea con el título, descripción y estado especificados',
    request: {
        body: {
            description: 'Datos de la tarea a crear',
            content: {
                'application/json': {
                    schema: CreateTaskSchema
                }
            }
        }
    },
    responses: {
        201: {
            description: 'Tarea creada exitosamente',
            content: {
                'application/json': {
                    schema: TaskSchema
                }
            }
        },
        400: {
            description: 'Error de validación',
            content: {
                'application/json': {
                    schema: ErrorSchema
                }
            }
        },
        500: {
            description: 'Error interno del servidor',
            content: {
                'application/json': {
                    schema: ErrorSchema
                }
            }
        }
    }
});

export const updateTaskRoute = createRoute({
    method: 'patch',
    path: '/api/tasks/{id}',
    tags: ['Tasks'],
    summary: 'Actualizar tarea',
    description: 'Actualiza uno o más campos de una tarea existente',
    request: {
        params: z.object({
            id: z.string().uuid().openapi({
                param: { name: 'id', in: 'path' },
                example: '123e4567-e89b-12d3-a456-426614174000'
            })
        }),
        body: {
            description: 'Campos a actualizar',
            content: {
                'application/json': {
                    schema: UpdateTaskSchema
                }
            }
        }
    },
    responses: {
        200: {
            description: 'Tarea actualizada exitosamente',
            content: {
                'application/json': {
                    schema: TaskSchema
                }
            }
        },
        400: {
            description: 'Error de validación',
            content: {
                'application/json': {
                    schema: ErrorSchema
                }
            }
        },
        404: {
            description: 'Tarea no encontrada',
            content: {
                'application/json': {
                    schema: ErrorSchema
                }
            }
        },
        500: {
            description: 'Error interno del servidor',
            content: {
                'application/json': {
                    schema: ErrorSchema
                }
            }
        }
    }
});

export const deleteTaskRoute = createRoute({
    method: 'delete',
    path: '/api/tasks/{id}',
    tags: ['Tasks'],
    summary: 'Eliminar tarea',
    description: 'Elimina permanentemente una tarea del sistema',
    request: {
        params: z.object({
            id: z.string().uuid().openapi({
                param: { name: 'id', in: 'path' },
                example: '123e4567-e89b-12d3-a456-426614174000'
            })
        })
    },
    responses: {
        204: {
            description: 'Tarea eliminada exitosamente'
        },
        404: {
            description: 'Tarea no encontrada',
            content: {
                'application/json': {
                    schema: ErrorSchema
                }
            }
        },
        500: {
            description: 'Error interno del servidor',
            content: {
                'application/json': {
                    schema: ErrorSchema
                }
            }
        }
    }
});

