/**
 * @author Sandeep Talware
 */

export const config = {
  // Server connection settings
  server: {
    url: 'ws://localhost:8080',
    protocol: 'ws',
    host: 'localhost',
    port: 8080
  },

  // Connection management
  connection: {
    reconnectInterval: 5000,        // 5 seconds between reconnection attempts
    maxReconnectAttempts: 10,       // Maximum number of reconnection attempts
    connectionTimeout: 30000,       // 30 seconds timeout for initial connection
    heartbeatInterval: 30000,       // Send heartbeat every 30 seconds
    responseTimeout: 60000          // 60 seconds timeout for responses
  },

  // Client information
  client: {
    name: 'playwright-mcp-client',
    version: '1.0.0',
    userAgent: 'PlaywrightMCPClient/1.0'
  },

  // MCP Protocol settings
  mcp: {
    protocolVersion: '1.0.0',
    jsonrpcVersion: '2.0'
  },

  // Logging configuration
  logging: {
    level: 'info',                  // 'debug', 'info', 'warn', 'error'
    format: 'json',                 // 'json' or 'text'
    includeTimestamp: true,
    includeContext: true
  },

  // Request settings
  request: {
    defaultTimeout: 30000,          // Default timeout for requests
    retryAttempts: 3,               // Number of retry attempts for failed requests
    retryDelay: 1000                // Delay between retries in milliseconds
  },

  // Development/Debug settings
  debug: {
    enabled: process.env.NODE_ENV === 'development',
    logAllMessages: false,          // Log all incoming/outgoing messages
    prettyPrint: true               // Pretty print JSON in logs
  }
};

// Environment-specific overrides
if (process.env.MCP_SERVER_URL) {
  config.server.url = process.env.MCP_SERVER_URL;
}

if (process.env.MCP_SERVER_HOST) {
  config.server.host = process.env.MCP_SERVER_HOST;
}

if (process.env.MCP_SERVER_PORT) {
  config.server.port = parseInt(process.env.MCP_SERVER_PORT, 10);
}

if (process.env.LOG_LEVEL) {
  config.logging.level = process.env.LOG_LEVEL;
}