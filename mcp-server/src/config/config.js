export const config = {
  server: {
    port: 8080,
    host: 'localhost'
  },
  playwright: {
    headless: false,
    slowMo: 100,
    defaultTimeout: 30000
  },
  mcp: {
    version: '1.0.0',
    name: 'playwright-automation-server',
    capabilities: [
      'browser_control',
      'element_interaction',
      'screenshot',
      'page_navigation'
    ]
  },
  logging: {
    level: 'info',
    format: 'json'
  }
};