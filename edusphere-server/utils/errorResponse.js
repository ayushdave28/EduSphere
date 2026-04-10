// Custom Error class that extends the built-in Error
// Allows us to set a specific HTTP status code with each error

class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    // Capture stack trace (V8 engine)
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorResponse;
