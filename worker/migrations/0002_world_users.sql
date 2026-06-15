-- 世界持久化:每位虚拟用户的专属数据 + 与 MY 的互动记忆

-- 每位虚拟用户的专属手机数据(simData 产物 + 演进状态),继续世界时还原
CREATE TABLE IF NOT EXISTS user_state (
  uid        TEXT PRIMARY KEY,
  name       TEXT,
  data       TEXT,                       -- JSON: {car, wechat, alipay, calendar, ...}
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 每位用户与 TA 手机里 MY 的真实互动记录(世界运行产生)
-- = 看板「心声」与「手机聊天」的同一份数据源,跨刷新/跨设备连贯
CREATE TABLE IF NOT EXISTS world_mem (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  uid        TEXT    NOT NULL,
  day        INTEGER NOT NULL DEFAULT 1,
  thought    TEXT,                        -- 用户内心独白
  user_msg   TEXT,                        -- 用户对 MY 说的话
  my_reply   TEXT,                        -- MY 的回应 / 行动
  relief     TEXT,                        -- 用户对结果的反应
  ok         INTEGER NOT NULL DEFAULT 1,
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_worldmem_uid ON world_mem(uid, id);
