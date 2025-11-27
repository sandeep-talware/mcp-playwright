export class Validator {
  static validateMCPRequest(request) {
    if (!request || typeof request !== 'object') {
      throw new Error('Invalid request format');
    }

    if (!request.jsonrpc || request.jsonrpc !== '2.0') {
      throw new Error('Invalid JSON-RPC version');
    }

    if (!request.method || typeof request.method !== 'string') {
      throw new Error('Missing or invalid method');
    }

    if (!request.id) {
      throw new Error('Missing request ID');
    }

    return true;
  }

  static validatePlaywrightAction(action, params) {
    const requiredParams = {
      navigate: ['url'],
      click: ['selector'],
      fill: ['selector', 'value'],
      screenshot: ['path']
    };

    if (!requiredParams[action]) {
      throw new Error(`Unknown action: ${action}`);
    }

    for (const param of requiredParams[action]) {
      if (!params[param]) {
        throw new Error(`Missing required parameter: ${param}`);
      }
    }

    return true;
  }
}