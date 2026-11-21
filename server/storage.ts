import {
  users,
  guardianTiers,
  guardianNfts,
  smartContracts,
  apiEndpoints,
  systemMetrics,
  duels,
  painCoinMetrics,
  systemLogs,
  type User,
  type UpsertUser,
  type GuardianTier,
  type InsertGuardianTier,
  type GuardianNft,
  type InsertGuardianNft,
  type SmartContract,
  type InsertSmartContract,
  type ApiEndpoint,
  type InsertApiEndpoint,
  type SystemMetric,
  type InsertSystemMetric,
  type Duel,
  type InsertDuel,
  type PainCoinMetric,
  type InsertPainCoinMetric,
  type SystemLog,
  type InsertSystemLog,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Guardian Tier operations
  getGuardianTiers(): Promise<GuardianTier[]>;
  createGuardianTier(tier: InsertGuardianTier): Promise<GuardianTier>;

  // Guardian NFT operations
  getGuardianNfts(limit?: number): Promise<GuardianNft[]>;
  getGuardianNftById(id: string): Promise<GuardianNft | undefined>;
  createGuardianNft(nft: InsertGuardianNft): Promise<GuardianNft>;
  getGuardianNftStats(): Promise<{
    total: number;
    omni: number;
    gold: number;
    silver: number;
    bronze: number;
  }>;

  // Smart Contract operations
  getSmartContracts(): Promise<SmartContract[]>;
  createSmartContract(contract: InsertSmartContract): Promise<SmartContract>;
  updateSmartContractStatus(id: string, status: string): Promise<void>;

  // API Endpoint operations
  getApiEndpoints(): Promise<ApiEndpoint[]>;
  createApiEndpoint(endpoint: InsertApiEndpoint): Promise<ApiEndpoint>;
  updateApiEndpointStatus(id: string, status: string, responseTime?: number): Promise<void>;

  // System Metrics operations
  getLatestSystemMetrics(): Promise<SystemMetric[]>;
  createSystemMetric(metric: InsertSystemMetric): Promise<SystemMetric>;

  // Duel operations
  getActiveDuels(): Promise<Duel[]>;
  createDuel(duel: InsertDuel): Promise<Duel>;

  // PainCoin operations
  getLatestPainCoinMetrics(): Promise<PainCoinMetric | undefined>;
  createPainCoinMetric(metric: InsertPainCoinMetric): Promise<PainCoinMetric>;

  // System Logs operations
  getSystemLogs(limit?: number): Promise<SystemLog[]>;
  createSystemLog(log: InsertSystemLog): Promise<SystemLog>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Guardian Tier operations
  async getGuardianTiers(): Promise<GuardianTier[]> {
    return await db.select().from(guardianTiers).orderBy(guardianTiers.level);
  }

  async createGuardianTier(tierData: InsertGuardianTier): Promise<GuardianTier> {
    const [tier] = await db.insert(guardianTiers).values(tierData).returning();
    return tier;
  }

  // Guardian NFT operations
  async getGuardianNfts(limit = 50): Promise<GuardianNft[]> {
    return await db
      .select()
      .from(guardianNfts)
      .orderBy(desc(guardianNfts.mintedAt))
      .limit(limit);
  }

  async getGuardianNftById(id: string): Promise<GuardianNft | undefined> {
    const [nft] = await db.select().from(guardianNfts).where(eq(guardianNfts.id, id));
    return nft;
  }

  async createGuardianNft(nftData: InsertGuardianNft): Promise<GuardianNft> {
    const [nft] = await db.insert(guardianNfts).values(nftData).returning();
    return nft;
  }

  async getGuardianNftStats(): Promise<{
    total: number;
    omni: number;
    gold: number;
    silver: number;
    bronze: number;
  }> {
    const stats = await db
      .select({
        tierName: guardianTiers.name,
        count: count(),
      })
      .from(guardianNfts)
      .leftJoin(guardianTiers, eq(guardianNfts.tierId, guardianTiers.id))
      .where(eq(guardianNfts.isActive, true))
      .groupBy(guardianTiers.name);

    const result = {
      total: 0,
      omni: 0,
      gold: 0,
      silver: 0,
      bronze: 0,
    };

    stats.forEach((stat) => {
      result.total += stat.count;
      if (stat.tierName === "Omni") result.omni = stat.count;
      else if (stat.tierName === "Gold") result.gold = stat.count;
      else if (stat.tierName === "Silver") result.silver = stat.count;
      else if (stat.tierName === "Bronze") result.bronze = stat.count;
    });

    return result;
  }

  // Smart Contract operations
  async getSmartContracts(): Promise<SmartContract[]> {
    return await db
      .select()
      .from(smartContracts)
      .orderBy(desc(smartContracts.createdAt));
  }

  async createSmartContract(contractData: InsertSmartContract): Promise<SmartContract> {
    const [contract] = await db.insert(smartContracts).values(contractData).returning();
    return contract;
  }

  async updateSmartContractStatus(id: string, status: string): Promise<void> {
    await db
      .update(smartContracts)
      .set({ status, updatedAt: new Date() })
      .where(eq(smartContracts.id, id));
  }

  // API Endpoint operations
  async getApiEndpoints(): Promise<ApiEndpoint[]> {
    return await db.select().from(apiEndpoints).orderBy(apiEndpoints.name);
  }

  async createApiEndpoint(endpointData: InsertApiEndpoint): Promise<ApiEndpoint> {
    const [endpoint] = await db.insert(apiEndpoints).values(endpointData).returning();
    return endpoint;
  }

  async updateApiEndpointStatus(
    id: string,
    status: string,
    responseTime?: number
  ): Promise<void> {
    await db
      .update(apiEndpoints)
      .set({
        status,
        responseTime,
        lastChecked: new Date(),
      })
      .where(eq(apiEndpoints.id, id));
  }

  // System Metrics operations
  async getLatestSystemMetrics(): Promise<SystemMetric[]> {
    return await db
      .select()
      .from(systemMetrics)
      .orderBy(desc(systemMetrics.recordedAt))
      .limit(20);
  }

  async createSystemMetric(metricData: InsertSystemMetric): Promise<SystemMetric> {
    const [metric] = await db.insert(systemMetrics).values(metricData).returning();
    return metric;
  }

  // Duel operations
  async getActiveDuels(): Promise<Duel[]> {
    return await db
      .select()
      .from(duels)
      .where(eq(duels.status, "active"))
      .orderBy(desc(duels.startedAt));
  }

  async createDuel(duelData: InsertDuel): Promise<Duel> {
    const [duel] = await db.insert(duels).values(duelData).returning();
    return duel;
  }

  // PainCoin operations
  async getLatestPainCoinMetrics(): Promise<PainCoinMetric | undefined> {
    const [metric] = await db
      .select()
      .from(painCoinMetrics)
      .orderBy(desc(painCoinMetrics.recordedAt))
      .limit(1);
    return metric;
  }

  async createPainCoinMetric(metricData: InsertPainCoinMetric): Promise<PainCoinMetric> {
    const [metric] = await db.insert(painCoinMetrics).values(metricData).returning();
    return metric;
  }

  // System Logs operations
  async getSystemLogs(limit = 50): Promise<SystemLog[]> {
    return await db
      .select()
      .from(systemLogs)
      .orderBy(desc(systemLogs.createdAt))
      .limit(limit);
  }

  async createSystemLog(logData: InsertSystemLog): Promise<SystemLog> {
    const [log] = await db.insert(systemLogs).values(logData).returning();
    return log;
  }
}

export const storage = new DatabaseStorage();
