Playwright MCP Server
A Model Context Protocol (MCP) server that provides Playwright browser automation capabilities through a standardized interface.
🎯 Overview
This server enables browser automation through the MCP protocol, allowing LLMs and other clients to control Playwright programmatically. It supports both WebSocket and STDIO communication modes.
📋 Prerequisites

Node.js 16.x or higher
npm or yarn package manager
Operating System: Windows, macOS, or Linux

🚀 Installation
1. Install Dependencies
bash
npm install
2. Install Playwright Browsers
bash
npx playwright install chromium
Or install all browsers:
bash
npx playwright install
3. Verify Installation
bash
npm start
You should see:
{"level":"INFO","context":"PlaywrightService","message":"Playwright browser initialized successfully"...}
{"level":"INFO","context":"MCPServer","message":"MCP Server started on localhost:8080"...}
📁 Project Structure
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
🔧 Configuration
Edit src/config/config.js to customize server settings:
javascriptexport const config = {
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
Environment Variables

NODE_ENV - Set to 'production' or 'development'
MCP_SERVER_PORT - Override default port
MCP_SERVER_HOST - Override default host
LOG_LEVEL - Set logging level (debug, info, warn, error)

🎮 Usage
Start WebSocket Server (for Client Connections)
bashnpm start
Server will start on ws://localhost:8080
Start STDIO Server (for VS Code LLM Integration)
bashnpm run start-stdio
Development Mode (Auto-restart on changes)
bash
npm run dev
🛠️ Available Tools
The server exposes the following Playwright automation tools:
1. playwright_navigate
Navigate to a URL
Parameters:

url (string) - URL to navigate to

Example:
json{
  "name": "playwright_navigate",
  "arguments": {
    "url": "https://example.com"
  }
}
2. playwright_click
Click an element
Parameters:

selector (string) - CSS selector of element

Example:
json{
  "name": "playwright_click",
  "arguments": {
    "selector": "button#submit"
  }
}
3. playwright_fill
Fill an input field
Parameters:

selector (string) - CSS selector of input
value (string) - Value to fill

Example:
json{
  "name": "playwright_fill",
  "arguments": {
    "selector": "#username",
    "value": "testuser"
  }
}
4. playwright_screenshot
Take a screenshot
Parameters:

path (string) - File path to save screenshot

Example:
json{
  "name": "playwright_screenshot",
  "arguments": {
    "path": "./screenshot.png"
  }
}
5. playwright_get_text
Get text content from element
Parameters:

selector (string) - CSS selector of element

Example:
json{
  "name": "playwright_get_text",
  "arguments": {
    "selector": "h1"
  }
}
📡 MCP Protocol
The server implements the Model Context Protocol (MCP) version 1.0.0.
Supported Methods
initialize
Initialize MCP session
Request:
json{
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
Response:
json{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "1.0.0",
    "serverInfo": {
      "name": "playwright-automation-server",
      "version": "1.0.0"
    },
    "capabilities": {
      "tools": {}
    }
  }
}
tools/list
List available tools
Request:
json{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list"
}
Response:
json{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "tools": [
      {
        "name": "playwright_navigate",
        "description": "Navigate to a URL",
        "inputSchema": {
          "type": "object",
          "properties": {
            "url": {
              "type": "string",
              "description": "URL to navigate to"
            }
          },
          "required": ["url"]
        }
      }
      // ... more tools
    ]
  }
}
tools/call
Execute a tool
Request:
json{
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
Response:
json{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\"status\":\"success\",\"url\":\"https://example.com\"}"
      }
    ]
  }
}
🔌 VS Code Integration
To use this server with VS Code LLM extensions:
1. Create Configuration File
For Cline/Claude Dev:
Path: ~/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
json{
  "mcpServers": {
    "playwright-automation": {
      "command": "node",
      "args": [
        "/absolute/path/to/mcp-server/src/server-stdio.js"
      ]
    }
  }
}
For Continue.dev:
Path: ~/.continue/config.json
json{
  "mcpServers": [
    {
      "name": "playwright-automation",
      "command": "node",
      "args": [
        "/absolute/path/to/mcp-server/src/server-stdio.js"
      ]
    }
  ]
}
2. Restart VS Code
3. Test Connection
In VS Code chat, try:
@playwright-automation Navigate to example.com
📊 Logging
All operations are logged in JSON format:
json{
  "level": "INFO",
  "context": "PlaywrightService",
  "message": "Navigating to URL",
  "data": {
    "url": "https://example.com"
  },
  "timestamp": "2025-11-27T19:12:25.207Z"
}
Log Levels

DEBUG - Detailed debugging information
INFO - General informational messages
WARN - Warning messages
ERROR - Error messages with stack traces

🧪 Testing
Manual Testing with Client
bash# Terminal 1: Start server
npm start

# Terminal 2: Run client (in client directory)
cd ../client
npm start
Testing with curl (WebSocket)
bash# Install wscat
npm install -g wscat

# Connect to server
wscat -c ws://localhost:8080

# Send initialize request
{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"1.0.0"}}
🐛 Troubleshooting
Browser Installation Issues
bash# Clear Playwright cache
npx playwright uninstall --all

# Reinstall browsers
npx playwright install chromium
Port Already in Use
bash# Change port in config.js or use environment variable
MCP_SERVER_PORT=8081 npm start
Permission Errors (Windows)
Run terminal as Administrator:
bashnpx playwright install
Browser Not Found
Ensure browsers are installed:
bashnpx playwright install --with-deps chromium
Connection Refused
Check if server is running:
bashnetstat -an | grep 8080
🔒 Security Considerations
⚠️ Important: This server should be used in trusted environments only.

Do not expose to public internet without authentication
Validate all user inputs in production
Implement rate limiting for production use
Use HTTPS/WSS in production environments
Sanitize file paths for screenshots
Consider implementing authentication tokens

📈 Performance Tips

Use Headless Mode for better performance:

javascript   headless: true  // in config.js

Reduce Slow Motion in production:

javascript   slowMo: 0  // in config.js

Adjust Timeouts based on your network:

javascript   defaultTimeout: 15000  // in config.js

Close Browser when not needed:

javascript   await playwrightService.close();
🚀 Advanced Usage
Custom Tool Addition
Add to src/services/MCPProtocolService.js:
javascript{
  name: 'playwright_custom_action',
  description: 'Your custom action',
  inputSchema: {
    type: 'object',
    properties: {
      param: { type: 'string' }
    },
    required: ['param']
  }
}
Implement in src/services/PlaywrightService.js:
javascriptasync customAction(param) {
  // Your implementation
  return { status: 'success', result: 'data' };
}
Multiple Browser Contexts
javascript// In PlaywrightService.js
async createNewContext() {
  const newContext = await this.browser.newContext();
  const newPage = await newContext.newPage();
  return { context: newContext, page: newPage };
}
📚 Additional Resources

Playwright Documentation
MCP Protocol Specification
WebSocket Protocol
JSON-RPC 2.0 Specification

🤝 Contributing

Fork the repository
Create a feature branch
Make your changes
Test thoroughly
Submit a pull request
