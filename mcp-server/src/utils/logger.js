/**
 * @author Sandeep Talware
 */

export class Logger {
  constructor(context = 'Server') {
    this.context = context;
  }

  /**
   * Creates a circular reference safe JSON stringifier
   * @private
   */
  _getCircularReplacer() {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular]';
        }
        seen.add(value);
      }
      return value;
    };
  }

  info(message, data = {}) {
    console.log(JSON.stringify({
      level: 'INFO',
      context: this.context,
      message,
      data,
      timestamp: new Date().toISOString()
    }, this._getCircularReplacer()));
  }

  error(message, error = {}) {
    console.error(JSON.stringify({
      level: 'ERROR',
      context: this.context,
      message,
      error: error.message || error,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }, this._getCircularReplacer()));
  }

  debug(message, data = {}) {
    console.log(JSON.stringify({
      level: 'DEBUG',
      context: this.context,
      message,
      data,
      timestamp: new Date().toISOString()
    }, this._getCircularReplacer()));
  }
}