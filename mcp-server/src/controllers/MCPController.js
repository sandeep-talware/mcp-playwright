/**
 * @author Sandeep Talware
 */

import { Logger } from '../utils/logger.js';

export class MCPController {
  constructor(mcpProtocolService) {
    this.mcpProtocolService = mcpProtocolService;
    this.logger = new Logger('MCPController');
  }

  async handleMessage(message, sendCallback) {
    try {
      const request = JSON.parse(message);
      this.logger.info('Received MCP message', { method: request.method });

      const response = await this.mcpProtocolService.handleRequest(request);

      sendCallback(JSON.stringify(response));
      this.logger.info('Sent MCP response', { id: request.id });
    } catch (error) {
      this.logger.error('Error handling message', error);
      sendCallback(JSON.stringify({
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32700,
          message: 'Parse error'
        }
      }));
    }
  }
}