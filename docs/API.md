# Task Manager API - Documentación

## Base URL

**Producción:** `https://elit-taskmanager-api.pfeifferf.workers.dev`
**Desarrollo:** `http://localhost:8787`

## Documentación Interactiva

- **Swagger UI:** [https://elit-taskmanager-api.pfeifferf.workers.dev/swagger](https://elit-taskmanager-api.pfeifferf.workers.dev/swagger)
- **OpenAPI JSON:** [https://elit-taskmanager-api.pfeifferf.workers.dev/doc](https://elit-taskmanager-api.pfeifferf.workers.dev/doc)

## Endpoints

### Health Check

#### `GET /`
Obtiene información general de la API.

**Response 200:**
```json
{
  "message": "Task Manager API - Cloudflare Workers",
  "version": "1.0.0",
  "endpoints": {
    "tasks": "/api/tasks"
  }
}
```

---

### Tasks

#### `GET /api/tasks`
Lista todas las tareas.

**Response 200:**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Completar desafío técnico",
    "description": "Implementar API REST con TypeScript",
    "status": "PENDING",
    "createdAt": "2024-10-16T15:30:00.000Z",
    "updatedAt": "2024-10-16T15:30:00.000Z"
  }
]
```

---

#### `GET /api/tasks/:id`
Obtiene una tarea por ID.

**Path Parameters:**
- `id` (string, uuid): ID de la tarea

**Response 200:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Completar desafío técnico",
  "description": "Implementar API REST con TypeScript",
  "status": "IN_PROGRESS",
  "createdAt": "2024-10-16T15:30:00.000Z",
  "updatedAt": "2024-10-16T16:00:00.000Z"
}
```

**Response 404:**
```json
{
  "error": "Task not found"
}
```

---

#### `POST /api/tasks`
Crea una nueva tarea.

**Request Body:**
```json
{
  "title": "Nueva tarea",
  "description": "Descripción opcional",
  "status": "PENDING"
}
```

**Response 201:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Nueva tarea",
  "description": "Descripción opcional",
  "status": "PENDING",
  "createdAt": "2024-10-16T15:30:00.000Z",
  "updatedAt": "2024-10-16T15:30:00.000Z"
}
```

**Response 400:**
```json
{
  "error": "Validation error",
  "details": [...]
}
```

---

#### `PATCH /api/tasks/:id`
Actualiza una tarea existente.

**Path Parameters:**
- `id` (string, uuid): ID de la tarea

**Request Body (todos los campos son opcionales):**
```json
{
  "title": "Título actualizado",
  "description": "Nueva descripción",
  "status": "COMPLETED"
}
```

**Response 200:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Título actualizado",
  "description": "Nueva descripción",
  "status": "COMPLETED",
  "createdAt": "2024-10-16T15:30:00.000Z",
  "updatedAt": "2024-10-16T17:00:00.000Z"
}
```

---

#### `DELETE /api/tasks/:id`
Elimina una tarea.

**Path Parameters:**
- `id` (string, uuid): ID de la tarea

**Response 204:** Sin contenido (éxito)

**Response 404:**
```json
{
  "error": "Task not found"
}
```

---

## Estados de Tarea

| Estado | Descripción |
|--------|-------------|
| `PENDING` | Tarea pendiente por iniciar |
| `IN_PROGRESS` | Tarea en progreso |
| `COMPLETED` | Tarea completada |

---

## Ejemplos con cURL

### Crear tarea
```bash
curl -X POST https://elit-taskmanager-api.pfeifferf.workers.dev/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mi tarea",
    "status": "PENDING"
  }'
```

### Listar tareas
```bash
curl https://elit-taskmanager-api.pfeifferf.workers.dev/api/tasks
```

### Actualizar estado
```bash
curl -X PATCH https://elit-taskmanager-api.pfeifferf.workers.dev/api/tasks/ID \
  -H "Content-Type: application/json" \
  -d '{"status": "COMPLETED"}'
```

---

## Códigos de Error

| Código | Descripción |
|--------|-------------|
| 200 | Éxito |
| 201 | Recurso creado |
| 204 | Éxito sin contenido |
| 400 | Error de validación |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |
