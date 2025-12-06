/**
 * @author Sandeep Talware
 */

import { Logger } from '../utils/logger.js';
import { Validator } from '../utils/validator.js';

export class PlaywrightController {
  constructor(playwrightService) {
    this.playwrightService = playwrightService;
    this.logger = new Logger('PlaywrightController');
  }

  async handleAction(action, params) {
    try {
      this.logger.info('Handling Playwright action', { action, params });

      // Validate the action and parameters
      Validator.validatePlaywrightAction(action, params);

      let result;

      switch (action) {
        // Navigation Actions
        case 'navigate':
          result = await this.playwrightService.navigate(params.url);
          break;
        case 'goBack':
          result = await this.playwrightService.goBack();
          break;
        case 'goForward':
          result = await this.playwrightService.goForward();
          break;
        case 'reload':
          result = await this.playwrightService.reload();
          break;

        // Basic Interaction Actions
        case 'click':
          result = await this.playwrightService.click(params.selector);
          break;
        case 'doubleClick':
          result = await this.playwrightService.doubleClick(params.selector);
          break;
        case 'rightClick':
          result = await this.playwrightService.rightClick(params.selector);
          break;
        case 'hover':
          result = await this.playwrightService.hover(params.selector);
          break;
        case 'fill':
          result = await this.playwrightService.fill(params.selector, params.value);
          break;
        case 'type':
          result = await this.playwrightService.type(params.selector, params.text, params.delay);
          break;
        case 'clear':
          result = await this.playwrightService.clear(params.selector);
          break;
        case 'press':
          result = await this.playwrightService.press(params.selector, params.key);
          break;
        case 'check':
          result = await this.playwrightService.check(params.selector);
          break;
        case 'uncheck':
          result = await this.playwrightService.uncheck(params.selector);
          break;
        case 'selectOption':
          result = await this.playwrightService.selectOption(params.selector, params.value);
          break;
        case 'uploadFile':
          result = await this.playwrightService.uploadFile(params.selector, params.filePath);
          break;

        // Advanced Selector Actions
        case 'clickByText':
          result = await this.playwrightService.clickByText(params.text, params.exact);
          break;
        case 'clickByRole':
          result = await this.playwrightService.clickByRole(params.role, params.name);
          break;
        case 'clickByLabel':
          result = await this.playwrightService.clickByLabel(params.label);
          break;
        case 'clickByPlaceholder':
          result = await this.playwrightService.clickByPlaceholder(params.placeholder);
          break;
        case 'clickByTestId':
          result = await this.playwrightService.clickByTestId(params.testId);
          break;
        case 'clickByTitle':
          result = await this.playwrightService.clickByTitle(params.title);
          break;
        case 'clickByAltText':
          result = await this.playwrightService.clickByAltText(params.altText);
          break;
        case 'fillByLabel':
          result = await this.playwrightService.fillByLabel(params.label, params.value);
          break;
        case 'fillByPlaceholder':
          result = await this.playwrightService.fillByPlaceholder(params.placeholder, params.value);
          break;

        // Data Extraction Actions
        case 'getText':
          result = await this.playwrightService.getText(params.selector);
          break;
        case 'getInnerText':
          result = await this.playwrightService.getInnerText(params.selector);
          break;
        case 'getInnerHTML':
          result = await this.playwrightService.getInnerHTML(params.selector);
          break;
        case 'getAttribute':
          result = await this.playwrightService.getAttribute(params.selector, params.attribute);
          break;
        case 'getValue':
          result = await this.playwrightService.getValue(params.selector);
          break;
        case 'getAllText':
          result = await this.playwrightService.getAllText(params.selector);
          break;
        case 'getTitle':
          result = await this.playwrightService.getTitle();
          break;
        case 'getURL':
          result = await this.playwrightService.getURL();
          break;
        case 'getContent':
          result = await this.playwrightService.getContent();
          break;
        case 'getCookies':
          result = await this.playwrightService.getCookies();
          break;

        // State & Validation Actions
        case 'isVisible':
          result = await this.playwrightService.isVisible(params.selector);
          break;
        case 'isHidden':
          result = await this.playwrightService.isHidden(params.selector);
          break;
        case 'isEnabled':
          result = await this.playwrightService.isEnabled(params.selector);
          break;
        case 'isDisabled':
          result = await this.playwrightService.isDisabled(params.selector);
          break;
        case 'isChecked':
          result = await this.playwrightService.isChecked(params.selector);
          break;
        case 'isEditable':
          result = await this.playwrightService.isEditable(params.selector);
          break;
        case 'elementExists':
          result = await this.playwrightService.elementExists(params.selector);
          break;
        case 'countElements':
          result = await this.playwrightService.countElements(params.selector);
          break;

        // Waiting Actions
        case 'waitForSelector':
          result = await this.playwrightService.waitForSelector(params.selector, params.timeout);
          break;
        case 'waitForTimeout':
          result = await this.playwrightService.waitForTimeout(params.milliseconds);
          break;
        case 'waitForLoadState':
          result = await this.playwrightService.waitForLoadState(params.state);
          break;
        case 'waitForURL':
          result = await this.playwrightService.waitForURL(params.url, params.timeout);
          break;
        case 'waitForNavigation':
          result = await this.playwrightService.waitForNavigation();
          break;

        // Screenshot & PDF Actions
        case 'screenshot':
          result = await this.playwrightService.screenshot(params.path, params.options);
          break;
        case 'screenshotElement':
          result = await this.playwrightService.screenshotElement(params.selector, params.path);
          break;
        case 'screenshotFullPage':
          result = await this.playwrightService.screenshotFullPage(params.path);
          break;
        case 'pdf':
          result = await this.playwrightService.pdf(params.path, params.options);
          break;

        // Browser Control Actions
        case 'setViewportSize':
          result = await this.playwrightService.setViewportSize(params.width, params.height);
          break;
        case 'emulateDevice':
          result = await this.playwrightService.emulateDevice(params.deviceName);
          break;
        case 'setCookie':
          result = await this.playwrightService.setCookie(params.name, params.value, params.options);
          break;
        case 'clearCookies':
          result = await this.playwrightService.clearCookies();
          break;
        case 'addScriptTag':
          result = await this.playwrightService.addScriptTag(params.options);
          break;
        case 'addStyleTag':
          result = await this.playwrightService.addStyleTag(params.options);
          break;

        // Script Evaluation Actions
        case 'evaluate':
          result = await this.playwrightService.evaluate(params.script, params.arg);
          break;

        // Input Control Actions
        case 'keyboardPress':
          result = await this.playwrightService.keyboardPress(params.key);
          break;
        case 'keyboardType':
          result = await this.playwrightService.keyboardType(params.text, params.delay);
          break;
        case 'mouseClick':
          result = await this.playwrightService.mouseClick(params.x, params.y);
          break;
        case 'mouseMove':
          result = await this.playwrightService.mouseMove(params.x, params.y);
          break;
        case 'scrollTo':
          result = await this.playwrightService.scrollTo(params.x, params.y);
          break;
        case 'scrollIntoView':
          result = await this.playwrightService.scrollIntoView(params.selector);
          break;
        case 'dragAndDrop':
          result = await this.playwrightService.dragAndDrop(params.sourceSelector, params.targetSelector);
          break;
        case 'dragAndDropByCoordinates':
          result = await this.playwrightService.dragAndDropByCoordinates(params.selector, params.targetX, params.targetY);
          break;
        // Frame Actions
        case 'switchToFrame':
          result = await this.playwrightService.switchToFrame(params.selector);
          break;
        case 'getFrames':
          result = await this.playwrightService.getFrames();
          break;
        // Network Control Actions (Phase 2)
        case 'routeRequest':
          result = await this.playwrightService.routeRequest(params.urlPattern, params.handler);
          break;
        case 'abortRequest':
          result = await this.playwrightService.abortRequest(params.urlPattern);
          break;
        case 'getNetworkActivity':
          result = await this.playwrightService.getNetworkActivity();
          break;

        // Advanced Debugging Actions (Phase 2)
        case 'setupConsoleCapture':
          result = await this.playwrightService.setupConsoleCapture();
          break;
        case 'getConsoleLogs':
          result = await this.playwrightService.getConsoleLogs();
          break;
        case 'clearConsoleLogs':
          result = await this.playwrightService.clearConsoleLogs();
          break;
        case 'startTracing':
          result = await this.playwrightService.startTracing(params.options);
          break;
        case 'stopTracing':
          result = await this.playwrightService.stopTracing(params.path);
          break;

        // System & Environment Actions (Phase 2)
        case 'setGeolocation':
          result = await this.playwrightService.setGeolocation(params.latitude, params.longitude);
          break;
        case 'grantPermissions':
          result = await this.playwrightService.grantPermissions(params.permissions);
          break;
        case 'clearPermissions':
          result = await this.playwrightService.clearPermissions();
          break;
        case 'setTimezone':
          result = await this.playwrightService.setTimezone(params.timezoneId);
          break;

        // Accessibility Actions (Phase 2)
        case 'getAccessibilitySnapshot':
          result = await this.playwrightService.getAccessibilitySnapshot(params.selector);
          break;



        default:
          throw new Error(`Unknown action: ${action}`);
      }

      this.logger.info('Action completed successfully', { action, result });
      return {
        success: true,
        action,
        result
      };

    } catch (error) {
      this.logger.error('Action failed', error);
      return {
        success: false,
        action,
        error: error.message,
        stack: error.stack
      };
    }
  }

  async executeBatch(actions) {
    this.logger.info('Executing batch actions', { count: actions.length });
    const results = [];

    for (const actionConfig of actions) {
      const { action, params } = actionConfig;
      const result = await this.handleAction(action, params);
      results.push(result);

      // Stop batch execution if any action fails
      if (!result.success) {
        this.logger.error('Batch execution stopped due to error', { action });
        break;
      }
    }

    return {
      totalActions: actions.length,
      completedActions: results.length,
      results
    };
  }

  async getPageInfo() {
    try {
      this.logger.info('Getting page information');

      const url = this.playwrightService.page.url();
      const title = await this.playwrightService.page.title();

      return {
        success: true,
        info: {
          url,
          title,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      this.logger.error('Failed to get page info', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}