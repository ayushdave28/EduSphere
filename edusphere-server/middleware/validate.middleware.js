const { validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');

// ─── Runs after express-validator checks ──────────────────
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Get the first error message for clean response
    const firstError = errors.array()[0].msg;
    return next(new ErrorResponse(firstError, 400));
  }

  next();
};

module.exports = validate;
