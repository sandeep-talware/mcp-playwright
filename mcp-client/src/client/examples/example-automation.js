/**
 * @author Sandeep Talware
 */

import { ConnectionManager } from '../src/services/ConnectionManager.js';
import { RequestService } from '../src/services/RequestService.js';
import { Logger } from '../src/utils/logger.js';

const logger = new Logger('ExampleAutomation');

// ========================================
// Example 1: Advanced Selectors Demo
// ========================================
async function advancedSelectorsExample() {
  const connectionManager = new ConnectionManager();
  const requestService = new RequestService(connectionManager);
  
  try {
    await connectionManager.connect();
    await requestService.initialize();
    
    logger.section('ADVANCED SELECTORS EXAMPLE');
    
    // Navigate
    await requestService.navigate('https://example.com');
    
    // Click by text
    logger.info('Clicking by text...');
    await requestService.callTool('playwright_click_by_text', { 
      text: 'More information' 
    });
    
    // Go back
    await requestService.callTool('playwright_go_back', {});
    
    // Get page title
    const title = await requestService.callTool('playwright_get_title', {});
    logger.info('Page title:', { title: title.result.title });
    
    // Check element visibility
    const isVisible = await requestService.callTool('playwright_is_visible', { 
      selector: 'h1' 
    });
    logger.info('H1 visible:', { visible: isVisible.result.visible });
    
    // Take screenshot
    await requestService.screenshot('./example-advanced-selectors.png');
    
    logger.info('✅ Advanced selectors example completed');
    
  } catch (error) {
    logger.error('Example failed', error);
  } finally {
    connectionManager.disconnect();
  }
}

// ========================================
// Example 2: Form Automation with Validation
// ========================================
async function formAutomationExample() {
  const connectionManager = new ConnectionManager();
  const requestService = new RequestService(connectionManager);
  
  try {
    await connectionManager.connect();
    await requestService.initialize();
    
    logger.section('FORM AUTOMATION EXAMPLE');
    
    // Navigate to form demo
    await requestService.navigate('https://www.w3schools.com/html/html_forms.asp');
    
    // Wait for page load
    await requestService.callTool('playwright_wait_for_load_state', { 
      state: 'networkidle' 
    });
    
    // Check if form exists
    const formExists = await requestService.callTool('playwright_element_exists', { 
      selector: 'form' 
    });
    logger.info('Form exists:', formExists.result);
    
    if (formExists.result.exists) {
      // Fill inputs
      logger.info('Filling form fields...');
      
      // Type with delay (more human-like)
      await requestService.callTool('playwright_type', { 
        selector: 'input[name="fname"]', 
        text: 'John', 
        delay: 50 
      });
      
      await requestService.callTool('playwright_fill', { 
        selector: 'input[name="lname"]', 
        value: 'Doe' 
      });
      
      // Screenshot the filled form
      await requestService.screenshot('./example-form-filled.png');
      
      logger.info('✅ Form automation completed');
    }
    
  } catch (error) {
    logger.error('Example failed', error);
  } finally {
    connectionManager.disconnect();
  }
}

// ========================================
// Example 3: Element State Validation
// ========================================
async function elementStateExample() {
  const connectionManager = new ConnectionManager();
  const requestService = new RequestService(connectionManager);
  
  try {
    await connectionManager.connect();
    await requestService.initialize();
    
    logger.section('ELEMENT STATE VALIDATION EXAMPLE');
    
    await requestService.navigate('https://example.com');
    
    // Check various element states
    const h1Visible = await requestService.callTool('playwright_is_visible', { 
      selector: 'h1' 
    });
    logger.info('H1 visible:', h1Visible.result);
    
    const bodyExists = await requestService.callTool('playwright_element_exists', { 
      selector: 'body' 
    });
    logger.info('Body exists:', bodyExists.result);
    
    // Count elements
    const linkCount = await requestService.callTool('playwright_count_elements', { 
      selector: 'a' 
    });
    logger.info('Total links:', linkCount.result);
    
    // Get all link texts
    const linkTexts = await requestService.callTool('playwright_get_all_text', { 
      selector: 'a' 
    });
    logger.info('Link texts:', linkTexts.result);
    
    logger.info('✅ Element state validation completed');
    
  } catch (error) {
    logger.error('Example failed', error);
  } finally {
    connectionManager.disconnect();
  }
}

// ========================================
// Example 4: Screenshot Variations
// ========================================
async function screenshotExample() {
  const connectionManager = new ConnectionManager();
  const requestService = new RequestService(connectionManager);
  
  try {
    await connectionManager.connect();
    await requestService.initialize();
    
    logger.section('SCREENSHOT VARIATIONS EXAMPLE');
    
    await requestService.navigate('https://example.com');
    
    // Wait for page to fully load
    await requestService.callTool('playwright_wait_for_load_state', { 
      state: 'load' 
    });
    
    // Regular screenshot
    logger.info('Taking regular screenshot...');
    await requestService.screenshot('./example-regular.png');
    
    // Full page screenshot
    logger.info('Taking full page screenshot...');
    await requestService.callTool('playwright_screenshot_full_page', { 
      path: './example-fullpage.png' 
    });
    
    // Element screenshot
    logger.info('Taking element screenshot...');
    await requestService.callTool('playwright_screenshot_element', { 
      selector: 'h1', 
      path: './example-element.png' 
    });
    
    logger.info('✅ Screenshot examples completed');
    
  } catch (error) {
    logger.error('Example failed', error);
  } finally {
    connectionManager.disconnect();
  }
}

// ========================================
// Example 5: Keyboard and Mouse Interactions
// ========================================
async function keyboardMouseExample() {
  const connectionManager = new ConnectionManager();
  const requestService = new RequestService(connectionManager);
  
  try {
    await connectionManager.connect();
    await requestService.initialize();
    
    logger.section('KEYBOARD & MOUSE INTERACTIONS EXAMPLE');
    
    await requestService.navigate('https://www.google.com');
    
    // Wait for search box
    await requestService.callTool('playwright_wait_for_selector', { 
      selector: 'textarea[name="q"]' 
    });
    
    // Click search box
    await requestService.click('textarea[name="q"]');
    
    // Type with keyboard
    logger.info('Typing with keyboard...');
    await requestService.callTool('playwright_keyboard_type', { 
      text: 'Playwright automation', 
      delay: 50 
    });
    
    // Press Enter
    logger.info('Pressing Enter key...');
    await requestService.callTool('playwright_keyboard_press', { 
      key: 'Enter' 
    });
    
    // Wait for results
    await requestService.callTool('playwright_wait_for_timeout', { 
      milliseconds: 3000 
    });
    
    // Scroll down
    logger.info('Scrolling page...');
    await requestService.callTool('playwright_scroll_to', { 
      x: 0, 
      y: 500 
    });
    
    // Screenshot results
    await requestService.screenshot('./example-search-results.png');
    
    logger.info('✅ Keyboard & mouse example completed');
    
  } catch (error) {
    logger.error('Example failed', error);
  } finally {
    connectionManager.disconnect();
  }
}

// ========================================
// Example 6: Page Information Extraction
// ========================================
async function pageInfoExample() {
  const connectionManager = new ConnectionManager();
  const requestService = new RequestService(connectionManager);
  
  try {
    await connectionManager.connect();
    await requestService.initialize();
    
    logger.section('PAGE INFORMATION EXTRACTION EXAMPLE');
    
    await requestService.navigate('https://example.com');
    
    // Get page title
    const title = await requestService.callTool('playwright_get_title', {});
    logger.info('Title:', { title: title.result.title });
    
    // Get current URL
    const url = await requestService.callTool('playwright_get_url', {});
    logger.info('URL:', { url: url.result.url });
    
    // Get main heading text
    const heading = await requestService.callTool('playwright_get_text', { 
      selector: 'h1' 
    });
    logger.info('Heading:', { text: heading.result.text });
    
    // Get element attribute
    const linkHref = await requestService.callTool('playwright_get_attribute', { 
      selector: 'a', 
      attribute: 'href' 
    });
    logger.info('First link href:', linkHref.result);
    
    // Get cookies
    const cookies = await requestService.callTool('playwright_get_cookies', {});
    logger.info('Cookies count:', { count: cookies.result.cookies.length });
    
    logger.info('✅ Page information extraction completed');
    
  } catch (error) {
    logger.error('Example failed', error);
  } finally {
    connectionManager.disconnect();
  }
}

// ========================================
// Example 7: Complex Workflow
// ========================================
async function complexWorkflowExample() {
  const connectionManager = new ConnectionManager();
  const requestService = new RequestService(connectionManager);
  
  try {
    await connectionManager.connect();
    await requestService.initialize();
    
    logger.section('COMPLEX WORKFLOW EXAMPLE');
    
    // Step 1: Navigate
    logger.info('Step 1: Navigating...');
    await requestService.navigate('https://example.com');
    
    // Step 2: Validate page loaded
    logger.info('Step 2: Validating page...');
    const titleResult = await requestService.callTool('playwright_get_title', {});
    logger.info('Page loaded:', { title: titleResult.result.title });
    
    // Step 3: Check element existence
    logger.info('Step 3: Checking elements...');
    const h1Exists = await requestService.callTool('playwright_element_exists', { 
      selector: 'h1' 
    });
    
    if (h1Exists.result.exists) {
      // Step 4: Get content
      logger.info('Step 4: Extracting content...');
      const h1Text = await requestService.callTool('playwright_get_text', { 
        selector: 'h1' 
      });
      logger.info('H1 content:', { text: h1Text.result.text });
      
      // Step 5: Hover over link
      logger.info('Step 5: Hovering over link...');
      await requestService.callTool('playwright_hover', { 
        selector: 'a' 
      });
      
      // Step 6: Click link
      logger.info('Step 6: Clicking link...');
      await requestService.callTool('playwright_click_by_text', { 
        text: 'More information' 
      });
      
      // Step 7: Wait for navigation
      logger.info('Step 7: Waiting for navigation...');
      await requestService.callTool('playwright_wait_for_timeout', { 
        milliseconds: 2000 
      });
      
      // Step 8: Go back
      logger.info('Step 8: Going back...');
      await requestService.callTool('playwright_go_back', {});
      
      // Step 9: Take final screenshot
      logger.info('Step 9: Taking screenshot...');
      await requestService.screenshot('./example-complex-workflow.png');
    }
    
    logger.info('✅ Complex workflow completed successfully');
    
  } catch (error) {
    logger.error('Workflow failed', error);
  } finally {
    connectionManager.disconnect();
  }
}

// ========================================
// Example 8: Wait Strategies
// ========================================
async function waitStrategiesExample() {
  const connectionManager = new ConnectionManager();
  const requestService = new RequestService(connectionManager);
  
  try {
    await connectionManager.connect();
    await requestService.initialize();
    
    logger.section('WAIT STRATEGIES EXAMPLE');
    
    await requestService.navigate('https://example.com');
    
    // Wait for element
    logger.info('Waiting for element...');
    await requestService.callTool('playwright_wait_for_selector', { 
      selector: 'h1', 
      timeout: 5000 
    });
    
    // Wait for load state
    logger.info('Waiting for network idle...');
    await requestService.callTool('playwright_wait_for_load_state', { 
      state: 'networkidle' 
    });
    
    // Navigate to another page
    await requestService.click('a');
    
    // Wait for URL change
    logger.info('Waiting for URL change...');
    await requestService.callTool('playwright_wait_for_url', { 
      url: '**/*.html', 
      timeout: 5000 
    });
    
    logger.info('✅ Wait strategies example completed');
    
  } catch (error) {
    logger.error('Example failed', error);
  } finally {
    connectionManager.disconnect();
  }
}

// ========================================
// Run All Examples
// ========================================
async function runAllExamples() {
  logger.separator('=', 80);
  logger.info('STARTING ALL EXAMPLES');
  logger.separator('=', 80);
  
  const examples = [
    { name: 'Advanced Selectors', fn: advancedSelectorsExample },
    { name: 'Form Automation', fn: formAutomationExample },
    { name: 'Element State', fn: elementStateExample },
    { name: 'Screenshots', fn: screenshotExample },
    { name: 'Keyboard & Mouse', fn: keyboardMouseExample },
    { name: 'Page Information', fn: pageInfoExample },
    { name: 'Complex Workflow', fn: complexWorkflowExample },
    { name: 'Wait Strategies', fn: waitStrategiesExample }
  ];
  
  for (const example of examples) {
    logger.info(`\n\nRunning: ${example.name}`);
    logger.separator('-', 80);
    
    try {
      await example.fn();
      logger.info(`✅ ${example.name} completed\n`);
    } catch (error) {
      logger.error(`❌ ${example.name} failed:`, error);
    }
    
    // Wait between examples
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  logger.separator('=', 80);
  logger.info('ALL EXAMPLES COMPLETED');
  logger.separator('=', 80);
}

// ========================================
// Main Execution
// ========================================

// Run specific example or all
const exampleToRun = process.argv[2];

switch (exampleToRun) {
  case 'selectors':
    advancedSelectorsExample();
    break;
  case 'forms':
    formAutomationExample();
    break;
  case 'state':
    elementStateExample();
    break;
  case 'screenshots':
    screenshotExample();
    break;
  case 'keyboard':
    keyboardMouseExample();
    break;
  case 'info':
    pageInfoExample();
    break;
  case 'workflow':
    complexWorkflowExample();
    break;
  case 'wait':
    waitStrategiesExample();
    break;
  case 'all':
  default:
    runAllExamples();
    break;
}


// ============================================
// USAGE:
// ============================================
/*

Run all examples:
node examples/example-automation.js

Run specific example:
node examples/example-automation.js selectors
node examples/example-automation.js forms
node examples/example-automation.js state
node examples/example-automation.js screenshots
node examples/example-automation.js keyboard
node examples/example-automation.js info
node examples/example-automation.js workflow
node examples/example-automation.js wait

*/