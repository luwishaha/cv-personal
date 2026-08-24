import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// TODO: Add your tables here. See docs/Database.md for schema examples and patterns.
//
// Example:
// export const posts = mysqlTable("posts", {
//   id: serial("id").primaryKey(),
//   title: varchar("title", { length: 255 }).notNull(),
//   content: text("content"),
//   createdAt: timestamp("created_at").notNull().defaultNow(),
// });
//
// Note: FK columns referencing a serial() PK must use:
//   bigint("columnName", { mode: "number", unsigned: true }).notNull()

// ---------------- AskMe ----------------

export const conversations = mysqlTable("conversations", {
  id: serial("id").primaryKey(),
  sessionId: varchar("sessionId", { length: 64 }).notNull(),
  visitorLabel: varchar("visitorLabel", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const messages = mysqlTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: bigint("conversationId", {
    mode: "number",
    unsigned: true,
  }).notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  // JSON array of source labels, e.g. ["CASE 02", "经历·OPPO"]
  sources: text("sources"),
  // whether the answer hit the knowledge base
  matched: mysqlEnum("matched", ["yes", "no"]).default("no").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const knowledgeItems = mysqlTable("knowledge_items", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 64 }).default("通用").notNull(),
  content: text("content").notNull(),
  keywords: varchar("keywords", { length: 512 }).default("").notNull(),
  enabled: mysqlEnum("enabled", ["yes", "no"]).default("yes").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const evidenceFiles = mysqlTable("evidence_files", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  fileType: varchar("fileType", { length: 32 }).default("md").notNull(),
  // text content of the evidence (markdown / plain text)
  content: text("content"),
  note: varchar("note", { length: 255 }).default("").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const llmSettings = mysqlTable("llm_settings", {
  id: serial("id").primaryKey(),
  provider: varchar("provider", { length: 64 }).default("openai-compatible").notNull(),
  apiBase: varchar("apiBase", { length: 512 }).default("").notNull(),
  apiKey: varchar("apiKey", { length: 512 }).default("").notNull(),
  model: varchar("model", { length: 128 }).default("").notNull(),
  temperature: varchar("temperature", { length: 16 }).default("0.3").notNull(),
  enabled: mysqlEnum("enabled", ["yes", "no"]).default("no").notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// 管理后台独立密钥（不使用 Kimi 登录；仅存 SHA-256 哈希，单行表）
export const adminKeys = mysqlTable("admin_keys", {
  id: serial("id").primaryKey(),
  keyHash: varchar("keyHash", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type KnowledgeItem = typeof knowledgeItems.$inferSelect;
export type EvidenceFile = typeof evidenceFiles.$inferSelect;
export type LlmSetting = typeof llmSettings.$inferSelect;
export type AdminKey = typeof adminKeys.$inferSelect;
