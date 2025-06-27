const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const NOT_FOUND = 404;
const CONFLICT = 409;
const DEFAULT = 500;

const errorHandler = (err, req, res, next) => {
  // Log the exception
  if (err.name === "DocumentNotFoundError") {
    res.status(NOT_FOUND).send({ status: NOT_FOUND, message: err.message });
  } else if (err.name === "CastError") {
    res
      .status(BAD_REQUEST)
      .send({ status: BAD_REQUEST, message: "Invalid parameter" });
  } else if (
    err.name === "ValidationError" ||
    err.message === "ValidationError"
  ) {
    res
      .status(BAD_REQUEST)
      .send({ status: BAD_REQUEST, message: "Invalid data" });
  } else if (err.message === "Email and password are required") {
    res.status(BAD_REQUEST).send({ status: BAD_REQUEST, message: err.message });
  } else if (err.code === 11000) {
    res
      .status(CONFLICT)
      .send({ message: "User with this email already exists" });
  } else if (err.message === "Email is already in use") {
    res.status(CONFLICT).send({ status: CONFLICT, message: err.message });
  } else {
    res.status(DEFAULT).send({ status: DEFAULT, message: err.message });
  }
  next();
};

module.exports = {
  errorHandler,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  CONFLICT,
  DEFAULT,
};
