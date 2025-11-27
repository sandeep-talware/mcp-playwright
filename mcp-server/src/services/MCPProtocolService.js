import { Logger } from '../utils/logger.js';
import { Validator } from '../utils/validator.js';
import { config } from '../config/config.js';

export class MCPProtocolService {
  constructor(playwrightService) {
    this.playwrightService = playwrightService;
    this.logger = new Logger('MCPProtocolService');
    this.tools = this.initializeTools();
  }

  initializeTools() {
    return [
      {
        name: 'playwright_navigate',
        description: 'Navigate to a URL',
        inputSchema: {
          type: 'object',
          properties: {
            url: { type: 'string', description: 'URL to navigate to' }
          },
          required: ['url']
        }
      },
      {
        name: 'playwright_click',
        description: 'Click an element',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector' }
          },
          required: ['selector']
        }
      },
      {
        name: 'playwright_fill',
        description: 'Fill an input field',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector' },
            value: { type: 'string', description: 'Value to fill' }
          },
          required: ['selector', 'value']
        }
      },
      {
        name: 'playwright_screenshot',
        description: 'Take a screenshot',
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'Path to save screenshot' }
          },
          required: ['path']
        }
      },
      {
        name: 'playwright_get_text',
        description: 'Get text content from element',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector' }
          },
          required: ['selector']
        }
      }
    ];
  }

  async handleRequest(request) {
    try {
      Validator.validateMCPRequest(request);
      
      this.logger.info('Handling MCP request', { method: request.method });

      switch (request.method) {
        case 'initialize':
          return this.handleInitialize(request);
        case 'tools/list':
          return this.handleToolsList(request);
        case 'tools/call':
          return this.handleToolCall(request);
        default:
          throw new Error(`Unknown method: ${request.method}`);
      }
    } catch (error) {
      this.logger.error('Error handling request', error);
      return this.createErrorResponse(request.id, error);
    }
  }

  handleInitialize(request) {
    return {
      jsonrpc: '2.0',
      id: request.id,
      result: {
        protocolVersion: config.mcp.version,
        serverInfo: {
          name: config.mcp.name,
          version: '1.0.0'
        },
        capabilities: {
          tools: {}
        }
      }
    };
  }

  handleToolsList(request) {
    return {
      jsonrpc: '2.0',
      id: request.id,
      result: {
        tools: this.tools
      }
    };
  }

  async handleToolCall(request) {
    const { name, arguments: args } = request.params;
    
    let result;
    switch (name) {
      case 'playwright_navigate':
        result = await this.playwrightService.navigate(args.url);
        break;
      case 'playwright_click':
        result = await this.playwrightService.click(args.selector);
        break;
      case 'playwright_fill':
        result = await this.playwrightService.fill(args.selector, args.value);
        break;
      case 'playwright_screenshot':
        result = await this.playwrightService.screenshot(args.path);
        break;
      case 'playwright_get_text':
        result = await this.playwrightService.getText(args.selector);
        break;
      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      jsonrpc: '2.0',
      id: request.id,
      result: {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result)
          }
        ]
      }
    };
  }

  createErrorResponse(id, error) {
    return {
      jsonrpc: '2.0',
      id,
      error: {
        code: -32603,
        message: error.message
      }
    };
  }
}
