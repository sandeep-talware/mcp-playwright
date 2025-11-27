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
        case 'navigate':
          result = await this.playwrightService.navigate(params.url);
          break;
          
        case 'click':
          result = await this.playwrightService.click(params.selector);
          break;
          
        case 'fill':
          result = await this.playwrightService.fill(params.selector, params.value);
          break;
          
        case 'getText':
          result = await this.playwrightService.getText(params.selector);
          break;
          
        case 'screenshot':
          result = await this.playwrightService.screenshot(params.path);
          break;
          
        case 'evaluate':
          result = await this.playwrightService.evaluate(params.script);
          break;
          
        case 'waitForSelector':
          result = await this.playwrightService.waitForSelector(
            params.selector, 
            params.timeout
          );
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