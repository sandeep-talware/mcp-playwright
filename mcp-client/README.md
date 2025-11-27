Playwright MCP Client
A Model Context Protocol (MCP) client for connecting to and controlling the Playwright MCP Server for browser automation.
🎯 Overview
This client provides a clean, programmatic interface to communicate with the Playwright MCP Server. It handles connection management, request/response handling, and provides high-level methods for browser automation.
📋 Prerequisites

Node.js 16.x or higher
npm or yarn package manager
Running Playwright MCP Server

🚀 Installation
1. Install Dependencies
bashnpm install
2. Ensure Server is Running
The server must be running before starting the client:
bash# In server directory
cd ../server
npm start
3. Start Client
bashnpm start
📁 Project Structure
client/
├── src/
│   ├── services/
│   │   ├── ConnectionManager.js    # WebSocket connection handling
│   │   └── RequestService.js       # High-level API for automation
│   ├── utils/
│   │   └── logger.js              # Logging utility
│   ├── config/
│   │   └── config.js              # Client configuration
│   └── client.js                  # Main client entry point
├── examples/
│   └── example-automation.js      # Example automation scripts
├── package.json
└── README.md
🔧 Configuration
Edit src/config/config.js to customize client settings:
javascriptexport const config = {
  server: {
    url: 'ws://localhost:8080',    // Server WebSocket URL
    protocol: 'ws',
    host: 'localhost',
    port: 8080
  },
  connection: {
    reconnectInterval: 5000,       // Reconnection delay (ms)
    maxReconnectAttempts: 10,      // Max reconnection attempts
    connectionTimeout: 30000,      // Connection timeout (ms)
    responseTimeout: 60000         // Response timeout (ms)
  }
};
Environment Variables

MCP_SERVER_URL - Override server URL
MCP_SERVER_HOST - Override server host
MCP_SERVER_PORT - Override server port
LOG_LEVEL - Set logging level (debug, info, warn, error)

🎮 Usage
Basic Usage
javascriptimport { ConnectionManager } from './src/services/ConnectionManager.js';
import { RequestService } from './src/services/RequestService.js';

// Initialize
const connectionManager = new ConnectionManager();
const requestService = new RequestService(connectionManager);

// Connect
await connectionManager.connect();
await requestService.initialize();

// Navigate to a page
await requestService.navigate('https://example.com');

// Click an element
await requestService.click('button#submit');

// Fill a form field
await requestService.fill('#username', 'testuser');

// Get text from element
const text = await requestService.getText('h1');

// Take a screenshot
await requestService.screenshot('./screenshot.png');

// Disconnect
connectionManager.disconnect();
Using the Client Class
javascriptimport { MCPClient } from './src/client.js';

const client = new MCPClient();
await client.start();

// Client automatically runs example automation
// Modify client.js to customize behavior
📚 API Reference
ConnectionManager
Methods
connect()
Connect to the MCP server
javascriptawait connectionManager.connect();
Returns: Promise<void>
Throws: Error if connection fails
send(message, handler)
Send a message to the server
javascriptconst response = await connectionManager.send({
  method: 'tools/list'
});
Parameters:

message (Object) - Message to send
handler (Function) - Optional response handler

Returns: Promise<Object> - Server response
disconnect()
Disconnect from the server
javascriptconnectionManager.disconnect();
attemptReconnect()
Automatically attempt to reconnect
javascript// Automatically called on disconnect
// No manual call needed

RequestService
Methods
initialize()
Initialize MCP session with server
javascriptawait requestService.initialize();
Returns: Promise<Object> - Server info
listTools()
List available automation tools
javascriptconst tools = await requestService.listTools();
console.log(tools);
Returns: Promise<Array> - Array of tool definitions
navigate(url)
Navigate to a URL
javascriptawait requestService.navigate('https://example.com');
Parameters:

url (string) - URL to navigate to

Returns: Promise<Object> - Result with status
click(selector)
Click an element
javascriptawait requestService.click('button.submit');
Parameters:

selector (string) - CSS selector

Returns: Promise<Object> - Result with status
fill(selector, value)
Fill an input field
javascriptawait requestService.fill('#email', 'test@example.com');
Parameters:

selector (string) - CSS selector
value (string) - Value to fill

Returns: Promise<Object> - Result with status
screenshot(path)
Take a screenshot
javascriptawait requestService.screenshot('./page.png');
Parameters:

path (string) - File path for screenshot

Returns: Promise<Object> - Result with status
getText(selector)
Get text content from element
javascriptconst text = await requestService.getText('h1.title');
console.log(text);
Parameters:

selector (string) - CSS selector

Returns: Promise<Object> - Result with text content
callTool(name, args)
Call any available tool
javascriptawait requestService.callTool('playwright_navigate', {
  url: 'https://example.com'
});
Parameters:

name (string) - Tool name
args (Object) - Tool arguments

Returns: Promise<Object> - Tool execution result

🎯 Example Automation Scripts
Example 1: Simple Navigation and Screenshot
javascriptimport { ConnectionManager } from './src/services/ConnectionManager.js';
import { RequestService } from './src/services/RequestService.js';

async function simpleAutomation() {
  const connectionManager = new ConnectionManager();
  const requestService = new RequestService(connectionManager);

  try {
    // Connect and initialize
    await connectionManager.connect();
    await requestService.initialize();

    // Navigate to page
    await requestService.navigate('https://example.com');
    
    // Wait a moment for page to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Take screenshot
    await requestService.screenshot('./example.png');
    
    console.log('✅ Automation completed successfully');
  } catch (error) {
    console.error('❌ Automation failed:', error);
  } finally {
    connectionManager.disconnect();
  }
}

simpleAutomation();
Example 2: Form Automation
javascriptasync function formAutomation() {
  const connectionManager = new ConnectionManager();
  const requestService = new RequestService(connectionManager);

  try {
    await connectionManager.connect();
    await requestService.initialize();

    // Navigate to form
    await requestService.navigate('https://example.com/form');
    
    // Fill form fields
    await requestService.fill('#name', 'John Doe');
    await requestService.fill('#email', 'john@example.com');
    await requestService.fill('#message', 'Hello World!');
    
    // Submit form
    await requestService.click('button[type="submit"]');
    
    // Wait for submission
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Get confirmation text
    const confirmation = await requestService.getText('.confirmation');
    console.log('Confirmation:', confirmation);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    connectionManager.disconnect();
  }
}

formAutomation();
Example 3: Search Automation
javascriptasync function searchAutomation() {
  const connectionManager = new ConnectionManager();
  const requestService = new RequestService(connectionManager);

  try {
    await connectionManager.connect();
    await requestService.initialize();

    // Go to Google
    await requestService.navigate('https://www.google.com');
    
    // Fill search box
    await requestService.fill('textarea[name="q"]', 'Playwright automation');
    
    // Submit search (press Enter is simulated by form submission)
    await requestService.click('input[name="btnK"]');
    
    // Wait for results
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Take screenshot of results
    await requestService.screenshot('./search-results.png');
    
    // Get first result title
    const firstResult = await requestService.getText('h3');
    console.log('First result:', firstResult);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    connectionManager.disconnect();
  }
}

searchAutomation();
Example 4: Multi-step Workflow
javascriptasync function multiStepWorkflow() {
  const connectionManager = new ConnectionManager();
  const requestService = new RequestService(connectionManager);

  try {
    await connectionManager.connect();
    await requestService.initialize();

    console.log('Step 1: Navigate to homepage');
    await requestService.navigate('https://example.com');
    await requestService.screenshot('./step1-homepage.png');
    
    console.log('Step 2: Click login button');
    await requestService.click('a.login');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Step 3: Fill credentials');
    await requestService.fill('#username', 'testuser');
    await requestService.fill('#password', 'testpass');
    await requestService.screenshot('./step3-credentials.png');
    
    console.log('Step 4: Submit login');
    await requestService.click('button[type="submit"]');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Step 5: Verify login');
    const welcomeText = await requestService.getText('.welcome-message');
    console.log('Welcome message:', welcomeText);
    await requestService.screenshot('./step5-logged-in.png');
    
    console.log('✅ Workflow completed successfully');
    
  } catch (error) {
    console.error('❌ Workflow failed:', error);
  } finally {
    connectionManager.disconnect();
  }
}

multiStepWorkflow();
🔄 Connection Management
Automatic Reconnection
The client automatically attempts to reconnect if the connection is lost:
javascriptconst connectionManager = new ConnectionManager();
await connectionManager.connect();

// Connection lost? Client will automatically try to reconnect
// Max attempts: 10 (configurable in config.js)
// Interval: 5 seconds (configurable in config.js)
Manual Reconnection
javascriptconnectionManager.disconnect();
await connectionManager.connect();
Connection Events
javascript// Connection established
connectionManager.ws.on('open', () => {
  console.log('Connected!');
});

// Connection closed
connectionManager.ws.on('close', () => {
  console.log('Disconnected!');
});

// Connection error
connectionManager.ws.on('error', (error) => {
  console.error('Connection error:', error);
});
📊 Logging
All operations are logged with context:
json{
  "level": "INFO",
  "context": "ConnectionManager",
  "message": "Connected to MCP server",
  "data": {},
  "timestamp": "2025-11-27T19:12:25.207Z"
}
Log Levels
Configure in src/config/config.js:
javascriptlogging: {
  level: 'info',  // 'debug', 'info', 'warn', 'error'
}
Custom Logger
javascriptimport { Logger } from './src/utils/logger.js';

const logger = new Logger('MyAutomation');
logger.info('Starting automation');
logger.error('Something went wrong', error);
logger.debug('Debug info', { data: 'value' });
🐛 Troubleshooting
Connection Refused
Problem: Client cannot connect to server
Solution:
bash# Check if server is running
cd ../server
npm start

# Verify server URL in config.js
server: {
  url: 'ws://localhost:8080'
}
Timeout Errors
Problem: Requests timing out
Solution: Increase timeout in config.js:
javascriptconnection: {
  responseTimeout: 120000  // 2 minutes
}
WebSocket Errors
Problem: WebSocket connection errors
Solution:

Check firewall settings
Ensure port 8080 is not blocked
Verify server is accessible: telnet localhost 8080

Module Not Found
Problem: Cannot find module errors
Solution:
bash# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
🔒 Security Considerations

Only connect to trusted MCP servers
Validate server responses
Use secure WebSocket (WSS) in production
Implement authentication if needed
Sanitize user inputs before sending to server

📈 Performance Tips

Reuse Connections:

javascript   // Don't create new connection for each action
   const connectionManager = new ConnectionManager();
   await connectionManager.connect();
   // Reuse for multiple operations

Batch Operations:

javascript   // Group related operations
   await requestService.navigate(url);
   await requestService.fill('#field1', 'value1');
   await requestService.fill('#field2', 'value2');
   await requestService.click('button');

Use Appropriate Timeouts:

javascript   // Adjust based on your needs
   connection: {
     responseTimeout: 30000  // 30 seconds
   }
🚀 Advanced Usage
Custom Request Handling
javascript// Send custom MCP request
const response = await connectionManager.send({
  method: 'custom/method',
  params: {
    customParam: 'value'
  }
});
Error Handling
javascripttry {
  await requestService.navigate('https://example.com');
} catch (error) {
  if (error.message.includes('timeout')) {
    console.log('Navigation timed out');
    // Handle timeout
  } else {
    console.error('Navigation failed:', error);
    // Handle other errors
  }
}
Parallel Operations (Not Recommended)
javascript// Be careful with parallel operations
// Playwright actions should generally be sequential
await Promise.all([
  requestService.screenshot('./page1.png'),
  requestService.getText('h1')
]);
📚 Additional Resources

Server Documentation
MCP Protocol Specification
Playwright Documentation
WebSocket API

🤝 Contributing

Fork the repository
Create a feature branch
Make your changes
Test with server
Submit a pull request

📄 License
MIT License - See LICENSE file for details
👥 Support
For issues and questions:

Check server is running
Review configuration settings
Check logs for error details
Consult troubleshooting section

🎉 Changelog
v1.0.0 (2025-11-27)

Initial release
WebSocket client implementation
Connection management with auto-reconnect
High-level automation API
Comprehensive logging
Example automation scripts
