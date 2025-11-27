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

  async navigate(url) {
    this.logger.info('Navigating to URL', { url });
    await this.page.goto(url);
    return { status: 'success', url };
  }

  async click(selector) {
    this.logger.info('Clicking element', { selector });
    await this.page.click(selector);
    return { status: 'success', selector };
  }

  async fill(selector, value) {
    this.logger.info('Filling input', { selector });
    await this.page.fill(selector, value);
    return { status: 'success', selector };
  }

  async getText(selector) {
    this.logger.info('Getting text from element', { selector });
    const text = await this.page.textContent(selector);
    return { status: 'success', text };
  }

  async screenshot(path) {
    this.logger.info('Taking screenshot', { path });
    await this.page.screenshot({ path });
    return { status: 'success', path };
  }

  async evaluate(script) {
    this.logger.info('Evaluating JavaScript');
    const result = await this.page.evaluate(script);
    return { status: 'success', result };
  }

  async waitForSelector(selector, timeout = 30000) {
    this.logger.info('Waiting for selector', { selector, timeout });
    await this.page.waitForSelector(selector, { timeout });
    return { status: 'success', selector };
  }

  async close() {
    this.logger.info('Closing Playwright browser');
    if (this.browser) {
      await this.browser.close();
    }
  }
}