/**
 * @author Sandeep Talware
 */

import { Logger } from '../utils/logger.js';
import { PlaywrightSession } from './PlaywrightSession.js';

export class SessionManager {
    constructor(playwrightService) {
        this.playwrightService = playwrightService;
        this.sessions = new Map();
        this.logger = new Logger('SessionManager');
    }

    async createSession(connectionId) {
        this.logger.info('Creating new session', { connectionId });

        try {
            const browser = this.playwrightService.getBrowser();
            const session = new PlaywrightSession(browser, connectionId);
            await session.initialize();

            this.sessions.set(connectionId, session);
            return session;
        } catch (error) {
            this.logger.error('Failed to create session', error);
            throw error;
        }
    }

    getSession(connectionId) {
        return this.sessions.get(connectionId);
    }

    async closeSession(connectionId) {
        this.logger.info('Closing session', { connectionId });
        const session = this.sessions.get(connectionId);

        if (session) {
            try {
                await session.close();
            } catch (error) {
                this.logger.error('Error closing session', error);
            } finally {
                this.sessions.delete(connectionId);
            }
        }
    }

    async closeAll() {
        this.logger.info('Closing all sessions');
        for (const connectionId of this.sessions.keys()) {
            await this.closeSession(connectionId);
        }
    }
}
