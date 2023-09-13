const { UNAUTHORIZED_CODE } = require('../config/config');

class AuthError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED_CODE;
  }
}

module.exports = AuthError;