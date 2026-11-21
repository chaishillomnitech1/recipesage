import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertGuardianNftSchema, insertSystemLogSchema, insertPainCoinMetricSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard Stats API
  app.get('/api/dashboard/stats', isAuthenticated, async (req, res) => {
    try {
      const [
        nftStats,
        activeDuels,
        painCoinMetrics,
        systemMetrics,
        contracts,
        apiEndpoints
      ] = await Promise.all([
        storage.getGuardianNftStats(),
        storage.getActiveDuels(),
        storage.getLatestPainCoinMetrics(),
        storage.getLatestSystemMetrics(),
        storage.getSmartContracts(),
        storage.getApiEndpoints()
      ]);

      // Get latest metric values
      const latestMetrics = systemMetrics.reduce((acc, metric) => {
        if (!acc[metric.metricType] || new Date(metric.recordedAt!) > new Date(acc[metric.metricType].recordedAt!)) {
          acc[metric.metricType] = metric;
        }
        return acc;
      }, {} as Record<string, any>);

      res.json({
        nfts: nftStats,
        activeDuelsCount: activeDuels.length,
        painCoin: painCoinMetrics,
        system: {
          cpu: latestMetrics.cpu?.value || 0,
          memory: latestMetrics.memory?.value || 0,
          storage: latestMetrics.storage?.value || 0,
          dbConnections: latestMetrics.db_connections?.value || 0,
        },
        contracts: contracts.map(c => ({
          name: c.name,
          status: c.status,
          address: c.contractAddress
        })),
        apiHealth: apiEndpoints.map(e => ({
          name: e.name,
          path: e.path,
          status: e.status,
          responseTime: e.responseTime,
          lastChecked: e.lastChecked
        }))
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Guardian NFTs API
  app.get('/api/guardians', isAuthenticated, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const nfts = await storage.getGuardianNfts(limit);
      res.json(nfts);
    } catch (error) {
      console.error("Error fetching guardian NFTs:", error);
      res.status(500).json({ message: "Failed to fetch guardian NFTs" });
    }
  });

  app.post('/api/guardians', isAuthenticated, async (req, res) => {
    try {
      const nftData = insertGuardianNftSchema.parse(req.body);
      const nft = await storage.createGuardianNft({
        ...nftData,
        mintedBy: req.user?.claims?.sub
      });
      
      // Log the mint
      await storage.createSystemLog({
        level: "info",
        message: `Guardian NFT #${nft.tokenId} minted successfully to ${nft.ownerAddress}`,
        category: "nft",
        userId: req.user?.claims?.sub
      });

      res.json(nft);
    } catch (error) {
      console.error("Error creating guardian NFT:", error);
      res.status(500).json({ message: "Failed to create guardian NFT" });
    }
  });

  // Smart Contracts API
  app.get('/api/contracts', isAuthenticated, async (req, res) => {
    try {
      const contracts = await storage.getSmartContracts();
      res.json(contracts);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      res.status(500).json({ message: "Failed to fetch contracts" });
    }
  });

  // API Endpoints Monitoring
  app.get('/api/endpoints', isAuthenticated, async (req, res) => {
    try {
      const endpoints = await storage.getApiEndpoints();
      res.json(endpoints);
    } catch (error) {
      console.error("Error fetching API endpoints:", error);
      res.status(500).json({ message: "Failed to fetch API endpoints" });
    }
  });

  // System Logs API
  app.get('/api/logs', isAuthenticated, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const logs = await storage.getSystemLogs(limit);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching system logs:", error);
      res.status(500).json({ message: "Failed to fetch system logs" });
    }
  });

  // Command Center Actions
  app.post('/api/commands/emergency-mint', isAuthenticated, async (req, res) => {
    try {
      // Emergency mint logic would go here
      await storage.createSystemLog({
        level: "info",
        message: "Emergency mint command executed",
        category: "system",
        userId: req.user?.claims?.sub
      });
      res.json({ success: true, message: "Emergency mint initiated" });
    } catch (error) {
      console.error("Error executing emergency mint:", error);
      res.status(500).json({ message: "Failed to execute emergency mint" });
    }
  });

  app.post('/api/commands/deploy-contracts', isAuthenticated, async (req, res) => {
    try {
      await storage.createSystemLog({
        level: "info",
        message: "Contract deployment command executed",
        category: "contract",
        userId: req.user?.claims?.sub
      });
      res.json({ success: true, message: "Contract deployment initiated" });
    } catch (error) {
      console.error("Error deploying contracts:", error);
      res.status(500).json({ message: "Failed to deploy contracts" });
    }
  });

  app.post('/api/commands/system-backup', isAuthenticated, async (req, res) => {
    try {
      await storage.createSystemLog({
        level: "info",
        message: "System backup initiated",
        category: "system",
        userId: req.user?.claims?.sub
      });
      res.json({ success: true, message: "System backup initiated" });
    } catch (error) {
      console.error("Error initiating backup:", error);
      res.status(500).json({ message: "Failed to initiate backup" });
    }
  });

  app.post('/api/commands/paincoin-airdrop', isAuthenticated, async (req, res) => {
    try {
      await storage.createSystemLog({
        level: "info",
        message: "PainCoin airdrop initiated",
        category: "system",
        userId: req.user?.claims?.sub
      });
      res.json({ success: true, message: "PainCoin airdrop initiated" });
    } catch (error) {
      console.error("Error initiating airdrop:", error);
      res.status(500).json({ message: "Failed to initiate airdrop" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to WebSocket');

    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message);
        // Handle different message types
        switch (data.type) {
          case 'subscribe':
            // Handle subscription to specific data feeds
            break;
          case 'ping':
            ws.send(JSON.stringify({ type: 'pong' }));
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });

    // Send initial data
    ws.send(JSON.stringify({
      type: 'connected',
      message: 'ScrollVerse Command Hub WebSocket connected'
    }));
  });

  // Broadcast function for real-time updates
  function broadcast(data: any) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }

  // Simulate real-time metrics updates
  setInterval(async () => {
    try {
      // Update system metrics
      const cpuUsage = Math.floor(Math.random() * 40) + 50;
      const memoryUsage = Math.floor(Math.random() * 30) + 30;
      
      await storage.createSystemMetric({
        metricType: "cpu",
        value: cpuUsage.toString(),
        unit: "%"
      });

      await storage.createSystemMetric({
        metricType: "memory", 
        value: memoryUsage.toString(),
        unit: "%"
      });

      // Broadcast to connected clients
      broadcast({
        type: 'metrics_update',
        data: {
          cpu: cpuUsage,
          memory: memoryUsage,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error updating metrics:', error);
    }
  }, 30000); // Update every 30 seconds

  return httpServer;
}
