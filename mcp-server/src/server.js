/**
 * @author Sandeep Talware
 */

import 'dotenv/config';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { randomUUID } from 'crypto';
import { PlaywrightService } from './services/PlaywrightService.js';
import { SessionManager } from './services/SessionManager.js';
import { MCPProtocolService } from './services/MCPProtocolService.js';
import { MCPController } from './controllers/MCPController.js';
import { Logger } from './utils/logger.js';
import { config } from './config/config.js';

class MCPServer {
  constructor() {
    this.logger = new Logger('MCPServer');
    this.playwrightService = new PlaywrightService();
    this.sessionManager = new SessionManager(this.playwrightService);

    // Dedicated controller for HTTP interactions
    this.httpController = null;
    this.httpSessionId = 'http-defaults';
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

      // Initialize defaults for HTTP session
      const httpSession = await this.sessionManager.createSession(this.httpSessionId);
      const httpProtocol = new MCPProtocolService(httpSession);
      this.httpController = new MCPController(httpProtocol);

      // Create HTTP Server
      this.logger.info('Starting HTTP server...');
      this.httpServer = createServer(async (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk.toString(); });
          req.on('end', async () => {
            this.logger.info('Received HTTP POST request');
            // Use the shared HTTP controller
            await this.httpController.handleMessage(body, (response) => {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(response);
            });
          });
        } else {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('MCP Server is running');
        }
      });

      // Start WebSocket server attached to HTTP server
      this.logger.info('Starting WebSocket server...');
      this.wss = new WebSocketServer({ server: this.httpServer });
      serverStarted = true;

      this.wss.on('connection', (ws) => {
        const connectionId = randomUUID();
        this.logger.info('Client connected via WebSocket', { connectionId });

        // Start session creation immediately but await it in handlers to avoid race conditions
        const sessionPromise = (async () => {
          try {
            const session = await this.sessionManager.createSession(connectionId);
            const protocolService = new MCPProtocolService(session);
            const controller = new MCPController(protocolService);
            return controller;
          } catch (error) {
            this.logger.error('Failed to initialize client session', { connectionId, error });
            ws.close(1011, 'Session initialization failed');
            throw error;
          }
        })();

        ws.on('message', async (message) => {
          try {
            const controller = await sessionPromise;
            if (!controller) return;

            controller.handleMessage(message.toString(), (response) => {
              if (ws.readyState === 1) { // OPEN
                ws.send(response);
              }
            });
          } catch (error) {
            // Error already handled in sessionPromise
          }
        });

        ws.on('close', () => {
          this.logger.info('Client disconnected', { connectionId });
          sessionPromise.then(() => {
            this.sessionManager.closeSession(connectionId);
          }).catch(() => { });
        });

        ws.on('error', (error) => {
          this.logger.error('WebSocket error', { connectionId, error });
        });
      });

      // Listen on the configured port
      this.httpServer.listen(config.server.port, config.server.host, () => {
        this.logger.info(`MCP Server listening on http://${config.server.host}:${config.server.port}`);
      });

    } catch (error) {
      this.logger.error('Failed to start server', error);

      if (serverStarted && this.wss) {
        await new Promise(r => this.wss.close(r));
      }
      if (this.httpServer && this.httpServer.listening) {
        await new Promise(r => this.httpServer.close(r));
      }
      if (browserInitialized) {
        await this.playwrightService.close();
      }
      process.exit(1);
    }
  }

  async stop() {
    this.logger.info('Initiating graceful shutdown');

    if (this.wss) {
      this.wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(JSON.stringify({
            jsonrpc: '2.0',
            method: 'server/shutdown',
            params: { reason: 'Server shutting down' }
          }));
          client.close(1000, 'Server shutdown');
        }
      });
      await new Promise(r => this.wss.close(r));
    }

    if (this.httpServer) {
      await new Promise(r => this.httpServer.close(r));
    }

    await this.sessionManager.closeAll();
    await this.playwrightService.close();
    this.logger.info('Server shutdown complete');
  }
}

const server = new MCPServer();
server.start();

const gracefulShutdown = async (signal) => {
  console.log(`\nReceived ${signal}, initiating graceful shutdown...`);
  try {
    await server.stop();
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
if (process.platform !== 'win32') process.on('SIGHUP', () => gracefulShutdown('SIGHUP'));