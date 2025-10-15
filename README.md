# Elit Task Manager Backend
### Todo funciona en [elit-taskmanager.pfeifferf.com](https://elit-taskmanager.pfeifferf.com/)

API REST para gestión de tareas desplegada en Cloudflare Workers con D1 Database (SQLite serverless).


## Tecnologías

- **Cloudflare Workers** - Serverless edge computing
- **D1 Database** - SQLite serverless de Cloudflare
- **Hono** - Framework web ultrarrápido para edge
- **TypeScript** - Tipado estático
- **Zod** - Validación de schemas

## Estructura del Proyecto
```
task-manager-backend/
├── src/
│   ├── types/
│   │   └── task.types.ts      # Tipos y validaciones con Zod
│   └── index.ts               # API endpoints con Hono
├── migrations/
│   └── 0001_initial.sql       # Schema de la base de datos
├── wrangler.toml              # Configuración de Cloudflare
├── package.json
├── tsconfig.json
└── README.md
```

Tu API estará disponible en: `https://elit-taskmanager-api.tu-usuario.workers.dev`

## API Endpoints

### Base URL (Producción)
```
https://elit-taskmanager-api.elit-taskmanager.workers.dev
```

### Endpoints

#### `GET /`
Información de la API

**Response:**
```json
{
  "message": "Task Manager API - Cloudflare Workers",
  "version": "1.0.0",
  "endpoints": {
    "tasks": "/api/tasks"
  }
}
```

#### `POST /api/tasks`
Crear nueva tarea

**Request:**
```json
{
  "title": "Mi tarea",
  "description": "Descripción opcional",
  "status": "PENDING"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "title": "Mi tarea",
  "description": "Descripción opcional",
  "status": "PENDING",
  "createdAt": "2024-10-14T20:00:00.000Z",
  "updatedAt": "2024-10-14T20:00:00.000Z"
}
```

#### `GET /api/tasks`
Listar todas las tareas

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "title": "Mi tarea",
    "description": "Descripción",
    "status": "IN_PROGRESS",
    "createdAt": "2024-10-14T20:00:00.000Z",
    "updatedAt": "2024-10-14T20:30:00.000Z"
  }
]
```

#### `GET /api/tasks/:id`
Obtener tarea por ID

**Response:** `200 OK` | `404 Not Found`

#### `PATCH /api/tasks/:id`
Actualizar tarea

**Request:**
```json
{
  "status": "COMPLETED"
}
```

**Response:** `200 OK` | `404 Not Found`

#### `DELETE /api/tasks/:id`
Eliminar tarea

**Response:** `204 No Content` | `404 Not Found`

## Estados de Tarea

| Estado | Descripción |
|--------|-------------|
| `PENDING` | Tarea pendiente |
| `IN_PROGRESS` | Tarea en progreso |
| `COMPLETED` | Tarea completada |


## Base de Datos

La base de datos D1 se crea automáticamente en Cloudflare.

**Schema:**
```sql
CREATE TABLE tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING',
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL
);
```
## Testing

### Probar endpoint principal
```bash
curl https://elit-taskmanager-api.elit-taskmanager.workers.dev
```

### Crear tarea
```bash
curl -X POST https://elit-taskmanager-api.elit-taskmanager.workers.dev/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","status":"PENDING"}'
```

### Listar tareas
```bash
curl https://elit-taskmanager-api.elit-taskmanager.workers.dev/api/tasks
```

## Ventajas de esta Stack

- **Gratis**: 100,000 requests/día sin costo
- **Zero cold starts**: Respuesta instantánea
- **Global**: Deploy en edge, cerca de tus usuarios
- **Escalable**: Automáticamente sin configuración
- **Simple**: No necesitás gestionar servidores ni BD

## Decisiones Técnicas

**¿Por qué Cloudflare Workers?**
- Serverless edge computing con latencia ultra baja
- Gratis para siempre en tier básico
- Deploy global automático

**¿Por qué D1?**
- Base de datos SQLite serverless incluida
- No necesitás servidor de BD externo
- Gratis hasta 5 GB de almacenamiento

**¿Por qué Hono en vez de Express?**
- Diseñado específicamente para edge runtimes
- Más rápido y ligero
- API similar a Express

**¿Por qué D1 nativo en vez de Prisma?**
- Prisma tiene problemas de compatibilidad con Workers
- D1 nativo es más simple y no tiene cold starts
- Mejor performance en edge

**Deployado en:** https://elit-taskmanager-api.elit-taskmanager.workers.dev
