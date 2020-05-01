module.exports = class RequestError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'RequestError';
    this.statusCode = statusCode;
  }
};
