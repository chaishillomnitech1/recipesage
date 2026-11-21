import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  integer,
  decimal,
  text,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("user"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Guardian NFT tiers
export const guardianTiers = pgTable("guardian_tiers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(), // "Omni", "Gold", "Silver", "Bronze"
  level: integer("level").notNull(), // 1=Omni, 2=Gold, 3=Silver, 4=Bronze
  maxSupply: integer("max_supply"),
  mintPrice: decimal("mint_price", { precision: 18, scale: 8 }),
  color: varchar("color").notNull(), // for UI display
  createdAt: timestamp("created_at").defaultNow(),
});

// Guardian NFTs
export const guardianNfts = pgTable("guardian_nfts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tokenId: integer("token_id").notNull().unique(),
  tierId: varchar("tier_id").references(() => guardianTiers.id),
  ownerAddress: varchar("owner_address").notNull(),
  mintedBy: varchar("minted_by").references(() => users.id),
  transactionHash: varchar("transaction_hash"),
  metadataUri: text("metadata_uri"),
  isActive: boolean("is_active").default(true),
  mintedAt: timestamp("minted_at").defaultNow(),
});

// Smart Contracts
export const smartContracts = pgTable("smart_contracts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  contractAddress: varchar("contract_address"),
  networkId: integer("network_id").notNull(),
  abi: jsonb("abi"),
  status: varchar("status").notNull().default("pending"), // "pending", "deploying", "active", "failed"
  deployedBy: varchar("deployed_by").references(() => users.id),
  gasUsed: varchar("gas_used"),
  deploymentTx: varchar("deployment_tx"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// API Endpoints for monitoring
export const apiEndpoints = pgTable("api_endpoints", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  path: varchar("path").notNull(),
  method: varchar("method").notNull().default("GET"),
  status: varchar("status").notNull().default("healthy"), // "healthy", "warning", "error"
  responseTime: integer("response_time"), // in milliseconds
  lastChecked: timestamp("last_checked"),
  uptime: decimal("uptime", { precision: 5, scale: 2 }).default("100"), // percentage
  createdAt: timestamp("created_at").defaultNow(),
});

// System Metrics
export const systemMetrics = pgTable("system_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  metricType: varchar("metric_type").notNull(), // "cpu", "memory", "storage", "db_connections"
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  unit: varchar("unit").notNull(), // "%", "MB", "GB", "count"
  recordedAt: timestamp("recorded_at").defaultNow(),
});

// Duels/Battles
export const duels = pgTable("duels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  challenger: varchar("challenger").references(() => guardianNfts.id),
  opponent: varchar("opponent").references(() => guardianNfts.id),
  status: varchar("status").notNull().default("active"), // "active", "completed", "cancelled"
  winner: varchar("winner").references(() => guardianNfts.id),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// PainCoin tracking
export const painCoinMetrics = pgTable("paincoin_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  totalSupply: decimal("total_supply", { precision: 18, scale: 8 }).notNull(),
  marketCap: decimal("market_cap", { precision: 18, scale: 8 }),
  exchangeRate: decimal("exchange_rate", { precision: 18, scale: 8 }), // vs ETH
  blackStoneNodes: integer("black_stone_nodes").default(0),
  recordedAt: timestamp("recorded_at").defaultNow(),
});

// System Logs
export const systemLogs = pgTable("system_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  level: varchar("level").notNull(), // "info", "warning", "error", "success"
  message: text("message").notNull(),
  category: varchar("category"), // "nft", "contract", "api", "system"
  metadata: jsonb("metadata"),
  userId: varchar("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  guardianNfts: many(guardianNfts),
  deployedContracts: many(smartContracts),
  logs: many(systemLogs),
}));

export const guardianTiersRelations = relations(guardianTiers, ({ many }) => ({
  nfts: many(guardianNfts),
}));

export const guardianNftsRelations = relations(guardianNfts, ({ one, many }) => ({
  tier: one(guardianTiers, {
    fields: [guardianNfts.tierId],
    references: [guardianTiers.id],
  }),
  mintedByUser: one(users, {
    fields: [guardianNfts.mintedBy],
    references: [users.id],
  }),
  challengerDuels: many(duels, { relationName: "challenger" }),
  opponentDuels: many(duels, { relationName: "opponent" }),
  wonDuels: many(duels, { relationName: "winner" }),
}));

export const smartContractsRelations = relations(smartContracts, ({ one }) => ({
  deployedByUser: one(users, {
    fields: [smartContracts.deployedBy],
    references: [users.id],
  }),
}));

export const duelsRelations = relations(duels, ({ one }) => ({
  challengerNft: one(guardianNfts, {
    fields: [duels.challenger],
    references: [guardianNfts.id],
    relationName: "challenger",
  }),
  opponentNft: one(guardianNfts, {
    fields: [duels.opponent],
    references: [guardianNfts.id],
    relationName: "opponent",
  }),
  winnerNft: one(guardianNfts, {
    fields: [duels.winner],
    references: [guardianNfts.id],
    relationName: "winner",
  }),
}));

export const systemLogsRelations = relations(systemLogs, ({ one }) => ({
  user: one(users, {
    fields: [systemLogs.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGuardianTierSchema = createInsertSchema(guardianTiers).omit({
  id: true,
  createdAt: true,
});

export const insertGuardianNftSchema = createInsertSchema(guardianNfts).omit({
  id: true,
  mintedAt: true,
});

export const insertSmartContractSchema = createInsertSchema(smartContracts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertApiEndpointSchema = createInsertSchema(apiEndpoints).omit({
  id: true,
  createdAt: true,
});

export const insertSystemMetricSchema = createInsertSchema(systemMetrics).omit({
  id: true,
  recordedAt: true,
});

export const insertDuelSchema = createInsertSchema(duels).omit({
  id: true,
  startedAt: true,
});

export const insertPainCoinMetricSchema = createInsertSchema(painCoinMetrics).omit({
  id: true,
  recordedAt: true,
});

export const insertSystemLogSchema = createInsertSchema(systemLogs).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type GuardianTier = typeof guardianTiers.$inferSelect;
export type InsertGuardianTier = z.infer<typeof insertGuardianTierSchema>;
export type GuardianNft = typeof guardianNfts.$inferSelect;
export type InsertGuardianNft = z.infer<typeof insertGuardianNftSchema>;
export type SmartContract = typeof smartContracts.$inferSelect;
export type InsertSmartContract = z.infer<typeof insertSmartContractSchema>;
export type ApiEndpoint = typeof apiEndpoints.$inferSelect;
export type InsertApiEndpoint = z.infer<typeof insertApiEndpointSchema>;
export type SystemMetric = typeof systemMetrics.$inferSelect;
export type InsertSystemMetric = z.infer<typeof insertSystemMetricSchema>;
export type Duel = typeof duels.$inferSelect;
export type InsertDuel = z.infer<typeof insertDuelSchema>;
export type PainCoinMetric = typeof painCoinMetrics.$inferSelect;
export type InsertPainCoinMetric = z.infer<typeof insertPainCoinMetricSchema>;
export type SystemLog = typeof systemLogs.$inferSelect;
export type InsertSystemLog = z.infer<typeof insertSystemLogSchema>;
