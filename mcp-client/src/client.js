/**
 * @author Sandeep Talware
 */

import { ConnectionManager } from './services/ConnectionManager.js';
import { RequestService } from './services/RequestService.js';
import { Logger } from './utils/logger.js';

class MCPClient {
  constructor() {
    this.logger = new Logger('MCPClient');
    this.connectionManager = new ConnectionManager();
    this.requestService = new RequestService(this.connectionManager);
  }

  async start() {
    try {
      await this.connectionManager.connect();
      
      const initResult = await this.requestService.initialize();
      this.logger.info('Initialized', initResult);

      const tools = await this.requestService.listTools();
      this.logger.info('Available tools', tools);

      await this.runExample();
    } catch (error) {
      this.logger.error('Client error', error);
    }
  }

  async runExample() {
    try {
      this.logger.info('Running example automation');

      // await this.requestService.navigate('https://example.com');
      await this.requestService.navigate('https://google.com');
      const text = await this.requestService.getText('h1');
      this.logger.info('Got text', text);

      await this.requestService.screenshot('./screenshot.png');
      
      this.logger.info('Example completed successfully');
    } catch (error) {
      this.logger.error('Example failed', error);
    }
  }

  stop() {
    this.connectionManager.disconnect();
  }
}

const client = new MCPClient();
client.start();

process.on('SIGINT', () => {
  client.stop();
  process.exit(0);
});