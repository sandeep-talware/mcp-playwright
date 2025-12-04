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
  }

  async initialize() {
    try {
      this.logger.info('Initializing Playwright browser');
      this.browser = await chromium.launch({
        headless: config.playwright.headless,
        slowMo: config.playwright.slowMo
      });
      
      this.context = await this.browser.newContext();
      this.page = await this.context.newPage();
      this.page.setDefaultTimeout(config.playwright.defaultTimeout);
      
      this.logger.info('Playwright browser initialized successfully');
      return true;
    } catch (error) {
      this.logger.error('Failed to initialize Playwright', error);
      throw error;
    }
  }

  // ========================================
  // BASIC NAVIGATION & INTERACTION
  // ========================================

  async navigate(url) {
    this.logger.info('Navigating to URL', { url });
    await this.page.goto(url);
    return { status: 'success', url };
  }

  async goBack() {
    this.logger.info('Navigating back');
    await this.page.goBack();
    return { status: 'success' };
  }

  async goForward() {
    this.logger.info('Navigating forward');
    await this.page.goForward();
    return { status: 'success' };
  }

  async reload() {
    this.logger.info('Reloading page');
    await this.page.reload();
    return { status: 'success' };
  }

  async click(selector) {
    this.logger.info('Clicking element', { selector });
    await this.page.click(selector);
    return { status: 'success', selector };
  }

  async doubleClick(selector) {
    this.logger.info('Double clicking element', { selector });
    await this.page.dblclick(selector);
    return { status: 'success', selector };
  }

  async rightClick(selector) {
    this.logger.info('Right clicking element', { selector });
    await this.page.click(selector, { button: 'right' });
    return { status: 'success', selector };
  }

  async hover(selector) {
    this.logger.info('Hovering over element', { selector });
    await this.page.hover(selector);
    return { status: 'success', selector };
  }

  async fill(selector, value) {
    this.logger.info('Filling input', { selector });
    await this.page.fill(selector, value);
    return { status: 'success', selector };
  }

  async type(selector, text, delay = 100) {
    this.logger.info('Typing text', { selector, delay });
    await this.page.type(selector, text, { delay });
    return { status: 'success', selector, text };
  }

  async clear(selector) {
    this.logger.info('Clearing input', { selector });
    await this.page.fill(selector, '');
    return { status: 'success', selector };
  }

  async press(selector, key) {
    this.logger.info('Pressing key', { selector, key });
    await this.page.press(selector, key);
    return { status: 'success', selector, key };
  }

  // ========================================
  // ADVANCED SELECTORS
  // ========================================

  async clickByText(text, exact = false) {
    this.logger.info('Clicking element by text', { text, exact });
    const selector = exact ? `text="${text}"` : `text=${text}`;
    await this.page.click(selector);
    return { status: 'success', text };
  }

  async clickByRole(role, name) {
    this.logger.info('Clicking element by role', { role, name });
    await this.page.getByRole(role, { name }).click();
    return { status: 'success', role, name };
  }

  async clickByLabel(label) {
    this.logger.info('Clicking element by label', { label });
    await this.page.getByLabel(label).click();
    return { status: 'success', label };
  }

  async clickByPlaceholder(placeholder) {
    this.logger.info('Clicking element by placeholder', { placeholder });
    await this.page.getByPlaceholder(placeholder).click();
    return { status: 'success', placeholder };
  }

  async clickByTestId(testId) {
    this.logger.info('Clicking element by test ID', { testId });
    await this.page.getByTestId(testId).click();
    return { status: 'success', testId };
  }

  async clickByTitle(title) {
    this.logger.info('Clicking element by title', { title });
    await this.page.getByTitle(title).click();
    return { status: 'success', title };
  }

  async clickByAltText(altText) {
    this.logger.info('Clicking element by alt text', { altText });
    await this.page.getByAltText(altText).click();
    return { status: 'success', altText };
  }

  async fillByLabel(label, value) {
    this.logger.info('Filling input by label', { label });
    await this.page.getByLabel(label).fill(value);
    return { status: 'success', label, value };
  }

  async fillByPlaceholder(placeholder, value) {
    this.logger.info('Filling input by placeholder', { placeholder });
    await this.page.getByPlaceholder(placeholder).fill(value);
    return { status: 'success', placeholder, value };
  }

  // ========================================
  // TEXT & CONTENT EXTRACTION
  // ========================================

  async getText(selector) {
    this.logger.info('Getting text from element', { selector });
    const text = await this.page.textContent(selector);
    return { status: 'success', text };
  }

  async getInnerText(selector) {
    this.logger.info('Getting inner text', { selector });
    const text = await this.page.innerText(selector);
    return { status: 'success', text };
  }

  async getInnerHTML(selector) {
    this.logger.info('Getting inner HTML', { selector });
    const html = await this.page.innerHTML(selector);
    return { status: 'success', html };
  }

  async getAttribute(selector, attribute) {
    this.logger.info('Getting attribute', { selector, attribute });
    const value = await this.page.getAttribute(selector, attribute);
    return { status: 'success', attribute, value };
  }

  async getValue(selector) {
    this.logger.info('Getting input value', { selector });
    const value = await this.page.inputValue(selector);
    return { status: 'success', value };
  }

  async getAllText(selector) {
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
    this.logger.info('Checking visibility', { selector });
    const visible = await this.page.isVisible(selector);
    return { status: 'success', visible };
  }

  async isHidden(selector) {
    this.logger.info('Checking if hidden', { selector });
    const hidden = await this.page.isHidden(selector);
    return { status: 'success', hidden };
  }

  async isEnabled(selector) {
    this.logger.info('Checking if enabled', { selector });
    const enabled = await this.page.isEnabled(selector);
    return { status: 'success', enabled };
  }

  async isDisabled(selector) {
    this.logger.info('Checking if disabled', { selector });
    const disabled = await this.page.isDisabled(selector);
    return { status: 'success', disabled };
  }

  async isChecked(selector) {
    this.logger.info('Checking if checked', { selector });
    const checked = await this.page.isChecked(selector);
    return { status: 'success', checked };
  }

  async isEditable(selector) {
    this.logger.info('Checking if editable', { selector });
    const editable = await this.page.isEditable(selector);
    return { status: 'success', editable };
  }

  async elementExists(selector) {
    this.logger.info('Checking if element exists', { selector });
    const count = await this.page.locator(selector).count();
    return { status: 'success', exists: count > 0, count };
  }

  // ========================================
  // FORM INTERACTIONS
  // ========================================

  async check(selector) {
    this.logger.info('Checking checkbox/radio', { selector });
    await this.page.check(selector);
    return { status: 'success', selector };
  }

  async uncheck(selector) {
    this.logger.info('Unchecking checkbox', { selector });
    await this.page.uncheck(selector);
    return { status: 'success', selector };
  }

  async selectOption(selector, value) {
    this.logger.info('Selecting option', { selector, value });
    await this.page.selectOption(selector, value);
    return { status: 'success', selector, value };
  }

  async uploadFile(selector, filePath) {
    this.logger.info('Uploading file', { selector, filePath });
    await this.page.setInputFiles(selector, filePath);
    return { status: 'success', selector, filePath };
  }

  // ========================================
  // WAITING METHODS
  // ========================================

  async waitForSelector(selector, timeout = 30000) {
    this.logger.info('Waiting for selector', { selector, timeout });
    await this.page.waitForSelector(selector, { timeout });
    return { status: 'success', selector };
  }

  async waitForTimeout(milliseconds) {
    this.logger.info('Waiting for timeout', { milliseconds });
    await this.page.waitForTimeout(milliseconds);
    return { status: 'success', milliseconds };
  }

  async waitForLoadState(state = 'load') {
    this.logger.info('Waiting for load state', { state });
    await this.page.waitForLoadState(state);
    return { status: 'success', state };
  }

  async waitForURL(url, timeout = 30000) {
    this.logger.info('Waiting for URL', { url, timeout });
    await this.page.waitForURL(url, { timeout });
    return { status: 'success', url };
  }

  async waitForNavigation() {
    this.logger.info('Waiting for navigation');
    await this.page.waitForNavigation();
    return { status: 'success' };
  }

  async waitForFunction(fn, timeout = 30000) {
    this.logger.info('Waiting for function');
    await this.page.waitForFunction(fn, { timeout });
    return { status: 'success' };
  }

  // ========================================
  // SCREENSHOTS & MEDIA
  // ========================================

  async screenshot(path, options = {}) {
    this.logger.info('Taking screenshot', { path });
    await this.page.screenshot({ path, ...options });
    return { status: 'success', path };
  }

  async screenshotElement(selector, path) {
    this.logger.info('Taking element screenshot', { selector, path });
    const element = await this.page.locator(selector);
    await element.screenshot({ path });
    return { status: 'success', selector, path };
  }

  async screenshotFullPage(path) {
    this.logger.info('Taking full page screenshot', { path });
    await this.page.screenshot({ path, fullPage: true });
    return { status: 'success', path };
  }

  async pdf(path, options = {}) {
    this.logger.info('Generating PDF', { path });
    await this.page.pdf({ path, ...options });
    return { status: 'success', path };
  }

  // ========================================
  // PAGE INFORMATION
  // ========================================

  async getTitle() {
    this.logger.info('Getting page title');
    const title = await this.page.title();
    return { status: 'success', title };
  }

  async getURL() {
    this.logger.info('Getting page URL');
    const url = this.page.url();
    return { status: 'success', url };
  }

  async getContent() {
    this.logger.info('Getting page content');
    const content = await this.page.content();
    return { status: 'success', content };
  }

  async getCookies() {
    this.logger.info('Getting cookies');
    const cookies = await this.context.cookies();
    return { status: 'success', cookies };
  }

  async setCookie(name, value, options = {}) {
    this.logger.info('Setting cookie', { name });
    await this.context.addCookies([{ name, value, ...options }]);
    return { status: 'success', name, value };
  }

  async clearCookies() {
    this.logger.info('Clearing cookies');
    await this.context.clearCookies();
    return { status: 'success' };
  }

  // ========================================
  // JAVASCRIPT EVALUATION
  // ========================================

  async evaluate(script, arg) {
    this.logger.info('Evaluating JavaScript');
    const result = await this.page.evaluate(script, arg);
    return { status: 'success', result };
  }

  async evaluateHandle(script) {
    this.logger.info('Evaluating JavaScript handle');
    const handle = await this.page.evaluateHandle(script);
    return { status: 'success', handle: handle.toString() };
  }

  async addScriptTag(options) {
    this.logger.info('Adding script tag', options);
    await this.page.addScriptTag(options);
    return { status: 'success' };
  }

  async addStyleTag(options) {
    this.logger.info('Adding style tag', options);
    await this.page.addStyleTag(options);
    return { status: 'success' };
  }

  // ========================================
  // KEYBOARD & MOUSE
  // ========================================

  async keyboardPress(key) {
    this.logger.info('Pressing keyboard key', { key });
    await this.page.keyboard.press(key);
    return { status: 'success', key };
  }

  async keyboardType(text, delay = 0) {
    this.logger.info('Typing with keyboard', { text });
    await this.page.keyboard.type(text, { delay });
    return { status: 'success', text };
  }

  async mouseClick(x, y) {
    this.logger.info('Mouse click at coordinates', { x, y });
    await this.page.mouse.click(x, y);
    return { status: 'success', x, y };
  }

  async mouseMove(x, y) {
    this.logger.info('Moving mouse', { x, y });
    await this.page.mouse.move(x, y);
    return { status: 'success', x, y };
  }

  async scrollTo(x, y) {
    this.logger.info('Scrolling to position', { x, y });
    await this.page.evaluate(({ x, y }) => window.scrollTo(x, y), { x, y });
    return { status: 'success', x, y };
  }

  async scrollIntoView(selector) {
    this.logger.info('Scrolling element into view', { selector });
    await this.page.locator(selector).scrollIntoViewIfNeeded();
    return { status: 'success', selector };
  }
  async dragAndDrop(sourceSelector, targetSelector) {
    this.logger.info('Performing drag and drop', { sourceSelector, targetSelector });
    await this.page.dragAndDrop(sourceSelector, targetSelector);
    return { status: 'success', sourceSelector, targetSelector };
  }

  async dragAndDropByCoordinates(selector, targetX, targetY) {
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

  async acceptDialog() {
    this.logger.info('Setting up dialog acceptance');
    this.page.on('dialog', dialog => dialog.accept());
    return { status: 'success' };
  }

  async dismissDialog() {
    this.logger.info('Setting up dialog dismissal');
    this.page.on('dialog', dialog => dialog.dismiss());
    return { status: 'success' };
  }

  // ========================================
  // NETWORK & REQUESTS
  // ========================================

  async setExtraHTTPHeaders(headers) {
    this.logger.info('Setting extra HTTP headers');
    await this.page.setExtraHTTPHeaders(headers);
    return { status: 'success', headers };
  }

  async setViewportSize(width, height) {
    this.logger.info('Setting viewport size', { width, height });
    await this.page.setViewportSize({ width, height });
    return { status: 'success', width, height };
  }

  async emulateDevice(deviceName) {
    this.logger.info('Emulating device', { deviceName });
    const { chromium, devices } = await import('playwright');
    const device = devices[deviceName];
    if (!device) {
      throw new Error(`Device ${deviceName} not found`);
    }
    await this.context.close();
    this.context = await this.browser.newContext(device);
    this.page = await this.context.newPage();
    return { status: 'success', deviceName };
  }

  // ========================================
  // MULTIPLE ELEMENTS
  // ========================================

  async clickMultiple(selector) {
    this.logger.info('Clicking multiple elements', { selector });
    const elements = await this.page.$$(selector);
    for (const element of elements) {
      await element.click();
    }
    return { status: 'success', count: elements.length };
  }

  async countElements(selector) {
    this.logger.info('Counting elements', { selector });
    const count = await this.page.locator(selector).count();
    return { status: 'success', count };
  }

  // ========================================
  // FRAMES & IFRAMES
  // ========================================

  async switchToFrame(selector) {
    this.logger.info('Switching to frame', { selector });
    const frame = await this.page.frame({ name: selector });
    return { status: 'success', frame: frame ? 'found' : 'not found' };
  }

  async getFrames() {
    this.logger.info('Getting all frames');
    const frames = this.page.frames();
    return { status: 'success', count: frames.length };
  }// New Phase 2 methods to append to PlaywrightService.js

  // ========================================
  // NETWORK CONTROL (Phase 2)
  // ========================================

  async routeRequest(urlPattern, handler) {
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
    this.logger.info('Setting up console capture');
    if (!this.consoleLogs) {
      this.consoleLogs = [];
    }
    this.page.on('console', msg => {
      this.consoleLogs.push({
        type: msg.type(),
        text: msg.text(),
        timestamp: new Date().toISOString()
      });
    });
    return { status: 'success', message: 'Console capture enabled' };
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
    this.logger.info('Starting tracing');
    await this.context.tracing.start({
      screenshots: true,
      snapshots: true,
      ...options
    });
    return { status: 'success', message: 'Tracing started' };
  }

  async stopTracing(path) {
    this.logger.info('Stopping tracing', { path });
    await this.context.tracing.stop({ path });
    return { status: 'success', path };
  }

  // ========================================
  // SYSTEM & ENVIRONMENT (Phase 2)
  // ========================================

  async setGeolocation(latitude, longitude) {
    this.logger.info('Setting geolocation', { latitude, longitude });
    await this.context.setGeolocation({ latitude, longitude });
    return { status: 'success', latitude, longitude };
  }

  async grantPermissions(permissions) {
    this.logger.info('Granting permissions', { permissions });
    await this.context.grantPermissions(permissions);
    return { status: 'success', permissions };
  }

  async clearPermissions() {
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
    this.logger.info('Getting accessibility snapshot', { selector });
    const snapshot = selector 
      ? await this.page.locator(selector).ariaSnapshot()
      : await this.page.ariaSnapshot();
    return { status: 'success', snapshot };
  }



  // ========================================
  // CLEANUP
  // ========================================

  async close() {
    this.logger.info('Closing Playwright browser');
    if (this.browser) {
      await this.browser.close();
    }
  }
}
