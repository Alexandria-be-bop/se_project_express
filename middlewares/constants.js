const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
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
  } else if (err.name === "ValidationError") {
    res
      .status(BAD_REQUEST)
      .send({ status: BAD_REQUEST, message: "Invalid data" });
  } else if (err.code === 11000) {
    res
      .status(CONFLICT)
      .send({ message: "User with this email already exists" });
  } else {
    res.status(DEFAULT).send({ status: DEFAULT, message: err.message });
  }
  next();
};

module.exports = {
  errorHandler,
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  CONFLICT,
  DEFAULT,
};
