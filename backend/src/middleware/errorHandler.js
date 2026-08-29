// Normalizes Mongoose validation errors, duplicate-key errors, and anything
// else into a consistent { message, errors? } JSON shape so the frontend
// always has something predictable to render in its error banner.
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(err);

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: "Validation failed", errors });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(409).json({ message: `That ${field} is already in use` });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ message: `Invalid ${err.path}: ${err.value}` });
  }

  const status = err.status || 500;
  return res.status(status).json({ message: err.message || "Internal server error" });
}

module.exports = errorHandler;
