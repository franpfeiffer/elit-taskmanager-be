CREATE TABLE tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED')),
    createdAt INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
    updatedAt INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
);

CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_created_at ON tasks(createdAt DESC);
