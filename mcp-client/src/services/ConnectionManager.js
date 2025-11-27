import WebSocket from 'ws';
import { Logger } from '../utils/logger.js';
import { config } from '../config/config.js';

export class ConnectionManager {
  constructor() {
    this.ws = null;
    this.logger = new Logger('ConnectionManager');
    this.reconnectAttempts = 0;
    this.messageHandlers = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      try {
        this.logger.info('Connecting to MCP server', { url: config.server.url });
        
        this.ws = new WebSocket(config.server.url);

        this.ws.on('open', () => {
          this.logger.info('Connected to MCP server');
          this.reconnectAttempts = 0;
          resolve();
        });

        this.ws.on('message', (data) => {
          this.handleMessage(data.toString());
        });

        this.ws.on('close', () => {
          this.logger.info('Disconnected from MCP server');
          this.attemptReconnect();
        });

        this.ws.on('error', (error) => {
          this.logger.error('WebSocket error', error);
          reject(error);
        });
      } catch (error) {
        this.logger.error('Connection failed', error);
        reject(error);
      }
    });
  }

  handleMessage(message) {
    try {
      const response = JSON.parse(message);
      this.logger.info('Received message', { id: response.id });

      const handler = this.messageHandlers.get(response.id);
      if (handler) {
        handler(response);
        this.messageHandlers.delete(response.id);
      }
    } catch (error) {
      this.logger.error('Error handling message', error);
    }
  }

  send(message, handler) {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error('Not connected to server'));
        return;
      }

      const id = Date.now();
      const request = { ...message, id, jsonrpc: '2.0' };

      this.messageHandlers.set(id, (response) => {
        if (response.error) {
          reject(new Error(response.error.message));
        } else {
          resolve(response.result);
        }
      });

      this.ws.send(JSON.stringify(request));
      this.logger.info('Sent message', { method: message.method, id });
    });
  }

  attemptReconnect() {
    if (this.reconnectAttempts >= config.connection.maxReconnectAttempts) {
      this.logger.error('Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    this.logger.info('Attempting reconnect', { attempt: this.reconnectAttempts });

    setTimeout(() => {
      this.connect().catch((error) => {
        this.logger.error('Reconnect failed', error);
      });
    }, config.connection.reconnectInterval);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}