import { PlaywrightService } from './src/services/PlaywrightService.js';
import { config } from './src/config/config.js';
import path from 'path';
import fs from 'fs';

// Force enable recording for test
config.recording = { enabled: true, dir: 'recordings/', size: { width: 1280, height: 720 } };
// Fast timeouts for testing healing (so we don't wait 30s)
config.playwright.defaultTimeout = 2000;
// Headless true for speed
config.playwright.headless = true;

async function testPhase3() {
    console.log('🧪 Testing Phase 3 Features (Resilience & Observability)...\n');
    const service = new PlaywrightService();

    try {
        await service.initialize();

        // Load test page
        const testFile = 'file:///' + path.resolve('test.html').replace(/\\/g, '/');
        console.log(`📂 Navigating to ${testFile}`);
        await service.navigate(testFile);

        // ==========================================
        // Test 1: Self-Healing Click
        // ==========================================
        console.log('\n🩹 Testing Self-Healing (Click)...');
        console.log('   Targeting: #submit-btn (Actual ID: #submit-btn-12345)');
        const startTime = Date.now();
        // This selector SHOULD fail initially, trigger healing, and succeed
        await service.click('#submit-btn');
        console.log(`✅ SUCCESS: Click healed and executed in ${Date.now() - startTime}ms`);

        // ==========================================
        // Test 2: Self-Healing Fill
        // ==========================================
        console.log('\n🩹 Testing Self-Healing (Fill)...');
        console.log('   Targeting: #email-input (Actual ID: #email-input-v2)');
        await service.fill('#email-input', 'healed@example.com');
        const val = await service.getValue('#email-input-v2');
        if (val.value === 'healed@example.com') {
            console.log('✅ SUCCESS: Fill healed and value verified');
        } else {
            console.error('❌ FAILURE: Fill reported success but value mismatch');
        }

        // ==========================================
        // Test 3: Video Recording Path
        // ==========================================
        console.log('\n📹 Testing Video Recording...');
        // We need to wait a tick for video to initialize
        await new Promise(r => setTimeout(r, 500));

        const videoRes = await service.getLatestRecordingPath();
        if (videoRes.status === 'success' && videoRes.path) {
            console.log(`✅ SUCCESS: Video path retrieved: ${videoRes.path}`);

            // Note: File might not exist until context closes
        } else {
            console.error('❌ FAILURE: Could not get video path', videoRes);
        }

    } catch (e) {
        console.error('❌ TEST FAILED:', e);
    } finally {
        await service.close();
        console.log('\n🏁 Test Session Ended');
    }
}

testPhase3();
