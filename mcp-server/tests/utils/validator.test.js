/**
 * Unit Tests for Validator
 * @author Sandeep Talware
 */

import { describe, it, expect } from 'vitest';
import { Validator } from '../src/utils/validator.js';

describe('Validator', () => {
    describe('validateMCPRequest', () => {
        it('should validate a valid MCP request', () => {
            const request = {
                jsonrpc: '2.0',
                method: 'initialize',
                id: 1
            };

            expect(() => Validator.validateMCPRequest(request)).not.toThrow();
        });

        it('should throw error for invalid request format', () => {
            expect(() => Validator.validateMCPRequest(null)).toThrow('Invalid request format');
            expect(() => Validator.validateMCPRequest('string')).toThrow('Invalid request format');
        });

        it('should throw error for invalid JSON-RPC version', () => {
            const request = {
                jsonrpc: '1.0',
                method: 'test',
                id: 1
            };

            expect(() => Validator.validateMCPRequest(request)).toThrow('Invalid JSON-RPC version');
        });

        it('should throw error for missing method', () => {
            const request = {
                jsonrpc: '2.0',
                id: 1
            };

            expect(() => Validator.validateMCPRequest(request)).toThrow('Missing or invalid method');
        });

        it('should throw error for missing ID', () => {
            const request = {
                jsonrpc: '2.0',
                method: 'test'
            };

            expect(() => Validator.validateMCPRequest(request)).toThrow('Missing request ID');
        });
    });

    describe('validatePlaywrightAction', () => {
        it('should validate valid action with required params', () => {
            expect(() => Validator.validatePlaywrightAction('navigate', { url: 'https://example.com' })).not.toThrow();
            expect(() => Validator.validatePlaywrightAction('click', { selector: '#button' })).not.toThrow();
        });

        it('should throw error for unknown action', () => {
            expect(() => Validator.validatePlaywrightAction('unknownAction', {})).toThrow('Unknown action: unknownAction');
        });

        it('should throw error for missing required parameter', () => {
            expect(() => Validator.validatePlaywrightAction('navigate', {})).toThrow('Missing required parameter: url');
            expect(() => Validator.validatePlaywrightAction('click', {})).toThrow('Missing required parameter: selector');
        });

        it('should throw error when parameter is null', () => {
            expect(() => Validator.validatePlaywrightAction('navigate', { url: null })).toThrow('Missing required parameter: url');
        });

        it('should throw error when parameter is undefined', () => {
            expect(() => Validator.validatePlaywrightAction('click', { selector: undefined })).toThrow('Missing required parameter: selector');
        });

        it('should validate actions with no required params', () => {
            expect(() => Validator.validatePlaywrightAction('goBack', {})).not.toThrow();
            expect(() => Validator.validatePlaywrightAction('reload', {})).not.toThrow();
        });

        it('should validate fill action with both required params', () => {
            expect(() => Validator.validatePlaywrightAction('fill', { selector: '#input', value: 'test' })).not.toThrow();
        });

        it('should validate drag and drop actions', () => {
            expect(() => Validator.validatePlaywrightAction('dragAndDrop', {
                sourceSelector: '#source',
                targetSelector: '#target'
            })).not.toThrow();

            expect(() => Validator.validatePlaywrightAction('dragAndDropByCoordinates', {
                selector: '#element',
                targetX: 100,
                targetY: 200
            })).not.toThrow();
        });
    });
});
