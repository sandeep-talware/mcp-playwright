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
      dragAndDropByCoordinates: ['selector', 'targetX', 'targetY']
,

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

    if (!requiredParams[action]) {
      throw new Error(`Unknown action: ${action}`);
    }

    for (const param of requiredParams[action]) {
      if (params[param] === undefined || params[param] === null) {
        throw new Error(`Missing required parameter: ${param}`);
      }
    }

    return true;
  }
}
