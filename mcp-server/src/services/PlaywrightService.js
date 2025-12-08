/**
 * @author Sandeep Talware
 */

import { chromium } from 'playwright';
import { Logger } from '../utils/logger.js';
import { config } from '../config/config.js';

export class PlaywrightService {
  constructor() {
    this.browser = null;
    this.logger = new Logger('PlaywrightService');
    this.isInitialized = false;
  }

  async initialize() {
    try {
      if (this.isInitialized) {
        this.logger.info('Browser already initialized, skipping');
        return true;
      }

      this.logger.info('Initializing Playwright browser');

      const launchOptions = {
        headless: config.playwright.headless,
        slowMo: config.playwright.slowMo
      };

      if (config.playwright.executablePath) {
        this.logger.info('Using custom Chrome executable', { path: config.playwright.executablePath });
        launchOptions.executablePath = config.playwright.executablePath;
      }

      const args = [];
      if (config.playwright.startMaximized) {
        this.logger.info('Launching browser in full screen/maximized mode');
        args.push('--start-maximized');
      }
      launchOptions.args = args;

      this.browser = await chromium.launch(launchOptions);

      this.isInitialized = true;
      this.logger.info('Playwright browser initialized successfully');
      return true;
    } catch (error) {
      this.logger.error('Failed to initialize Playwright', error);
      this.isInitialized = false;
      throw error;
    }
  }

  getBrowser() {
    if (!this.browser) {
      throw new Error('Browser not initialized');
    }
    return this.browser;
  }

  async close() {
    if (this.browser) {
      this.logger.info('Closing browser');
      await this.browser.close();
      this.browser = null;
      this.isInitialized = false;
    }
  }
}