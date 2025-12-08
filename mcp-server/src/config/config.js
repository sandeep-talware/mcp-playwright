/**
 * @author Sandeep Talware
 */

export const config = {
  server: {
    port: process.env.PORT || 8080,
    host: process.env.HOST || 'localhost'
  },
  playwright: {
    headless: false,
    slowMo: 100,
    defaultTimeout: 30000,
    executablePath: process.env.CHROME_EXECUTABLE_PATH || null,
    startMaximized: process.env.CHROME_START_MAXIMIZED === 'true'
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
  recording: {
    enabled: process.env.RECORDING_ENABLED === 'true',
    dir: 'videos/',
    size: {
      width: 1280,
      height: 720
    }
  },
  logging: {
    level: 'info',
    format: 'json'
  }
};