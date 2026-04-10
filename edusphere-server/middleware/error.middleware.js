const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error details in development
  if (process.env.NODE_ENV === 'development') {
    console.error('🔴 ERROR:'.red.bold, err);
  }

  // ─── Mongoose Bad ObjectId ────────────────────────────────
  if (err.name === 'CastError') {
    const message = `Resource not found with id: ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // ─── Mongoose Duplicate Key ───────────────────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' already exists. Please use a different value.`;
    error = new ErrorResponse(message, 400);
  }

  // ─── Mongoose Validation Error ────────────────────────────
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join('. ');
    error = new ErrorResponse(message, 400);
  }

  // ─── JWT Errors ───────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    error = new ErrorResponse('Invalid token. Please log in again.', 401);
  }

  if (err.name === 'TokenExpiredError') {
    error = new ErrorResponse('Session expired. Please log in again.', 401);
  }

  // ─── Multer File Upload Errors ────────────────────────────
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = new ErrorResponse('File size too large. Maximum allowed size is 5MB.', 400);
  }

  // ─── Send Response ────────────────────────────────────────
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
