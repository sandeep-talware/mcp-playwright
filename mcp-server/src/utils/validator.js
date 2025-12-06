/**
 * @author Sandeep Talware
 */

export class Validator {
  static validateMCPRequest(request) {
    if (!request || typeof request !== 'object') {
      throw new Error('Invalid request format');
    }

    if (!request.jsonrpc || request.jsonrpc !== '2.0') {
      throw new Error('Invalid JSON-RPC version');
    }

    if (!request.method || typeof request.method !== 'string') {
      throw new Error('Missing or invalid method');
    }

    if (!request.id) {
      throw new Error('Missing request ID');
    }

    return true;
  }

  static validatePlaywrightAction(action, params) {
    const requiredParams = {
      // Navigation
      navigate: ['url'],
      goBack: [],
      goForward: [],
      reload: [],

      // Basic Interactions
      click: ['selector'],
      doubleClick: ['selector'],
      rightClick: ['selector'],
      hover: ['selector'],
      fill: ['selector', 'value'],
      type: ['selector', 'text'],
      clear: ['selector'],
      press: ['selector', 'key'],
      check: ['selector'],
      uncheck: ['selector'],
      selectOption: ['selector', 'value'],
      uploadFile: ['selector', 'filePath'],

      // Advanced Selectors
      clickByText: ['text'],
      clickByRole: ['role'],
      clickByLabel: ['label'],
      clickByPlaceholder: ['placeholder'],
      clickByTestId: ['testId'],
      clickByTitle: ['title'],
      clickByAltText: ['altText'],
      fillByLabel: ['label', 'value'],
      fillByPlaceholder: ['placeholder', 'value'],

      // Data Extraction
      getText: ['selector'],
      getInnerText: ['selector'],
      getInnerHTML: ['selector'],
      getAttribute: ['selector', 'attribute'],
      getValue: ['selector'],
      getAllText: ['selector'],
      getTitle: [],
      getURL: [],
      getContent: [],
      getCookies: [],

      // State & Validation
      isVisible: ['selector'],
      isHidden: ['selector'],
      isEnabled: ['selector'],
      isDisabled: ['selector'],
      isChecked: ['selector'],
      isEditable: ['selector'],
      elementExists: ['selector'],
      countElements: ['selector'],

      // Waiting
      waitForSelector: ['selector'],
      waitForTimeout: ['milliseconds'],
      waitForLoadState: [],
      waitForURL: ['url'],
      waitForNavigation: [],

      // Screenshots & PDF
      screenshot: ['path'],
      screenshotElement: ['selector', 'path'],
      screenshotFullPage: ['path'],
      pdf: ['path'],

      // Browser Control
      setViewportSize: ['width', 'height'],
      emulateDevice: ['deviceName'],
      setCookie: ['name', 'value'],
      clearCookies: [],
      addScriptTag: ['options'],
      addStyleTag: ['options'],

      // Script Evaluation
      evaluate: ['script'],

      // Input Control
      keyboardPress: ['key'],
      keyboardType: ['text'],
      mouseClick: ['x', 'y'],
      mouseMove: ['x', 'y'],
      scrollTo: ['x', 'y'],
      scrollIntoView: ['selector'],

      // Drag and Drop
      dragAndDrop: ['sourceSelector', 'targetSelector'],
      dragAndDropByCoordinates: ['selector', 'targetX', 'targetY'],

      // Frames
      switchToFrame: ['selector'],
      getFrames: [],

      // Phase 2: Network Control
      routeRequest: ['urlPattern', 'handler'],
      abortRequest: ['urlPattern'],
      getNetworkActivity: [],

      // Phase 2: Advanced Debugging
      setupConsoleCapture: [],
      getConsoleLogs: [],
      clearConsoleLogs: [],
      startTracing: [],
      stopTracing: ['path'],

      // Phase 2: System & Environment
      setGeolocation: ['latitude', 'longitude'],
      grantPermissions: ['permissions'],
      clearPermissions: [],
      setTimezone: ['timezoneId'],

      // Phase 2: Accessibility
      getAccessibilitySnapshot: []

    };

    // Optional parameters with type validation
    const optionalParams = {
      type: { delay: 'number' },
      waitForSelector: { timeout: 'number' },
      waitForURL: { timeout: 'number' },
      waitForFunction: { timeout: 'number' },
      clickByText: { exact: 'boolean' },
      keyboardType: { delay: 'number' }
    };

    // Validate action exists
    if (!requiredParams[action]) {
      throw new Error(`Unknown action: ${action}`);
    }

    // Validate required parameters
    for (const param of requiredParams[action]) {
      if (params[param] === undefined || params[param] === null) {
        throw new Error(`Missing required parameter: ${param}`);
      }

      // Type validation for specific parameters
      this._validateParameterType(param, params[param]);
    }

    // Validate optional parameters if present
    if (optionalParams[action]) {
      for (const [param, expectedType] of Object.entries(optionalParams[action])) {
        if (params[param] !== undefined && params[param] !== null) {
          const actualType = typeof params[param];
          if (actualType !== expectedType) {
            throw new Error(
              `Invalid type for parameter '${param}': expected ${expectedType}, got ${actualType}`
            );
          }
        }
      }
    }

    return true;
  }

  /**
   * Validates parameter types and value ranges
   * @private
   */
  static _validateParameterType(param, value) {
    // String parameters (selectors, URLs, etc.)
    if (['selector', 'url', 'text', 'key', 'script', 'path', 'label',
      'placeholder', 'testId', 'title', 'altText', 'role', 'name',
      'attribute', 'deviceName', 'urlPattern', 'filePath'].includes(param)) {
      if (typeof value !== 'string' || value.trim() === '') {
        throw new Error(`Parameter '${param}' must be a non-empty string`);
      }
    }

    // Number parameters (coordinates, timeouts, etc.)
    if (['x', 'y', 'targetX', 'targetY', 'width', 'height',
      'milliseconds', 'timeout', 'delay'].includes(param)) {
      if (typeof value !== 'number' || isNaN(value) || value < 0) {
        throw new Error(`Parameter '${param}' must be a non-negative number`);
      }
    }

    // Geolocation validation
    if (param === 'latitude') {
      if (typeof value !== 'number' || value < -90 || value > 90) {
        throw new Error('Latitude must be a number between -90 and 90');
      }
    }
    if (param === 'longitude') {
      if (typeof value !== 'number' || value < -180 || value > 180) {
        throw new Error('Longitude must be a number between -180 and 180');
      }
    }

    // Array parameters
    if (param === 'permissions') {
      if (!Array.isArray(value) || value.length === 0) {
        throw new Error('Permissions must be a non-empty array');
      }
    }

    // Object parameters
    if (['options', 'handler'].includes(param)) {
      if (typeof value !== 'object' && typeof value !== 'string') {
        throw new Error(`Parameter '${param}' must be an object or string`);
      }
    }
  }
}