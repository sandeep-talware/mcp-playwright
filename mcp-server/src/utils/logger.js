export class Logger {
  constructor(context = 'Server') {
    this.context = context;
  }

  info(message, data = {}) {
    console.log(JSON.stringify({
      level: 'INFO',
      context: this.context,
      message,
      data,
      timestamp: new Date().toISOString()
    }));
  }

  error(message, error = {}) {
    console.error(JSON.stringify({
      level: 'ERROR',
      context: this.context,
      message,
      error: error.message || error,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }));
  }

  debug(message, data = {}) {
    console.log(JSON.stringify({
      level: 'DEBUG',
      context: this.context,
      message,
      data,
      timestamp: new Date().toISOString()
    }));
  }
}