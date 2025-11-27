import { config } from '../config/config.js';

export class Logger {
  constructor(context = 'Client') {
    this.context = context;
    this.logLevel = config.logging.level || 'info';
    this.format = config.logging.format || 'json';
    
    // Log level priorities
    this.levels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
  }

  shouldLog(level) {
    return this.levels[level] >= this.levels[this.logLevel];
  }

  formatMessage(level, message, data = {}) {
    const logEntry = {
      level: level.toUpperCase(),
      context: this.context,
      message,
      timestamp: new Date().toISOString()
    };

    // Add data if provided
    if (data && Object.keys(data).length > 0) {
      logEntry.data = data;
    }

    if (this.format === 'json') {
      return JSON.stringify(logEntry, null, config.debug.prettyPrint ? 2 : 0);
    } else {
      // Text format
      return `[${logEntry.timestamp}] ${logEntry.level} [${logEntry.context}] ${message} ${
        Object.keys(data).length > 0 ? JSON.stringify(data) : ''
      }`;
    }
  }

  debug(message, data = {}) {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message, data));
    }
  }

  info(message, data = {}) {
    if (this.shouldLog('info')) {
      console.log(this.formatMessage('info', message, data));
    }
  }

  warn(message, data = {}) {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, data));
    }
  }

  error(message, error = {}) {
    if (this.shouldLog('error')) {
      const errorData = {
        message: error.message || error,
        stack: error.stack,
        code: error.code
      };
      console.error(this.formatMessage('error', message, errorData));
    }
  }

  // Log method for custom log levels
  log(level, message, data = {}) {
    if (this.shouldLog(level)) {
      const method = console[level] || console.log;
      method(this.formatMessage(level, message, data));
    }
  }

  // Create a child logger with a different context
  child(childContext) {
    return new Logger(`${this.context}:${childContext}`);
  }

  // Log a separator for better readability
  separator(char = '=', length = 50) {
    if (this.shouldLog('info')) {
      console.log(char.repeat(length));
    }
  }

  // Log a section header
  section(title) {
    if (this.shouldLog('info')) {
      this.separator();
      this.info(title);
      this.separator();
    }
  }

  // Log performance metrics
  performance(operation, duration, additionalData = {}) {
    this.info(`Performance: ${operation}`, {
      duration: `${duration}ms`,
      ...additionalData
    });
  }

  // Start a timer for performance measurement
  startTimer(label) {
    const startTime = Date.now();
    return {
      end: () => {
        const duration = Date.now() - startTime;
        this.performance(label, duration);
        return duration;
      }
    };
  }
}

// Export a default logger instance
export const defaultLogger = new Logger('Default');