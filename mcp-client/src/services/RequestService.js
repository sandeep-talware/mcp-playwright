/**
 * @author Sandeep Talware
 */

import { Logger } from '../utils/logger.js';

export class RequestService {
  constructor(connectionManager) {
    this.connectionManager = connectionManager;
    this.logger = new Logger('RequestService');
  }

  async initialize() {
    this.logger.info('Initializing MCP session');
    return await this.connectionManager.send({
      method: 'initialize',
      params: {
        protocolVersion: '1.0.0',
        clientInfo: {
          name: 'playwright-mcp-client',
          version: '1.0.0'
        }
      }
    });
  }

  async listTools() {
    this.logger.info('Listing available tools');
    return await this.connectionManager.send({
      method: 'tools/list'
    });
  }

  async callTool(name, args) {
    this.logger.info('Calling tool', { name, args });
    return await this.connectionManager.send({
      method: 'tools/call',
      params: {
        name,
        arguments: args
      }
    });
  }

  async navigate(url) {
    return await this.callTool('playwright_navigate', { url });
  }

  async click(selector) {
    return await this.callTool('playwright_click', { selector });
  }

  async fill(selector, value) {
    return await this.callTool('playwright_fill', { selector, value });
  }

  async screenshot(path) {
    return await this.callTool('playwright_screenshot', { path });
  }

  async getText(selector) {
    return await this.callTool('playwright_get_text', { selector });
  }
}
