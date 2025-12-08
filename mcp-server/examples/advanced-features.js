/**
 * @author Sandeep Talware
 */

/**
 * Advanced Features Demo for Playwright MCP Server
 * 
 * This example demonstrates the new Phase 2 capabilities:
 * - Network interception and mocking
 * - Console log capture
 * - Tracing for debugging
 * - Geolocation and permissions
 * - Accessibility testing
 */

// Example 1: Network Interception and Console Logging
async function demoNetworkAndConsole() {
    console.log('=== Network Interception & Console Logging Demo ===\n');

    // Setup console capture to monitor browser console
    await playwright_setupConsoleCapture();

    // Mock API responses
    await playwright_routeRequest({
        urlPattern: '**/api/users',
        handler: {
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                users: [
                    { id: 1, name: 'John Doe', email: 'john@example.com' },
                    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
                ]
            })
        }
    });

    // Navigate to a page that makes API calls
    await playwright_navigate({ url: 'https://example.com' });

    // Get captured console logs
    const logs = await playwright_getConsoleLogs();
    console.log('Console logs captured:', logs.count);
    console.log('Logs:', JSON.stringify(logs.logs, null, 2));

    // Clear logs for next test
    await playwright_clearConsoleLogs();
}

// Example 2: Debugging with Tracing
async function demoTracing() {
    console.log('\n=== Tracing Demo ===\n');

    // Start tracing with screenshots and snapshots
    await playwright_startTracing({
        screenshots: true,
        snapshots: true
    });

    // Perform actions to trace
    await playwright_navigate({ url: 'https://example.com' });
    await playwright_click({ selector: 'a' });
    await playwright_waitForLoadState({ state: 'networkidle' });

    // Stop and save trace
    await playwright_stopTracing({ path: './trace.zip' });

    console.log('Trace saved to trace.zip');
    console.log('View it with: npx playwright show-trace trace.zip');
}

// Example 3: Geolocation and Permissions
async function demoGeolocationAndPermissions() {
    console.log('\n=== Geolocation & Permissions Demo ===\n');

    // Set geolocation to San Francisco
    await playwright_setGeolocation({
        latitude: 37.7749,
        longitude: -122.4194
    });

    // Grant geolocation permission
    await playwright_grantPermissions({
        permissions: ['geolocation']
    });

    // Navigate to a page that uses geolocation
    await playwright_navigate({ url: 'https://www.openstreetmap.org' });

    console.log('Geolocation set to San Francisco');
    console.log('Permissions granted: geolocation');

    // Clean up
    await playwright_clearPermissions();
}

// Example 4: Accessibility Testing
async function demoAccessibility() {
    console.log('\n=== Accessibility Testing Demo ===\n');

    await playwright_navigate({ url: 'https://example.com' });

    // Get accessibility snapshot of the entire page
    const pageSnapshot = await playwright_getAccessibilitySnapshot();
    console.log('Page accessibility snapshot:', JSON.stringify(pageSnapshot, null, 2));

    // Get accessibility snapshot of a specific element
    const elementSnapshot = await playwright_getAccessibilitySnapshot({
        selector: 'main'
    });
    console.log('Main element accessibility snapshot:', JSON.stringify(elementSnapshot, null, 2));
}

// Example 5: Advanced Selectors and State Validation
async function demoAdvancedSelectors() {
    console.log('\n=== Advanced Selectors Demo ===\n');

    await playwright_navigate({ url: 'https://example.com' });

    // Use semantic selectors
    await playwright_clickByRole({ role: 'button', name: 'Submit' });
    await playwright_fillByLabel({ label: 'Email', value: 'test@example.com' });
    await playwright_clickByPlaceholder({ placeholder: 'Search...' });

    // Validate element states
    const isVisible = await playwright_isVisible({ selector: '#success-message' });
    const isEnabled = await playwright_isEnabled({ selector: 'button[type="submit"]' });
    const count = await playwright_countElements({ selector: '.list-item' });

    console.log('Success message visible:', isVisible);
    console.log('Submit button enabled:', isEnabled);
    console.log('List items count:', count);
}

// Example 6: Screenshot and PDF Generation
async function demoMediaCapture() {
    console.log('\n=== Media Capture Demo ===\n');

    await playwright_navigate({ url: 'https://example.com' });

    // Take various types of screenshots
    await playwright_screenshot({ path: './screenshots/page.png' });
    await playwright_screenshotFullPage({ path: './screenshots/fullpage.png' });
    await playwright_screenshotElement({
        selector: 'h1',
        path: './screenshots/heading.png'
    });

    // Generate PDF
    await playwright_pdf({
        path: './output.pdf',
        options: {
            format: 'A4',
            printBackground: true
        }
    });

    console.log('Screenshots and PDF generated successfully');
}

// Example 7: Form Automation with Validation
async function demoFormAutomation() {
    console.log('\n=== Form Automation Demo ===\n');

    await playwright_navigate({ url: 'https://example.com/form' });

    // Fill form using various methods
    await playwright_fillByLabel({ label: 'Full Name', value: 'John Doe' });
    await playwright_fillByPlaceholder({ placeholder: 'Enter email', value: 'john@example.com' });

    // Select dropdown option
    await playwright_selectOption({ selector: '#country', value: 'US' });

    // Check checkbox
    await playwright_check({ selector: '#terms' });

    // Verify form state before submission
    const isChecked = await playwright_isChecked({ selector: '#terms' });
    const formValue = await playwright_getValue({ selector: '#email' });

    console.log('Terms checkbox checked:', isChecked);
    console.log('Email value:', formValue);

    // Submit form
    await playwright_clickByRole({ role: 'button', name: 'Submit' });

    // Wait for success message
    await playwright_waitForSelector({ selector: '.success-message', timeout: 5000 });
}

// Example 8: Mobile Device Emulation
async function demoMobileEmulation() {
    console.log('\n=== Mobile Device Emulation Demo ===\n');

    // Emulate iPhone 12
    await playwright_emulateDevice({ deviceName: 'iPhone 12' });

    await playwright_navigate({ url: 'https://example.com' });

    // Take screenshot of mobile view
    await playwright_screenshot({ path: './screenshots/mobile.png' });

    console.log('Mobile emulation complete');

    // Or manually set viewport
    await playwright_setViewportSize({ width: 375, height: 667 });
}

// Example 9: Keyboard and Mouse Control
async function demoInputControl() {
    console.log('\n=== Input Control Demo ===\n');

    await playwright_navigate({ url: 'https://example.com' });

    // Keyboard actions
    await playwright_keyboardPress({ key: 'Tab' });
    await playwright_keyboardType({ text: 'Hello World', delay: 100 });
    await playwright_keyboardPress({ key: 'Enter' });

    // Mouse actions
    await playwright_mouseMove({ x: 100, y: 200 });
    await playwright_mouseClick({ x: 100, y: 200 });

    // Scroll actions
    await playwright_scrollTo({ x: 0, y: 500 });
    await playwright_scrollIntoView({ selector: '#footer' });
}

// Example 10: Complete E2E Test with All Features
async function demoCompleteE2ETest() {
    console.log('\n=== Complete E2E Test Demo ===\n');

    // Setup
    await playwright_setupConsoleCapture();
    await playwright_startTracing({ screenshots: true, snapshots: true });

    // Navigate and interact
    await playwright_navigate({ url: 'https://example.com' });
    await playwright_waitForLoadState({ state: 'networkidle' });

    // Validate page loaded
    const title = await playwright_getTitle();
    console.log('Page title:', title);

    // Perform actions
    await playwright_clickByText({ text: 'Get Started' });
    await playwright_fillByLabel({ label: 'Email', value: 'test@example.com' });
    await playwright_clickByRole({ role: 'button', name: 'Subscribe' });

    // Validate results
    const successVisible = await playwright_isVisible({ selector: '.success' });
    console.log('Success message visible:', successVisible);

    // Capture evidence
    await playwright_screenshotFullPage({ path: './screenshots/e2e-result.png' });

    // Get console logs
    const logs = await playwright_getConsoleLogs();
    console.log('Console logs:', logs.count);

    // Stop tracing
    await playwright_stopTracing({ path: './e2e-trace.zip' });

    console.log('E2E test complete with full tracing and logging');
}

// Run all demos
async function runAllDemos() {
    try {
        await demoNetworkAndConsole();
        await demoTracing();
        await demoGeolocationAndPermissions();
        await demoAccessibility();
        await demoAdvancedSelectors();
        await demoMediaCapture();
        await demoFormAutomation();
        await demoMobileEmulation();
        await demoInputControl();
        await demoCompleteE2ETest();

        console.log('\n✅ All demos completed successfully!');
    } catch (error) {
        console.error('❌ Demo failed:', error);
    }
}

// Export for use
export {
    demoNetworkAndConsole,
    demoTracing,
    demoGeolocationAndPermissions,
    demoAccessibility,
    demoAdvancedSelectors,
    demoMediaCapture,
    demoFormAutomation,
    demoMobileEmulation,
    demoInputControl,
    demoCompleteE2ETest,
    runAllDemos
};
