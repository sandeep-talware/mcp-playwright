/**
 * @author Sandeep Talware
 */

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
      // ========================================
      // NAVIGATION TOOLS
      // ========================================
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
        name: 'playwright_go_back',
        description: 'Navigate back in browser history',
        inputSchema: { type: 'object', properties: {} }
      },
      {
        name: 'playwright_go_forward',
        description: 'Navigate forward in browser history',
        inputSchema: { type: 'object', properties: {} }
      },
      {
        name: 'playwright_reload',
        description: 'Reload the current page',
        inputSchema: { type: 'object', properties: {} }
      },

      // ========================================
      // BASIC INTERACTION TOOLS
      // ========================================
      {
        name: 'playwright_click',
        description: 'Click an element using CSS selector',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector' }
          },
          required: ['selector']
        }
      },
      {
        name: 'playwright_double_click',
        description: 'Double click an element',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector' }
          },
          required: ['selector']
        }
      },
      {
        name: 'playwright_right_click',
        description: 'Right click an element',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector' }
          },
          required: ['selector']
        }
      },
      {
        name: 'playwright_hover',
        description: 'Hover over an element',
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
        name: 'playwright_type',
        description: 'Type text with delay between characters',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector' },
            text: { type: 'string', description: 'Text to type' },
            delay: { type: 'number', description: 'Delay in ms (default: 100)' }
          },
          required: ['selector', 'text']
        }
      },
      {
        name: 'playwright_clear',
        description: 'Clear an input field',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector' }
          },
          required: ['selector']
        }
      },
      {
        name: 'playwright_press',
        description: 'Press a key on an element',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector' },
            key: { type: 'string', description: 'Key to press (e.g., Enter, Escape)' }
          },
          required: ['selector', 'key']
        }
      },

      // ========================================
      // ADVANCED SELECTOR TOOLS
      // ========================================
      {
        name: 'playwright_click_by_text',
        description: 'Click an element by its text content',
        inputSchema: {
          type: 'object',
          properties: {
            text: { type: 'string', description: 'Text to search for' },
            exact: { type: 'boolean', description: 'Exact match (default: false)' }
          },
          required: ['text']
        }
      },
      {
        name: 'playwright_click_by_role',
        description: 'Click an element by ARIA role',
        inputSchema: {
          type: 'object',
          properties: {
            role: { type: 'string', description: 'ARIA role (button, link, etc.)' },
            name: { type: 'string', description: 'Accessible name' }
          },
          required: ['role', 'name']
        }
      },
      {
        name: 'playwright_click_by_label',
        description: 'Click an element by its label text',
        inputSchema: {
          type: 'object',
          properties: {
            label: { type: 'string', description: 'Label text' }
          },
          required: ['label']
        }
      },
      {
        name: 'playwright_click_by_placeholder',
        description: 'Click an element by its placeholder',
        inputSchema: {
          type: 'object',
          properties: {
            placeholder: { type: 'string', description: 'Placeholder text' }
          },
          required: ['placeholder']
        }
      },
      {
        name: 'playwright_click_by_test_id',
        description: 'Click an element by test ID attribute',
        inputSchema: {
          type: 'object',
          properties: {
            testId: { type: 'string', description: 'Test ID value' }
          },
          required: ['testId']
        }
      },
      {
        name: 'playwright_fill_by_label',
        description: 'Fill input by its label',
        inputSchema: {
          type: 'object',
          properties: {
            label: { type: 'string', description: 'Label text' },
            value: { type: 'string', description: 'Value to fill' }
          },
          required: ['label', 'value']
        }
      },
      {
        name: 'playwright_fill_by_placeholder',
        description: 'Fill input by its placeholder',
        inputSchema: {
          type: 'object',
          properties: {
            placeholder: { type: 'string', description: 'Placeholder text' },
            value: { type: 'string', description: 'Value to fill' }
          },
          required: ['placeholder', 'value']
        }
      },

      // ========================================
      // TEXT & CONTENT EXTRACTION
      // ========================================
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
      },
      {
        name: 'playwright_get_inner_text',
        description: 'Get inner text from element',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector' }
          },
          required: ['selector']
        }
      },
      {
        name: 'playwright_get_inner_html',
        description: 'Get inner HTML from element',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector' }
          },
          required: ['selector']
        }
      },
      {
        name: 'playwright_get_attribute',
        description: 'Get attribute value from element',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector' },
            attribute: { type: 'string', description: 'Attribute name' }
          },
          required: ['selector', 'attribute']
        }
      },
      {
        name: 'playwright_get_value',
        description: 'Get input field value',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector' }
          },
          required: ['selector']
        }
      },
      {
        name: 'playwright_get_all_text',
        description: 'Get text from all matching elements',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector' }
          },
          required: ['selector']
        }
      },

      // ========================================
      // ELEMENT STATE VALIDATION
      // ========================================
      {
        name: 'playwright_is_visible',
        description: 'Check if element is visible',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector' }
          },
          required: ['selector']
        }
      },
      {
        name: 'playwright_is_hidden',
        description: 'Check if element is hidden',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector' }
          },
          required: ['selector']
        }
      },
      {
        name: 'playwright_is_enabled',
        description: 'Check if element is enabled',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector' }
          },
          required: ['selector']
        }
      },
      {
        name: 'playwright_is_disabled',
        description: 'Check if element is disabled',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector' }
          },
          required: ['selector']
        }
      },
      {
        name: 'playwright_is_checked',
        description: 'Check if checkbox/radio is checked',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector' }
          },
          required: ['selector']
        }
      },
      {
        name: 'playwright_element_exists',
        description: 'Check if element exists in DOM',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector' }
          },
          required: ['selector']
        }
      },

      // ========================================
      // FORM INTERACTION TOOLS
      // ========================================
      {
        name: 'playwright_check',
        description: 'Check a checkbox or radio button',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector' }
          },
          required: ['selector']
        }
      },
      {
        name: 'playwright_uncheck',
        description: 'Uncheck a checkbox',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector' }
          },
          required: ['selector']
        }
      },
      {
        name: 'playwright_select_option',
        description: 'Select option from dropdown',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector' },
            value: { type: 'string', description: 'Option value' }
          },
          required: ['selector', 'value']
        }
      },
      {
        name: 'playwright_upload_file',
        description: 'Upload a file',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector' },
            filePath: { type: 'string', description: 'Path to file' }
          },
          required: ['selector', 'filePath']
        }
      },

      // ========================================
      // WAITING TOOLS
      // ========================================
      {
        name: 'playwright_wait_for_selector',
        description: 'Wait for element to appear',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector' },
            timeout: { type: 'number', description: 'Timeout in ms (default: 30000)' }
          },
          required: ['selector']
        }
      },
      {
        name: 'playwright_wait_for_timeout',
        description: 'Wait for specified time',
        inputSchema: {
          type: 'object',
          properties: {
            milliseconds: { type: 'number', description: 'Time to wait in ms' }
          },
          required: ['milliseconds']
        }
      },
      {
        name: 'playwright_wait_for_load_state',
        description: 'Wait for page load state',
        inputSchema: {
          type: 'object',
          properties: {
            state: { type: 'string', description: 'State: load, domcontentloaded, networkidle' }
          },
          required: ['state']
        }
      },
      {
        name: 'playwright_wait_for_url',
        description: 'Wait for specific URL',
        inputSchema: {
          type: 'object',
          properties: {
            url: { type: 'string', description: 'URL pattern to wait for' },
            timeout: { type: 'number', description: 'Timeout in ms (default: 30000)' }
          },
          required: ['url']
        }
      },

      // ========================================
      // SCREENSHOT & MEDIA TOOLS
      // ========================================
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
        name: 'playwright_screenshot_element',
        description: 'Take screenshot of specific element',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector' },
            path: { type: 'string', description: 'Path to save screenshot' }
          },
          required: ['selector', 'path']
        }
      },
      {
        name: 'playwright_screenshot_full_page',
        description: 'Take full page screenshot',
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'Path to save screenshot' }
          },
          required: ['path']
        }
      },
      {
        name: 'playwright_generate_pdf',
        description: 'Generate PDF of current page',
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'Path to save PDF' }
          },
          required: ['path']
        }
      },

      // ========================================
      // PAGE INFORMATION TOOLS
      // ========================================
      {
        name: 'playwright_get_title',
        description: 'Get page title',
        inputSchema: { type: 'object', properties: {} }
      },
      {
        name: 'playwright_get_url',
        description: 'Get current URL',
        inputSchema: { type: 'object', properties: {} }
      },
      {
        name: 'playwright_get_content',
        description: 'Get full page HTML content',
        inputSchema: { type: 'object', properties: {} }
      },
      {
        name: 'playwright_get_cookies',
        description: 'Get all cookies',
        inputSchema: { type: 'object', properties: {} }
      },
      {
        name: 'playwright_set_cookie',
        description: 'Set a cookie',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Cookie name' },
            value: { type: 'string', description: 'Cookie value' }
          },
          required: ['name', 'value']
        }
      },
      {
        name: 'playwright_clear_cookies',
        description: 'Clear all cookies',
        inputSchema: { type: 'object', properties: {} }
      },

      // ========================================
      // KEYBOARD & MOUSE TOOLS
      // ========================================
      {
        name: 'playwright_keyboard_press',
        description: 'Press a keyboard key',
        inputSchema: {
          type: 'object',
          properties: {
            key: { type: 'string', description: 'Key to press' }
          },
          required: ['key']
        }
      },
      {
        name: 'playwright_keyboard_type',
        description: 'Type text with keyboard',
        inputSchema: {
          type: 'object',
          properties: {
            text: { type: 'string', description: 'Text to type' },
            delay: { type: 'number', description: 'Delay between keys in ms' }
          },
          required: ['text']
        }
      },
      {
        name: 'playwright_mouse_click',
        description: 'Click at specific coordinates',
        inputSchema: {
          type: 'object',
          properties: {
            x: { type: 'number', description: 'X coordinate' },
            y: { type: 'number', description: 'Y coordinate' }
          },
          required: ['x', 'y']
        }
      },
      {
        name: 'playwright_scroll_to',
        description: 'Scroll to specific position',
        inputSchema: {
          type: 'object',
          properties: {
            x: { type: 'number', description: 'X position' },
            y: { type: 'number', description: 'Y position' }
          },
          required: ['x', 'y']
        }
      },
      {
        name: 'playwright_scroll_into_view',
        description: 'Scroll element into view',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector' }
          },
          required: ['selector']
        }
      },

      // ========================================
      // DRAG AND DROP TOOLS
      // ========================================
      {
        name: 'playwright_drag_and_drop',
        description: 'Drag and drop an element to another element',
        inputSchema: {
          type: 'object',
          properties: {
            sourceSelector: { type: 'string', description: 'Source element CSS selector' },
            targetSelector: { type: 'string', description: 'Target element CSS selector' }
          },
          required: ['sourceSelector', 'targetSelector']
        }
      },
      {
        name: 'playwright_drag_and_drop_by_coordinates',
        description: 'Drag an element to specific coordinates',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'Element CSS selector to drag' },
            targetX: { type: 'number', description: 'Target X coordinate' },
            targetY: { type: 'number', description: 'Target Y coordinate' }
          },
          required: ['selector', 'targetX', 'targetY']
        }
      },

      // ========================================
      // UTILITY TOOLS
      // ========================================
      {
        name: 'playwright_count_elements',
        description: 'Count matching elements',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector' }
          },
          required: ['selector']
        }
      },
      {
        name: 'playwright_set_viewport',
        description: 'Set browser viewport size',
        inputSchema: {
          type: 'object',
          properties: {
            width: { type: 'number', description: 'Width in pixels' },
            height: { type: 'number', description: 'Height in pixels' }
          },
          required: ['width', 'height']
        }
      },
      {
        name: 'playwright_evaluate',
        description: 'Execute JavaScript in page context',
        inputSchema: {
          type: 'object',
          properties: {
            script: { type: 'string', description: 'JavaScript code to execute' }
          },
          required: ['script']
        }
      },

      // ========================================
      // NETWORK CONTROL TOOLS (Phase 2)
      // ========================================
      {
        name: 'playwright_route_request',
        description: 'Intercept and mock HTTP requests by URL pattern',
        inputSchema: {
          type: 'object',
          properties: {
            urlPattern: { type: 'string', description: 'URL pattern to intercept (supports wildcards)' },
            handler: {
              description: 'Handler: "abort", "continue", or object with status/body for mocking',
              oneOf: [
                { type: 'string' },
                { type: 'object' }
              ]
            }
          },
          required: ['urlPattern', 'handler']
        }
      },
      {
        name: 'playwright_abort_request',
        description: 'Abort HTTP requests matching URL pattern',
        inputSchema: {
          type: 'object',
          properties: {
            urlPattern: { type: 'string', description: 'URL pattern to abort (supports wildcards)' }
          },
          required: ['urlPattern']
        }
      },
      {
        name: 'playwright_get_network_activity',
        description: 'Get network monitoring information',
        inputSchema: { type: 'object', properties: {} }
      },

      // ========================================
      // ADVANCED DEBUGGING TOOLS (Phase 2)
      // ========================================
      {
        name: 'playwright_setup_console_capture',
        description: 'Start capturing browser console logs (max 10,000 entries)',
        inputSchema: { type: 'object', properties: {} }
      },
      {
        name: 'playwright_get_console_logs',
        description: 'Retrieve all captured console logs with type, text, and timestamp',
        inputSchema: { type: 'object', properties: {} }
      },
      {
        name: 'playwright_clear_console_logs',
        description: 'Clear the console log buffer',
        inputSchema: { type: 'object', properties: {} }
      },
      {
        name: 'playwright_start_tracing',
        description: 'Start Playwright trace recording for debugging',
        inputSchema: {
          type: 'object',
          properties: {
            options: {
              type: 'object',
              description: 'Trace options (screenshots, snapshots, etc.)',
              properties: {
                screenshots: { type: 'boolean' },
                snapshots: { type: 'boolean' }
              }
            }
          }
        }
      },
      {
        name: 'playwright_stop_tracing',
        description: 'Stop trace recording and save to file',
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'Path to save trace file (.zip)' }
          },
          required: ['path']
        }
      },

      // ========================================
      // SYSTEM & ENVIRONMENT TOOLS (Phase 2)
      // ========================================
      {
        name: 'playwright_set_geolocation',
        description: 'Set fake geolocation coordinates',
        inputSchema: {
          type: 'object',
          properties: {
            latitude: { type: 'number', description: 'Latitude (-90 to 90)' },
            longitude: { type: 'number', description: 'Longitude (-180 to 180)' }
          },
          required: ['latitude', 'longitude']
        }
      },
      {
        name: 'playwright_grant_permissions',
        description: 'Grant browser permissions (geolocation, notifications, camera, etc.)',
        inputSchema: {
          type: 'object',
          properties: {
            permissions: {
              type: 'array',
              description: 'Array of permission names',
              items: { type: 'string' }
            }
          },
          required: ['permissions']
        }
      },
      {
        name: 'playwright_clear_permissions',
        description: 'Clear all granted browser permissions',
        inputSchema: { type: 'object', properties: {} }
      },
      {
        name: 'playwright_set_timezone',
        description: 'Set timezone emulation (must be set during context creation)',
        inputSchema: {
          type: 'object',
          properties: {
            timezoneId: { type: 'string', description: 'IANA timezone identifier (e.g., America/New_York)' }
          },
          required: ['timezoneId']
        }
      },

      // ========================================
      // ACCESSIBILITY TOOLS (Phase 2)
      // ========================================
      {
        name: 'playwright_get_accessibility_snapshot',
        description: 'Get accessibility tree snapshot for testing',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'Optional CSS selector to scope the snapshot' }
          }
        }
      },

      // ========================================
      // OBSERVABILITY TOOLS (Phase 3)
      // ========================================
      {
        name: 'playwright_get_latest_recording_path',
        description: 'Get filesystem path to the video recording of the current session (requires video recording enabled)',
        inputSchema: { type: 'object', properties: {} }
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
    // Critical: Validate request structure before destructuring
    if (!request.params) {
      throw new Error('Missing request params');
    }

    if (!request.params.name) {
      throw new Error('Missing tool name in request params');
    }

    const { name, arguments: args } = request.params;

    // Validate that arguments is an object (can be empty but must exist)
    if (!args || typeof args !== 'object') {
      throw new Error('Invalid or missing arguments parameter');
    }

    let result;

    // Map tool names to service methods
    const toolMap = {
      // Navigation
      'playwright_navigate': () => this.playwrightService.navigate(args.url),
      'playwright_go_back': () => this.playwrightService.goBack(),
      'playwright_go_forward': () => this.playwrightService.goForward(),
      'playwright_reload': () => this.playwrightService.reload(),

      // Basic Interactions
      'playwright_click': () => this.playwrightService.click(args.selector),
      'playwright_double_click': () => this.playwrightService.doubleClick(args.selector),
      'playwright_right_click': () => this.playwrightService.rightClick(args.selector),
      'playwright_hover': () => this.playwrightService.hover(args.selector),
      'playwright_fill': () => this.playwrightService.fill(args.selector, args.value),
      'playwright_type': () => this.playwrightService.type(args.selector, args.text, args.delay),
      'playwright_clear': () => this.playwrightService.clear(args.selector),
      'playwright_press': () => this.playwrightService.press(args.selector, args.key),

      // Advanced Selectors
      'playwright_click_by_text': () => this.playwrightService.clickByText(args.text, args.exact),
      'playwright_click_by_role': () => this.playwrightService.clickByRole(args.role, args.name),
      'playwright_click_by_label': () => this.playwrightService.clickByLabel(args.label),
      'playwright_click_by_placeholder': () => this.playwrightService.clickByPlaceholder(args.placeholder),
      'playwright_click_by_test_id': () => this.playwrightService.clickByTestId(args.testId),
      'playwright_fill_by_label': () => this.playwrightService.fillByLabel(args.label, args.value),
      'playwright_fill_by_placeholder': () => this.playwrightService.fillByPlaceholder(args.placeholder, args.value),

      // Text & Content
      'playwright_get_text': () => this.playwrightService.getText(args.selector),
      'playwright_get_inner_text': () => this.playwrightService.getInnerText(args.selector),
      'playwright_get_inner_html': () => this.playwrightService.getInnerHTML(args.selector),
      'playwright_get_attribute': () => this.playwrightService.getAttribute(args.selector, args.attribute),
      'playwright_get_value': () => this.playwrightService.getValue(args.selector),
      'playwright_get_all_text': () => this.playwrightService.getAllText(args.selector),

      // Element State
      'playwright_is_visible': () => this.playwrightService.isVisible(args.selector),
      'playwright_is_hidden': () => this.playwrightService.isHidden(args.selector),
      'playwright_is_enabled': () => this.playwrightService.isEnabled(args.selector),
      'playwright_is_disabled': () => this.playwrightService.isDisabled(args.selector),
      'playwright_is_checked': () => this.playwrightService.isChecked(args.selector),
      'playwright_element_exists': () => this.playwrightService.elementExists(args.selector),

      // Form Interactions
      'playwright_check': () => this.playwrightService.check(args.selector),
      'playwright_uncheck': () => this.playwrightService.uncheck(args.selector),
      'playwright_select_option': () => this.playwrightService.selectOption(args.selector, args.value),
      'playwright_upload_file': () => this.playwrightService.uploadFile(args.selector, args.filePath),

      // Waiting
      'playwright_wait_for_selector': () => this.playwrightService.waitForSelector(args.selector, args.timeout),
      'playwright_wait_for_timeout': () => this.playwrightService.waitForTimeout(args.milliseconds),
      'playwright_wait_for_load_state': () => this.playwrightService.waitForLoadState(args.state),
      'playwright_wait_for_url': () => this.playwrightService.waitForURL(args.url, args.timeout),

      // Screenshots
      'playwright_screenshot': () => this.playwrightService.screenshot(args.path),
      'playwright_screenshot_element': () => this.playwrightService.screenshotElement(args.selector, args.path),
      'playwright_screenshot_full_page': () => this.playwrightService.screenshotFullPage(args.path),
      'playwright_generate_pdf': () => this.playwrightService.pdf(args.path),

      // Page Info
      'playwright_get_title': () => this.playwrightService.getTitle(),
      'playwright_get_url': () => this.playwrightService.getURL(),
      'playwright_get_content': () => this.playwrightService.getContent(),
      'playwright_get_cookies': () => this.playwrightService.getCookies(),
      'playwright_set_cookie': () => this.playwrightService.setCookie(args.name, args.value),
      'playwright_clear_cookies': () => this.playwrightService.clearCookies(),

      // Keyboard & Mouse
      'playwright_keyboard_press': () => this.playwrightService.keyboardPress(args.key),
      'playwright_keyboard_type': () => this.playwrightService.keyboardType(args.text, args.delay),
      'playwright_mouse_click': () => this.playwrightService.mouseClick(args.x, args.y),
      'playwright_scroll_to': () => this.playwrightService.scrollTo(args.x, args.y),
      'playwright_scroll_into_view': () => this.playwrightService.scrollIntoView(args.selector),

      // Drag and Drop
      'playwright_drag_and_drop': () => this.playwrightService.dragAndDrop(args.sourceSelector, args.targetSelector),
      'playwright_drag_and_drop_by_coordinates': () => this.playwrightService.dragAndDropByCoordinates(args.selector, args.targetX, args.targetY),

      // Utilities
      'playwright_count_elements': () => this.playwrightService.countElements(args.selector),
      'playwright_set_viewport': () => this.playwrightService.setViewportSize(args.width, args.height),
      'playwright_evaluate': () => this.playwrightService.evaluate(args.script),

      // ========================================
      // NETWORK CONTROL (Phase 2)
      // ========================================
      'playwright_route_request': () => this.playwrightService.routeRequest(args.urlPattern, args.handler),
      'playwright_abort_request': () => this.playwrightService.abortRequest(args.urlPattern),
      'playwright_get_network_activity': () => this.playwrightService.getNetworkActivity(),

      // ========================================
      // ADVANCED DEBUGGING (Phase 2)
      // ========================================
      'playwright_setup_console_capture': () => this.playwrightService.setupConsoleCapture(),
      'playwright_get_console_logs': () => this.playwrightService.getConsoleLogs(),
      'playwright_clear_console_logs': () => this.playwrightService.clearConsoleLogs(),
      'playwright_start_tracing': () => this.playwrightService.startTracing(args.options),
      'playwright_stop_tracing': () => this.playwrightService.stopTracing(args.path),

      // ========================================
      // SYSTEM & ENVIRONMENT (Phase 2)
      // ========================================
      'playwright_set_geolocation': () => this.playwrightService.setGeolocation(args.latitude, args.longitude),
      'playwright_grant_permissions': () => this.playwrightService.grantPermissions(args.permissions),
      'playwright_clear_permissions': () => this.playwrightService.clearPermissions(),
      'playwright_set_timezone': () => this.playwrightService.setTimezone(args.timezoneId),

      // ========================================
      // ACCESSIBILITY (Phase 2)
      // ========================================
      'playwright_get_accessibility_snapshot': () => this.playwrightService.getAccessibilitySnapshot(args.selector),

      // ========================================
      // OBSERVABILITY (Phase 3)
      // ========================================
      'playwright_get_latest_recording_path': () => this.playwrightService.getLatestRecordingPath()
    };

    const toolFunction = toolMap[name];
    if (!toolFunction) {
      throw new Error(`Unknown tool: ${name}`);
    }

    result = await toolFunction();

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
    // Include more context in error response for better debugging
    const errorResponse = {
      jsonrpc: '2.0',
      id,
      error: {
        code: -32603,
        message: error.message || 'Unknown error',
        data: {
          type: error.constructor.name,
          // Include stack trace in development mode only
          ...(process.env.NODE_ENV !== 'production' && error.stack ? { stack: error.stack } : {})
        }
      }
    };

    return errorResponse;
  }
}