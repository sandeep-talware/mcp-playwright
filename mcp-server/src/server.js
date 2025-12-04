/**
 * @author Sandeep Talware
 */

import { WebSocketServer } from 'ws';
import { PlaywrightService } from './services/PlaywrightService.js';
import { MCPProtocolService } from './services/MCPProtocolService.js';
import { MCPController } from './controllers/MCPController.js';
import { Logger } from './utils/logger.js';
import { config } from './config/config.js';

class MCPServer {
  constructor() {
    this.logger = new Logger('MCPServer');
    this.playwrightService = new PlaywrightService();
    this.mcpProtocolService = new MCPProtocolService(this.playwrightService);
    this.mcpController = new MCPController(this.mcpProtocolService);
  }

  async start() {
    try {
      await this.playwrightService.initialize();
      
      this.wss = new WebSocketServer({ 
        port: config.server.port,
        host: config.server.host
      });

      this.wss.on('connection', (ws) => {
        this.logger.info('Client connected');

        ws.on('message', (message) => {
          this.mcpController.handleMessage(ws, message.toString());
        });

        ws.on('close', () => {
          this.logger.info('Client disconnected');
        });

        ws.on('error', (error) => {
          this.logger.error('WebSocket error', error);
        });
      });

      this.logger.info(`MCP Server started on ${config.server.host}:${config.server.port}`);
    } catch (error) {
      this.logger.error('Failed to start server', error);
      process.exit(1);
    }
  }

  async stop() {
    this.logger.info('Shutting down server');
    if (this.wss) {
      this.wss.close();
    }
    await this.playwrightService.close();
  }
}

const server = new MCPServer();
server.start();

process.on('SIGINT', async () => {
  await server.stop();
  process.exit(0);
});
