/**
 * Unit Tests for PlaywrightService
 * @author Sandeep Talware
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PlaywrightService } from '../src/services/PlaywrightService.js';

describe('PlaywrightService', () => {
    let service;

    beforeEach(() => {
        service = new PlaywrightService();
    });

    afterEach(async () => {
        if (service.isInitialized) {
            await service.close();
        }
    });

    describe('Constructor', () => {
        it('should initialize with null browser, context, and page', () => {
            expect(service.browser).toBeNull();
            expect(service.context).toBeNull();
            expect(service.page).toBeNull();
            expect(service.isInitialized).toBe(false);
        });

        it('should have logger instance', () => {
            expect(service.logger).toBeDefined();
        });
    });

    describe('_ensureInitialized', () => {
        it('should throw error when not initialized', () => {
            expect(() => service._ensureInitialized()).toThrow(
                'Browser not initialized. Call initialize() first before performing any operations.'
            );
        });

        it('should not throw error when initialized', async () => {
            // Mock initialization
            service.isInitialized = true;
            service.page = {};
            service.browser = {};

            expect(() => service._ensureInitialized()).not.toThrow();
        });
    });

    describe('navigate', () => {
        it('should throw error when not initialized', async () => {
            await expect(service.navigate('https://example.com')).rejects.toThrow(
                'Browser not initialized'
            );
        });
    });

    describe('click', () => {
        it('should throw error when not initialized', async () => {
            await expect(service.click('#button')).rejects.toThrow(
                'Browser not initialized'
            );
        });
    });

    describe('fill', () => {
        it('should throw error when not initialized', async () => {
            await expect(service.fill('#input', 'value')).rejects.toThrow(
                'Browser not initialized'
            );
        });
    });

    describe('close', () => {
        it('should handle close when not initialized', async () => {
            await expect(service.close()).resolves.not.toThrow();
        });

        it('should reset state after close', async () => {
            // Mock initialized state
            service.isInitialized = true;
            service.browser = { close: vi.fn() };
            service.context = { close: vi.fn() };
            service.page = { removeAllListeners: vi.fn() };

            await service.close();

            expect(service.isInitialized).toBe(false);
            expect(service.browser).toBeNull();
            expect(service.context).toBeNull();
            expect(service.page).toBeNull();
        });
    });

    describe('Dialog Handlers', () => {
        it('should throw error when setting up dialog handlers without initialization', async () => {
            await expect(service.acceptDialog()).rejects.toThrow(
                'Browser not initialized'
            );
        });
    });
});
