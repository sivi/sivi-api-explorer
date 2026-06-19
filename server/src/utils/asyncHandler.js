/**
 * Wraps async route handlers to catch errors and forward them to Express error middleware.
 * Eliminates need for try/catch in every route handler.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
