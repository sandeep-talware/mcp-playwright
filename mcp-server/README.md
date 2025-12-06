# Playwright MCP Server

A Model Context Protocol (MCP) server that provides comprehensive Playwright browser automation capabilities through a standardized interface.

## 🎯 Overview

This server enables browser automation through the MCP protocol, allowing LLMs and other clients to control Playwright programmatically. It supports both WebSocket and STDIO communication modes and provides **70+ automation actions** across navigation, interaction, data extraction, debugging, and more.

## 📋 Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager
- Operating System: Windows, macOS, or Linux

## 🚀 Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Install Playwright Browsers
```bash
npx playwright install chromium
```

Or install all browsers:
```bash
npx playwright install
```

### 3. Verify Installation
```bash
npm start
```

You should see:
```json
{"level":"INFO","context":"PlaywrightService","message":"Playwright browser initialized successfully"...}
{"level":"INFO","context":"MCPServer","message":"MCP Server started on localhost:8080"...}
```

## 📁 Project Structure

```
server/
├── src/
│   ├── controllers/
│   │   ├── MCPController.js          # MCP protocol message handling
│   │   └── PlaywrightController.js   # Playwright action orchestration
│   ├── services/
│   │   ├── PlaywrightService.js      # Playwright browser operations
│   │   └── MCPProtocolService.js     # MCP protocol implementation
│   ├── utils/
│   │   ├── logger.js                 # Logging utility
│   │   └── validator.js              # Request validation
│   ├── config/
│   │   └── config.js                 # Server configuration
│   ├── server.js                     # WebSocket server entry point
│   └── server-stdio.js               # STDIO server entry point (for VS Code)
├── package.json
└── README.md
```

## 🔧 Configuration

Edit `src/config/config.js` to customize server settings:

```javascript
export const config = {
  server: {
    port: 8080,              // WebSocket server port
    host: 'localhost'        // Server host
  },
  playwright: {
    headless: false,         // Run browser in headless mode
    slowMo: 100,            // Slow down operations (ms)
    defaultTimeout: 30000    // Default timeout (ms)
  },
  mcp: {
    version: '1.0.0',
    name: 'playwright-automation-server'
  }
};
```

### Environment Variables

- `NODE_ENV` - Set to 'production' or 'development'
- `MCP_SERVER_PORT` - Override default port
- `MCP_SERVER_HOST` - Override default host
- `LOG_LEVEL` - Set logging level (debug, info, warn, error)

## 🎮 Usage

### Start WebSocket Server (for Client Connections)
```bash
npm start
```
Server will start on `ws://localhost:8080`

### Start STDIO Server (for VS Code LLM Integration)
```bash
npm run start-stdio
```

### Development Mode (Auto-restart on changes)
```bash
npm run dev
```

## 🛠️ Available Actions (70+)

All actions are exposed as MCP tools with the prefix `playwright_`. Below is a comprehensive list organized by category:

### Navigation (4 actions)
- **navigate** - Navigate to a URL
- **goBack** - Navigate back in history
- **goForward** - Navigate forward in history
- **reload** - Reload the current page

### Basic Interactions (11 actions)
- **click** - Click an element
- **doubleClick** - Double-click an element
- **rightClick** - Right-click an element
- **hover** - Hover over an element
- **fill** - Fill an input field
- **type** - Type text with delay
- **clear** - Clear an input field
- **press** - Press a keyboard key on an element
- **check** - Check a checkbox/radio
- **uncheck** - Uncheck a checkbox
- **selectOption** - Select dropdown option
- **uploadFile** - Upload a file

### Advanced Selectors (9 actions)
- **clickByText** - Click element by text content
- **clickByRole** - Click element by ARIA role
- **clickByLabel** - Click element by label
- **clickByPlaceholder** - Click element by placeholder
- **clickByTestId** - Click element by test ID
- **clickByTitle** - Click element by title
- **clickByAltText** - Click element by alt text
- **fillByLabel** - Fill input by label
- **fillByPlaceholder** - Fill input by placeholder

### Data Extraction (10 actions)
- **getText** - Get text content from element
- **getInnerText** - Get inner text from element
- **getInnerHTML** - Get inner HTML from element
- **getAttribute** - Get element attribute value
- **getValue** - Get input value
- **getAllText** - Get text from multiple elements
- **getTitle** - Get page title
- **getURL** - Get current URL
- **getContent** - Get page HTML content
- **getCookies** - Get all cookies

### State & Validation (8 actions)
- **isVisible** - Check if element is visible
- **isHidden** - Check if element is hidden
- **isEnabled** - Check if element is enabled
- **isDisabled** - Check if element is disabled
- **isChecked** - Check if checkbox is checked
- **isEditable** - Check if element is editable
- **elementExists** - Check if element exists
- **countElements** - Count matching elements

### Waiting (5 actions)
- **waitForSelector** - Wait for element to appear
- **waitForTimeout** - Wait for specified milliseconds
- **waitForLoadState** - Wait for page load state
- **waitForURL** - Wait for specific URL
- **waitForNavigation** - Wait for navigation to complete

### Screenshots & PDF (4 actions)
- **screenshot** - Take page screenshot
- **screenshotElement** - Take element screenshot
- **screenshotFullPage** - Take full page screenshot
- **pdf** - Generate PDF of page

### Browser Control (6 actions)
- **setViewportSize** - Set viewport dimensions
- **emulateDevice** - Emulate mobile device
- **setCookie** - Set a cookie
- **clearCookies** - Clear all cookies
- **addScriptTag** - Add script tag to page
- **addStyleTag** - Add style tag to page

### Script Evaluation (1 action)
- **evaluate** - Execute JavaScript in page context

### Input Control (6 actions)
- **keyboardPress** - Press keyboard key
- **keyboardType** - Type text with keyboard
- **mouseClick** - Click at coordinates
- **mouseMove** - Move mouse to coordinates
- **scrollTo** - Scroll to position
- **scrollIntoView** - Scroll element into view

### Frames (2 actions)
- **switchToFrame** - Switch to iframe
- **getFrames** - Get all frames

### Network Control (3 actions) 🆕
- **routeRequest** - Intercept and mock requests
- **abortRequest** - Abort specific requests
- **getNetworkActivity** - Get network activity

### Advanced Debugging (5 actions) 🆕
- **setupConsoleCapture** - Start capturing console logs
- **getConsoleLogs** - Retrieve captured console logs
- **clearConsoleLogs** - Clear console log buffer
- **startTracing** - Start Playwright trace recording
- **stopTracing** - Stop and save trace file

### System & Environment (4 actions) 🆕
- **setGeolocation** - Set fake geolocation
- **grantPermissions** - Grant browser permissions
- **clearPermissions** - Clear all permissions
- **setTimezone** - Emulate timezone (context creation only)

### Accessibility (1 action) 🆕
- **getAccessibilitySnapshot** - Get accessibility tree

## 📖 Usage Examples

### Basic Navigation and Interaction
```javascript
// Navigate to a page
await playwright_navigate({ url: "https://example.com" });

// Fill a form
await playwright_fillByLabel({ label: "Email", value: "user@example.com" });
await playwright_fillByPlaceholder({ placeholder: "Password", value: "secret123" });

// Click submit button
await playwright_clickByRole({ role: "button", name: "Sign In" });

// Wait for navigation
await playwright_waitForLoadState({ state: "networkidle" });
```

### Data Extraction
```javascript
// Get page title
const title = await playwright_getTitle();

// Get text from multiple elements
const items = await playwright_getAllText({ selector: ".product-name" });

// Check element state
const isVisible = await playwright_isVisible({ selector: "#success-message" });
```

### Screenshots and PDF
```javascript
// Take full page screenshot
await playwright_screenshotFullPage({ path: "./screenshots/page.png" });

// Screenshot specific element
await playwright_screenshotElement({ 
  selector: "#chart", 
  path: "./screenshots/chart.png" 
});

// Generate PDF
await playwright_pdf({ path: "./output.pdf" });
```

### Network Interception
```javascript
// Setup console capture
await playwright_setupConsoleCapture();

// Mock API response
await playwright_routeRequest({ 
  urlPattern: "**/api/users",
  handler: {
    status: 200,
    body: JSON.stringify({ users: [] })
  }
});

// Get console logs
const logs = await playwright_getConsoleLogs();
```

### Debugging with Tracing
```javascript
// Start tracing
await playwright_startTracing({ screenshots: true, snapshots: true });

// Perform actions...
await playwright_navigate({ url: "https://example.com" });
await playwright_click({ selector: "#button" });

// Stop and save trace
await playwright_stopTracing({ path: "./trace.zip" });
```

### Geolocation and Permissions
```javascript
// Set geolocation
await playwright_setGeolocation({ latitude: 37.7749, longitude: -122.4194 });

// Grant permissions
await playwright_grantPermissions({ permissions: ["geolocation", "notifications"] });
```

### Accessibility Testing
```javascript
// Get accessibility snapshot
const snapshot = await playwright_getAccessibilitySnapshot({ selector: "#main-content" });
```

## 📡 MCP Protocol

The server implements the Model Context Protocol (MCP) version 1.0.0.

### Supported Methods

#### initialize
Initialize MCP session

Request:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "1.0.0",
    "clientInfo": {
      "name": "client-name",
      "version": "1.0.0"
    }
  }
}
```

#### tools/list
List all available tools (70+ actions)

#### tools/call
Execute a specific tool

Request:
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "playwright_navigate",
    "arguments": {
      "url": "https://example.com"
    }
  }
}
```

## 🔌 VS Code Integration

To use this server with VS Code LLM extensions:

### 1. Create Configuration File

For Cline/Claude Dev:
Path: `~/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`

```json
{
  "mcpServers": {
    "playwright-automation": {
      "command": "node",
      "args": [
        "/absolute/path/to/mcp-server/src/server-stdio.js"
      ]
    }
  }
}
```

### 2. Restart VS Code

### 3. Test Connection
In VS Code chat, try:
```
@playwright-automation Navigate to example.com and take a screenshot
```

## 📊 Logging

All operations are logged in JSON format with timestamps and context.

## 🐛 Troubleshooting

### Browser Installation Issues
```bash
npx playwright uninstall --all
npx playwright install chromium
```

### Port Already in Use
```bash
MCP_SERVER_PORT=8081 npm start
```

## 🔒 Security Considerations

⚠️ **Important**: This server should be used in trusted environments only.

- Do not expose to public internet without authentication
- Validate all user inputs in production
- Implement rate limiting for production use
- Use HTTPS/WSS in production environments

## 📈 Performance Tips

- Use headless mode for better performance
- Reduce slowMo in production
- Adjust timeouts based on your network
- Close browser when not needed

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [MCP Protocol Specification](https://modelcontextprotocol.io)

## 🎉 Changelog

### v2.0.0 (2025-12-04)
- ✨ Added 60+ new actions across all categories
- 🆕 Network control (request interception, mocking)
- 🆕 Advanced debugging (console logs, tracing)
- 🆕 Environment emulation (geolocation, permissions)
- 🆕 Accessibility testing support
- 📚 Comprehensive documentation update

### v1.0.0 (2025-11-27)
- Initial release
- WebSocket server implementation
- STDIO server implementation
- 5 core Playwright tools
- MCP protocol v1.0.0 support
- VS Code integration support

## 📄 License

MIT License - See LICENSE file for details