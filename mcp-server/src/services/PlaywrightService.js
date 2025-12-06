/**
 * @author Sandeep Talware
 */

import { chromium } from 'playwright';
import { Logger } from '../utils/logger.js';
import { config } from '../config/config.js';

export class PlaywrightService {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
    this.logger = new Logger('PlaywrightService');
    this.isInitialized = false;
    this.dialogHandler = null;
    this.consoleLogs = null;
  }

  /**
   * Ensures the browser is initialized before operations
   * @throws {Error} If browser is not initialized
   * @private
   */
  _ensureInitialized() {
    if (!this.isInitialized || !this.page || !this.browser) {
      throw new Error(
        'Browser not initialized. Call initialize() first before performing any operations.'
      );
    }
  }

  async initialize() {
    try {
      if (this.isInitialized) {
        this.logger.info('Browser already initialized, skipping');
        return true;
      }

      this.logger.info('Initializing Playwright browser');
      this.browser = await chromium.launch({
        headless: config.playwright.headless,
        slowMo: config.playwright.slowMo
      });

      const contextOptions = {};
      if (config.recording && config.recording.enabled) {
        this.logger.info('Enabling video recording', config.recording);
        contextOptions.recordVideo = {
          dir: config.recording.dir,
          size: config.recording.size
        };
      }

      this.context = await this.browser.newContext(contextOptions);
      this.page = await this.context.newPage();
      this.page.setDefaultTimeout(config.playwright.defaultTimeout);

      this.isInitialized = true;
      this.logger.info('Playwright browser initialized successfully');
      return true;
    } catch (error) {
      this.logger.error('Failed to initialize Playwright', error);
      this.isInitialized = false;
      throw error;
    }
  }

  // ========================================
  // BASIC NAVIGATION & INTERACTION
  // ========================================

  async navigate(url) {
    this._ensureInitialized();
    this.logger.info('Navigating to URL', { url });
    await this.page.goto(url);
    return { status: 'success', url };
  }

  async goBack() {
    this._ensureInitialized();
    this.logger.info('Navigating back');
    await this.page.goBack();
    return { status: 'success' };
  }

  async goForward() {
    this._ensureInitialized();
    this.logger.info('Navigating forward');
    await this.page.goForward();
    return { status: 'success' };
  }

  async reload() {
    this._ensureInitialized();
    this.logger.info('Reloading page');
    await this.page.reload();
    return { status: 'success' };
  }

  async click(selector) {
    this._ensureInitialized();
    this.logger.info('Clicking element', { selector });
    return this._smartRetry('click', selector, async (s) => {
      await this.page.click(s);
      return { status: 'success', selector: s };
    });
  }

  async doubleClick(selector) {
    this._ensureInitialized();
    this.logger.info('Double clicking element', { selector });
    await this.page.dblclick(selector);
    return { status: 'success', selector };
  }

  async rightClick(selector) {
    this._ensureInitialized();
    this.logger.info('Right clicking element', { selector });
    await this.page.click(selector, { button: 'right' });
    return { status: 'success', selector };
  }

  async hover(selector) {
    this._ensureInitialized();
    this.logger.info('Hovering over element', { selector });
    await this.page.hover(selector);
    return { status: 'success', selector };
  }

  async fill(selector, value) {
    this._ensureInitialized();
    this.logger.info('Filling input', { selector });
    return this._smartRetry('fill', selector, async (s) => {
      await this.page.fill(s, value);
      return { status: 'success', selector: s, value };
    });
  }

  async type(selector, text, delay = 100) {
    this._ensureInitialized();
    this.logger.info('Typing text', { selector, delay });
    await this.page.type(selector, text, { delay });
    return { status: 'success', selector, text };
  }

  async clear(selector) {
    this._ensureInitialized();
    this.logger.info('Clearing input', { selector });
    await this.page.fill(selector, '');
    return { status: 'success', selector };
  }

  async press(selector, key) {
    this._ensureInitialized();
    this.logger.info('Pressing key', { selector, key });
    await this.page.press(selector, key);
    return { status: 'success', selector, key };
  }

  // ========================================
  // ADVANCED SELECTORS
  // ========================================

  async clickByText(text, exact = false) {
    this._ensureInitialized();
    this.logger.info('Clicking element by text', { text, exact });
    const selector = exact ? `text="${text}"` : `text=${text}`;
    await this.page.click(selector);
    return { status: 'success', text };
  }

  async clickByRole(role, name) {
    this._ensureInitialized();
    this.logger.info('Clicking element by role', { role, name });
    await this.page.getByRole(role, { name }).click();
    return { status: 'success', role, name };
  }

  async clickByLabel(label) {
    this._ensureInitialized();
    this.logger.info('Clicking element by label', { label });
    await this.page.getByLabel(label).click();
    return { status: 'success', label };
  }

  async clickByPlaceholder(placeholder) {
    this._ensureInitialized();
    this.logger.info('Clicking element by placeholder', { placeholder });
    await this.page.getByPlaceholder(placeholder).click();
    return { status: 'success', placeholder };
  }

  async clickByTestId(testId) {
    this._ensureInitialized();
    this.logger.info('Clicking element by test ID', { testId });
    await this.page.getByTestId(testId).click();
    return { status: 'success', testId };
  }

  async clickByTitle(title) {
    this._ensureInitialized();
    this.logger.info('Clicking element by title', { title });
    await this.page.getByTitle(title).click();
    return { status: 'success', title };
  }

  async clickByAltText(altText) {
    this._ensureInitialized();
    this.logger.info('Clicking element by alt text', { altText });
    await this.page.getByAltText(altText).click();
    return { status: 'success', altText };
  }

  async fillByLabel(label, value) {
    this._ensureInitialized();
    this.logger.info('Filling input by label', { label });
    await this.page.getByLabel(label).fill(value);
    return { status: 'success', label, value };
  }

  async fillByPlaceholder(placeholder, value) {
    this._ensureInitialized();
    this.logger.info('Filling input by placeholder', { placeholder });
    await this.page.getByPlaceholder(placeholder).fill(value);
    return { status: 'success', placeholder, value };
  }

  // ========================================
  // TEXT & CONTENT EXTRACTION
  // ========================================

  async getText(selector) {
    this._ensureInitialized();
    this.logger.info('Getting text from element', { selector });
    const text = await this.page.textContent(selector);
    return { status: 'success', text };
  }

  async getInnerText(selector) {
    this._ensureInitialized();
    this.logger.info('Getting inner text', { selector });
    const text = await this.page.innerText(selector);
    return { status: 'success', text };
  }

  async getInnerHTML(selector) {
    this._ensureInitialized();
    this.logger.info('Getting inner HTML', { selector });
    const html = await this.page.innerHTML(selector);
    return { status: 'success', html };
  }

  async getAttribute(selector, attribute) {
    this._ensureInitialized();
    this.logger.info('Getting attribute', { selector, attribute });
    const value = await this.page.getAttribute(selector, attribute);
    return { status: 'success', attribute, value };
  }

  async getValue(selector) {
    this._ensureInitialized();
    this.logger.info('Getting input value', { selector });
    const value = await this.page.inputValue(selector);
    return { status: 'success', value };
  }

  async getAllText(selector) {
    this._ensureInitialized();
    this.logger.info('Getting all text from elements', { selector });
    const texts = await this.page.$$eval(selector, elements =>
      elements.map(el => el.textContent)
    );
    return { status: 'success', texts };
  }

  // ========================================
  // ELEMENT STATE & VALIDATION
  // ========================================

  async isVisible(selector) {
    this._ensureInitialized();
    this.logger.info('Checking visibility', { selector });
    const visible = await this.page.isVisible(selector);
    return { status: 'success', visible };
  }

  async isHidden(selector) {
    this._ensureInitialized();
    this.logger.info('Checking if hidden', { selector });
    const hidden = await this.page.isHidden(selector);
    return { status: 'success', hidden };
  }

  async isEnabled(selector) {
    this._ensureInitialized();
    this.logger.info('Checking if enabled', { selector });
    const enabled = await this.page.isEnabled(selector);
    return { status: 'success', enabled };
  }

  async isDisabled(selector) {
    this._ensureInitialized();
    this.logger.info('Checking if disabled', { selector });
    const disabled = await this.page.isDisabled(selector);
    return { status: 'success', disabled };
  }

  async isChecked(selector) {
    this._ensureInitialized();
    this.logger.info('Checking if checked', { selector });
    const checked = await this.page.isChecked(selector);
    return { status: 'success', checked };
  }

  async isEditable(selector) {
    this._ensureInitialized();
    this.logger.info('Checking if editable', { selector });
    const editable = await this.page.isEditable(selector);
    return { status: 'success', editable };
  }

  async elementExists(selector) {
    this._ensureInitialized();
    this.logger.info('Checking if element exists', { selector });
    const count = await this.page.locator(selector).count();
    return { status: 'success', exists: count > 0, count };
  }

  // ========================================
  // FORM INTERACTIONS
  // ========================================

  async check(selector) {
    this._ensureInitialized();
    this.logger.info('Checking checkbox/radio', { selector });
    return this._smartRetry('check', selector, async (s) => {
      await this.page.check(s);
      return { status: 'success', selector: s };
    });
  }

  async uncheck(selector) {
    this._ensureInitialized();
    this.logger.info('Unchecking checkbox', { selector });
    await this.page.uncheck(selector);
    return { status: 'success', selector };
  }

  async selectOption(selector, value) {
    this._ensureInitialized();
    this.logger.info('Selecting option', { selector, value });
    await this.page.selectOption(selector, value);
    return { status: 'success', selector, value };
  }

  async uploadFile(selector, filePath) {
    this._ensureInitialized();
    this.logger.info('Uploading file', { selector, filePath });
    await this.page.setInputFiles(selector, filePath);
    return { status: 'success', selector, filePath };
  }

  // ========================================
  // WAITING METHODS
  // ========================================

  async waitForSelector(selector, timeout = 30000) {
    this._ensureInitialized();
    this.logger.info('Waiting for selector', { selector, timeout });
    await this.page.waitForSelector(selector, { timeout });
    return { status: 'success', selector };
  }

  async waitForTimeout(milliseconds) {
    this._ensureInitialized();
    this.logger.info('Waiting for timeout', { milliseconds });
    await this.page.waitForTimeout(milliseconds);
    return { status: 'success', milliseconds };
  }

  async waitForLoadState(state = 'load') {
    this._ensureInitialized();
    this.logger.info('Waiting for load state', { state });
    await this.page.waitForLoadState(state);
    return { status: 'success', state };
  }

  async waitForURL(url, timeout = 30000) {
    this._ensureInitialized();
    this.logger.info('Waiting for URL', { url, timeout });
    await this.page.waitForURL(url, { timeout });
    return { status: 'success', url };
  }

  async waitForNavigation() {
    this._ensureInitialized();
    this.logger.info('Waiting for navigation');
    await this.page.waitForNavigation();
    return { status: 'success' };
  }

  async waitForFunction(fn, timeout = 30000) {
    this._ensureInitialized();
    this.logger.info('Waiting for function');
    await this.page.waitForFunction(fn, { timeout });
    return { status: 'success' };
  }

  // ========================================
  // SCREENSHOTS & MEDIA
  // ========================================

  async screenshot(path, options = {}) {
    this._ensureInitialized();
    this.logger.info('Taking screenshot', { path });
    await this.page.screenshot({ path, ...options });
    return { status: 'success', path };
  }

  async screenshotElement(selector, path) {
    this._ensureInitialized();
    this.logger.info('Taking element screenshot', { selector, path });
    const element = await this.page.locator(selector);
    await element.screenshot({ path });
    return { status: 'success', selector, path };
  }

  async screenshotFullPage(path) {
    this._ensureInitialized();
    this.logger.info('Taking full page screenshot', { path });
    await this.page.screenshot({ path, fullPage: true });
    return { status: 'success', path };
  }

  async pdf(path, options = {}) {
    this._ensureInitialized();
    this.logger.info('Generating PDF', { path });
    await this.page.pdf({ path, ...options });
    return { status: 'success', path };
  }

  // ========================================
  // PAGE INFORMATION
  // ========================================

  async getTitle() {
    this._ensureInitialized();
    this.logger.info('Getting page title');
    const title = await this.page.title();
    return { status: 'success', title };
  }

  async getURL() {
    this._ensureInitialized();
    this.logger.info('Getting page URL');
    const url = this.page.url();
    return { status: 'success', url };
  }

  async getContent() {
    this._ensureInitialized();
    this.logger.info('Getting page content');
    const content = await this.page.content();
    return { status: 'success', content };
  }

  async getCookies() {
    this._ensureInitialized();
    if (!this.context) {
      throw new Error('Browser context not available');
    }
    this.logger.info('Getting cookies');
    const cookies = await this.context.cookies();
    return { status: 'success', cookies };
  }

  async setCookie(name, value, options = {}) {
    this._ensureInitialized();
    if (!this.context) {
      throw new Error('Browser context not available');
    }
    this.logger.info('Setting cookie', { name });
    await this.context.addCookies([{ name, value, ...options }]);
    return { status: 'success', name, value };
  }

  async clearCookies() {
    this._ensureInitialized();
    if (!this.context) {
      throw new Error('Browser context not available');
    }
    this.logger.info('Clearing cookies');
    await this.context.clearCookies();
    return { status: 'success' };
  }

  // ========================================
  // JAVASCRIPT EVALUATION
  // ========================================

  async evaluate(script, arg) {
    this._ensureInitialized();
    this.logger.info('Evaluating JavaScript');
    const result = await this.page.evaluate(script, arg);
    return { status: 'success', result };
  }

  async evaluateHandle(script) {
    this._ensureInitialized();
    this.logger.info('Evaluating JavaScript handle');
    const handle = await this.page.evaluateHandle(script);
    return { status: 'success', handle: handle.toString() };
  }

  async addScriptTag(options) {
    this._ensureInitialized();
    this.logger.info('Adding script tag', options);
    await this.page.addScriptTag(options);
    return { status: 'success' };
  }

  async addStyleTag(options) {
    this._ensureInitialized();
    this.logger.info('Adding style tag', options);
    await this.page.addStyleTag(options);
    return { status: 'success' };
  }

  // ========================================
  // KEYBOARD & MOUSE
  // ========================================

  async keyboardPress(key) {
    this._ensureInitialized();
    this.logger.info('Pressing keyboard key', { key });
    await this.page.keyboard.press(key);
    return { status: 'success', key };
  }

  async keyboardType(text, delay = 0) {
    this._ensureInitialized();
    this.logger.info('Typing with keyboard', { text });
    await this.page.keyboard.type(text, { delay });
    return { status: 'success', text };
  }

  async mouseClick(x, y) {
    this._ensureInitialized();
    this.logger.info('Mouse click at coordinates', { x, y });
    await this.page.mouse.click(x, y);
    return { status: 'success', x, y };
  }

  async mouseMove(x, y) {
    this._ensureInitialized();
    this.logger.info('Moving mouse', { x, y });
    await this.page.mouse.move(x, y);
    return { status: 'success', x, y };
  }

  async scrollTo(x, y) {
    this._ensureInitialized();
    this.logger.info('Scrolling to position', { x, y });
    await this.page.evaluate(({ x, y }) => window.scrollTo(x, y), { x, y });
    return { status: 'success', x, y };
  }

  async scrollIntoView(selector) {
    this._ensureInitialized();
    this.logger.info('Scrolling element into view', { selector });
    await this.page.locator(selector).scrollIntoViewIfNeeded();
    return { status: 'success', selector };
  }
  async dragAndDrop(sourceSelector, targetSelector) {
    this._ensureInitialized();
    this.logger.info('Performing drag and drop', { sourceSelector, targetSelector });
    await this.page.dragAndDrop(sourceSelector, targetSelector);
    return { status: 'success', sourceSelector, targetSelector };
  }

  async dragAndDropByCoordinates(selector, targetX, targetY) {
    this._ensureInitialized();
    this.logger.info('Dragging element to coordinates', { selector, targetX, targetY });
    const element = await this.page.locator(selector);
    await element.dragTo(this.page.locator('body'), {
      targetPosition: { x: targetX, y: targetY }
    });
    return { status: 'success', selector, targetX, targetY };
  }

  // ========================================
  // ALERTS & DIALOGS
  // ========================================

  /**
   * Sets up automatic dialog acceptance
   * Removes any existing dialog handlers to prevent memory leaks
   * @returns {Promise<{status: string}>}
   */
  async acceptDialog() {
    this._ensureInitialized();
    this.logger.info('Setting up dialog acceptance');

    // Remove existing dialog handler if any
    if (this.dialogHandler) {
      this.page.removeListener('dialog', this.dialogHandler);
    }

    // Create and store new handler
    this.dialogHandler = async (dialog) => {
      try {
        this.logger.debug('Accepting dialog', { message: dialog.message() });
        await dialog.accept();
      } catch (error) {
        this.logger.error('Failed to accept dialog', error);
      }
    };

    this.page.on('dialog', this.dialogHandler);
    return { status: 'success' };
  }

  /**
   * Sets up automatic dialog dismissal
   * Removes any existing dialog handlers to prevent memory leaks
   * @returns {Promise<{status: string}>}
   */
  async dismissDialog() {
    this._ensureInitialized();
    this.logger.info('Setting up dialog dismissal');

    // Remove existing dialog handler if any
    if (this.dialogHandler) {
      this.page.removeListener('dialog', this.dialogHandler);
    }

    // Create and store new handler
    this.dialogHandler = async (dialog) => {
      try {
        this.logger.debug('Dismissing dialog', { message: dialog.message() });
        await dialog.dismiss();
      } catch (error) {
        this.logger.error('Failed to dismiss dialog', error);
      }
    };

    this.page.on('dialog', this.dialogHandler);
    return { status: 'success' };
  }

  // ========================================
  // NETWORK & REQUESTS
  // ========================================

  async setExtraHTTPHeaders(headers) {
    this._ensureInitialized();
    this.logger.info('Setting extra HTTP headers');
    await this.page.setExtraHTTPHeaders(headers);
    return { status: 'success', headers };
  }

  async setViewportSize(width, height) {
    this._ensureInitialized();
    this.logger.info('Setting viewport size', { width, height });
    await this.page.setViewportSize({ width, height });
    return { status: 'success', width, height };
  }

  async emulateDevice(deviceName) {
    this._ensureInitialized();
    if (!this.context || !this.browser) {
      throw new Error('Browser or context not available');
    }

    this.logger.info('Emulating device', { deviceName });
    const { devices } = await import('playwright');
    const device = devices[deviceName];
    if (!device) {
      throw new Error(`Device ${deviceName} not found`);
    }

    // Properly manage state during context recreation to avoid race conditions
    const oldContext = this.context;
    try {
      // Create new context first
      const newContext = await this.browser.newContext(device);
      const newPage = await newContext.newPage();

      // Close old context only after new one is ready
      await oldContext.close();

      // Update references
      this.context = newContext;
      this.page = newPage;
      this.page.setDefaultTimeout(config.playwright.defaultTimeout);

      return { status: 'success', deviceName };
    } catch (error) {
      // If something fails, ensure we maintain valid state
      this.logger.error('Device emulation failed', error);
      throw error;
    }
  }

  // ========================================
  // MULTIPLE ELEMENTS
  // ========================================

  async clickMultiple(selector) {
    this._ensureInitialized();
    this.logger.info('Clicking multiple elements', { selector });
    const elements = await this.page.$$(selector);
    for (const element of elements) {
      await element.click();
    }
    return { status: 'success', count: elements.length };
  }

  async countElements(selector) {
    this._ensureInitialized();
    this.logger.info('Counting elements', { selector });
    const count = await this.page.locator(selector).count();
    return { status: 'success', count };
  }

  // ========================================
  // FRAMES & IFRAMES
  // ========================================

  async switchToFrame(selector) {
    this._ensureInitialized();
    this.logger.info('Switching to frame', { selector });
    const frame = await this.page.frame({ name: selector });
    return { status: 'success', frame: frame ? 'found' : 'not found' };
  }

  async getFrames() {
    this._ensureInitialized();
    this.logger.info('Getting all frames');
    const frames = this.page.frames();
    return { status: 'success', count: frames.length };
  }

  // New Phase 2 methods to append to PlaywrightService.js

  // ========================================
  // NETWORK CONTROL (Phase 2)
  // ========================================

  async routeRequest(urlPattern, handler) {
    this._ensureInitialized();
    this.logger.info('Setting up request routing', { urlPattern });
    await this.page.route(urlPattern, async (route) => {
      if (handler === 'abort') {
        await route.abort();
      } else if (handler === 'continue') {
        await route.continue();
      } else if (typeof handler === 'object') {
        // Mock response
        await route.fulfill(handler);
      } else {
        await route.continue();
      }
    });
    return { status: 'success', urlPattern };
  }

  async abortRequest(urlPattern) {
    this._ensureInitialized();
    this.logger.info('Aborting requests', { urlPattern });
    await this.page.route(urlPattern, route => route.abort());
    return { status: 'success', urlPattern };
  }

  async getNetworkActivity() {
    this.logger.info('Getting network activity');
    // Note: This requires setting up listeners beforehand
    // For now, return a placeholder
    return {
      status: 'success',
      message: 'Network monitoring requires setup during context creation'
    };
  }

  // ========================================
  // ADVANCED DEBUGGING (Phase 2)
  // ========================================

  async setupConsoleCapture() {
    this._ensureInitialized();
    this.logger.info('Setting up console capture');
    if (!this.consoleLogs) {
      this.consoleLogs = [];
    }

    // Define max size to prevent memory leak
    const MAX_CONSOLE_LOGS = 10000;

    this.page.on('console', msg => {
      const logEntry = {
        type: msg.type(),
        text: msg.text(),
        timestamp: new Date().toISOString()
      };

      // Implement circular buffer to prevent unbounded growth
      if (this.consoleLogs.length >= MAX_CONSOLE_LOGS) {
        this.consoleLogs.shift(); // Remove oldest entry
      }
      this.consoleLogs.push(logEntry);
    });
    return { status: 'success', message: 'Console capture enabled', maxSize: MAX_CONSOLE_LOGS };
  }

  async getConsoleLogs() {
    this.logger.info('Getting console logs');
    return {
      status: 'success',
      logs: this.consoleLogs || [],
      count: this.consoleLogs ? this.consoleLogs.length : 0
    };
  }

  async clearConsoleLogs() {
    this.logger.info('Clearing console logs');
    this.consoleLogs = [];
    return { status: 'success', message: 'Console logs cleared' };
  }

  async startTracing(options = {}) {
    this._ensureInitialized();
    if (!this.context) {
      throw new Error('Browser context not available');
    }
    this.logger.info('Starting tracing');
    await this.context.tracing.start({
      screenshots: true,
      snapshots: true,
      ...options
    });
    return { status: 'success', message: 'Tracing started' };
  }

  async stopTracing(path) {
    this._ensureInitialized();
    if (!this.context) {
      throw new Error('Browser context not available');
    }
    this.logger.info('Stopping tracing', { path });
    await this.context.tracing.stop({ path });
    return { status: 'success', path };
  }

  // ========================================
  // SYSTEM & ENVIRONMENT (Phase 2)
  // ========================================

  async setGeolocation(latitude, longitude) {
    this._ensureInitialized();
    if (!this.context) {
      throw new Error('Browser context not available');
    }
    this.logger.info('Setting geolocation', { latitude, longitude });
    await this.context.setGeolocation({ latitude, longitude });
    return { status: 'success', latitude, longitude };
  }

  async grantPermissions(permissions) {
    this._ensureInitialized();
    if (!this.context) {
      throw new Error('Browser context not available');
    }
    this.logger.info('Granting permissions', { permissions });
    await this.context.grantPermissions(permissions);
    return { status: 'success', permissions };
  }

  async clearPermissions() {
    this._ensureInitialized();
    if (!this.context) {
      throw new Error('Browser context not available');
    }
    this.logger.info('Clearing permissions');
    await this.context.clearPermissions();
    return { status: 'success', message: 'Permissions cleared' };
  }

  async setTimezone(timezoneId) {
    this.logger.info('Setting timezone', { timezoneId });
    // Note: Timezone must be set during context creation
    // This is a limitation of Playwright
    return {
      status: 'warning',
      message: 'Timezone must be set during browser context creation',
      timezoneId
    };
  }

  // ========================================
  // ACCESSIBILITY (Phase 2)
  // ========================================

  async getAccessibilitySnapshot(selector = null) {
    this._ensureInitialized();
    this.logger.info('Getting accessibility snapshot', { selector });
    const snapshot = selector
      ? await this.page.locator(selector).ariaSnapshot()
      : await this.page.ariaSnapshot();
    return { status: 'success', snapshot };
  }

  // ========================================
  // OBSERVABILITY (Phase 3)
  // ========================================

  async getLatestRecordingPath() {
    this._ensureInitialized();
    this.logger.info('Getting latest recording path');

    if (!config.recording || !config.recording.enabled) {
      return { status: 'error', message: 'Video recording is disabled in config' };
    }

    const video = this.page.video();
    if (!video) {
      return { status: 'error', message: 'No video recording available for current page' };
    }

    // Wait for the video file to be available (sometimes needs context close or page close, but path() should work)
    const path = await video.path();
    return { status: 'success', path };
  }

  // ========================================
  // RESILIENCE (Phase 3)
  // ========================================

  /**
   * Attempts to recover from a failed selector by finding a similar element
   * @param {string} failedSelector 
   * @returns {Promise<string|null>} New selector or null
   */
  async _recoveryStrategy(failedSelector) {
    try {
      this.logger.info('Analyzing failed selector for recovery', { failedSelector });

      // Strategy 1: Flattened ID (if sensitive to casing or exact match)
      // e.g. #SubmitBtn -> [id*="submitbtn" i]
      if (failedSelector.startsWith('#')) {
        const id = failedSelector.substring(1);
        const candidates = await this.page.$$(`[id*="${id}" i]`);
        if (candidates.length === 1) {
          return `[id*="${id}" i]`;
        }
      }

      // Strategy 2: Partial Attribute Match
      // If selector is [data-testid="submit-btn-123"], try [data-testid*="submit-btn"]
      const attrMatch = failedSelector.match(/\[([\w-]+)=["']?([\w-]+)["']?\]/);
      if (attrMatch) {
        const [_, attr, val] = attrMatch;
        // Remove numbers from value
        const cleanVal = val.replace(/[-_]?\d+/g, '');
        if (cleanVal.length > 3) {
          const potential = `[${attr}*="${cleanVal}"]`;
          if (await this.page.locator(potential).count() === 1) {
            return potential;
          }
        }
      }

      return null;
    } catch (e) {
      this.logger.error('Error during recovery strategy', e);
      return null;
    }
  }

  /**
   * Wrapper for actions that attempts self-healing execution
   * @param {string} operation 
   * @param {string} selector 
   * @param {Function} actionFn 
   */
  async _smartRetry(operation, selector, actionFn) {
    try {
      return await actionFn(selector);
    } catch (error) {
      // Only retry on timeout or missing element
      if (error.message.includes('Timeout') || error.message.includes('waiting for selector')) {
        this.logger.warn(`Action ${operation} failed, attempting self-healing`, { selector });

        const newSelector = await this._recoveryStrategy(selector);
        if (newSelector) {
          this.logger.warn(`Self-healing substituted selector`, { old: selector, new: newSelector });
          return await actionFn(newSelector);
        }
      }
      throw error;
    }
  }

  /**
   * Closes the browser and cleans up all resources
   * Removes all event listeners and resets state
   * @returns {Promise<void>}
   */
  async close() {
    this.logger.info('Closing Playwright browser and cleaning up resources');

    try {
      // Remove dialog handler if set
      if (this.dialogHandler && this.page) {
        this.page.removeListener('dialog', this.dialogHandler);
        this.dialogHandler = null;
      }

      // Remove all page event listeners if page exists
      if (this.page) {
        this.page.removeAllListeners();
      }

      // Close context (which also closes all pages)
      if (this.context) {
        await this.context.close();
        this.context = null;
      }

      // Close browser
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
      }

      // Reset all state
      this.page = null;
      this.consoleLogs = null;
      this.isInitialized = false;

      this.logger.info('Browser closed and resources cleaned up successfully');
    } catch (error) {
      this.logger.error('Error during browser cleanup', error);
      // Reset state even if cleanup fails
      this.browser = null;
      this.context = null;
      this.page = null;
      this.dialogHandler = null;
      this.consoleLogs = null;
      this.isInitialized = false;
      throw error;
    }
  }
}