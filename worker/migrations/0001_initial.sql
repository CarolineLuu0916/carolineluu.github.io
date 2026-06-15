-- MY App 世界状态数据库初始结构

-- 全局世界状态（始终只有 id=1 这一行）
CREATE TABLE IF NOT EXISTS world (
  id          INTEGER PRIMARY KEY DEFAULT 1,
  day         INTEGER NOT NULL DEFAULT 1,
  version     TEXT    NOT NULL DEFAULT 'v1.0',
  start_date  TEXT    NOT NULL DEFAULT (date('now')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);
INSERT OR IGNORE INTO world (id, day, version) VALUES (1, 1, 'v1.0');

-- 每天结束时生成的用户评价
CREATE TABLE IF NOT EXISTS reviews (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  day        INTEGER NOT NULL,
  stars      INTEGER NOT NULL,
  content    TEXT    NOT NULL,
  keep       INTEGER NOT NULL DEFAULT 0,
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_reviews_day ON reviews(day);

-- 版本发布历史
CREATE TABLE IF NOT EXISTS versions (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  v           TEXT NOT NULL,
  day         INTEGER NOT NULL,
  changelog   TEXT,
  minutes     TEXT,
  released_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 私人 Agent 对话记忆（持久，跨会话）
CREATE TABLE IF NOT EXISTS agent_memory (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  role       TEXT NOT NULL,
  content    TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_memory_created ON agent_memory(created_at);
