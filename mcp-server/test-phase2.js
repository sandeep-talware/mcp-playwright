/**
 * Test script to verify Phase 2 tool registration
 * This script starts the MCP server and checks if all Phase 2 tools are registered
 */

import { MCPProtocolService } from '../src/services/MCPProtocolService.js';
import { PlaywrightService } from '../src/services/PlaywrightService.js';

async function testPhase2Registration() {
    console.log('🧪 Testing Phase 2 Tool Registration...\n');

    try {
        // Initialize services
        const playwrightService = new PlaywrightService();
        const mcpService = new MCPProtocolService(playwrightService);

        // Get all registered tools
        const tools = mcpService.tools;
        console.log(`✅ Total tools registered: ${tools.length}\n`);

        // Define Phase 2 tool names
        const phase2Tools = [
            // Network Control
            'playwright_route_request',
            'playwright_abort_request',
            'playwright_get_network_activity',
            // Advanced Debugging
            'playwright_setup_console_capture',
            'playwright_get_console_logs',
            'playwright_clear_console_logs',
            'playwright_start_tracing',
            'playwright_stop_tracing',
            // System & Environment
            'playwright_set_geolocation',
            'playwright_grant_permissions',
            'playwright_clear_permissions',
            'playwright_set_timezone',
            // Accessibility
            'playwright_get_accessibility_snapshot'
        ];

        console.log('🔍 Checking Phase 2 tools registration:\n');

        let allFound = true;
        const registeredToolNames = tools.map(t => t.name);

        // Check each Phase 2 tool
        phase2Tools.forEach((toolName, index) => {
            const isRegistered = registeredToolNames.includes(toolName);
            const status = isRegistered ? '✅' : '❌';
            console.log(`${status} ${index + 1}. ${toolName}`);
            if (!isRegistered) allFound = false;
        });

        console.log('\n' + '='.repeat(60));

        if (allFound) {
            console.log('✅ SUCCESS: All 17 Phase 2 tools are registered!');
            console.log(`📊 Total tools: ${tools.length} (Expected: ~60)`);
            process.exit(0);
        } else {
            console.log('❌ FAILURE: Some Phase 2 tools are missing!');
            process.exit(1);
        }

    } catch (error) {
        console.error('❌ Error during test:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Run the test
testPhase2Registration();
