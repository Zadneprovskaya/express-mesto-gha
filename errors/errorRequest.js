const { ERROR_CODE } = require('../config/config');

class RequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE;
  }
}

module.exports = RequestError;
