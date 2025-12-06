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
    let browserInitialized = false;
    let serverStarted = false;

    try {
      // Initialize browser first
      this.logger.info('Initializing Playwright browser...');
      await this.playwrightService.initialize();
      browserInitialized = true;
      this.logger.info('Browser initialized successfully');

      // Start WebSocket server
      this.logger.info('Starting WebSocket server...');
      this.wss = new WebSocketServer({
        port: config.server.port,
        host: config.server.host
      });
      serverStarted = true;

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

      // Rollback: Clean up resources based on what was initialized
      if (serverStarted && this.wss) {
        try {
          this.logger.info('Rolling back: Closing WebSocket server...');
          await new Promise((resolve) => this.wss.close(resolve));
        } catch (cleanupError) {
          this.logger.error('Error closing WebSocket server during rollback', cleanupError);
        }
      }

      if (browserInitialized) {
        try {
          this.logger.info('Rolling back: Closing Playwright browser...');
          await this.playwrightService.close();
        } catch (cleanupError) {
          this.logger.error('Error closing browser during rollback', cleanupError);
        }
      }

      process.exit(1);
    }
  }

  /**
   * Gracefully stops the MCP server
   * Notifies clients, closes connections, and cleans up resources
   * @returns {Promise<void>}
   */
  async stop() {
    this.logger.info('Initiating graceful shutdown');

    if (this.wss) {
      // Notify all connected clients
      this.wss.clients.forEach((client) => {
        if (client.readyState === 1) { // WebSocket.OPEN
          try {
            client.send(JSON.stringify({
              jsonrpc: '2.0',
              method: 'server/shutdown',
              params: { reason: 'Server shutting down' }
            }));
          } catch (error) {
            this.logger.error('Error notifying client', error);
          }
        }
      });

      // Close all connections
      this.wss.clients.forEach((client) => {
        try {
          client.close(1000, 'Server shutdown');
        } catch (error) {
          this.logger.error('Error closing client connection', error);
        }
      });

      // Close WebSocket server
      await new Promise((resolve) => {
        this.wss.close(() => {
          this.logger.info('WebSocket server closed');
          resolve();
        });
      });
    }

    // Close Playwright browser
    await this.playwrightService.close();
    this.logger.info('Server shutdown complete');
  }
}

const server = new MCPServer();
server.start();

/**
 * Graceful shutdown handler
 * @param {string} signal - The signal received
 */
const gracefulShutdown = async (signal) => {
  console.log(`\nReceived ${signal}, initiating graceful shutdown...`);
  try {
    await server.stop();
    console.log('Server stopped gracefully');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

// Handle termination signals
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// SIGHUP is not available on Windows, only register on Unix-like systems
if (process.platform !== 'win32') {
  process.on('SIGHUP', () => gracefulShutdown('SIGHUP'));
}

// Handle uncaught exceptions
process.on('uncaughtException', async (error) => {
  console.error('Uncaught exception:', error);
  try {
    await server.stop();
  } catch (stopError) {
    console.error('Error stopping server after uncaught exception:', stopError);
  }
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', async (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
  try {
    await server.stop();
  } catch (stopError) {
    console.error('Error stopping server after unhandled rejection:', stopError);
  }
  process.exit(1);
});