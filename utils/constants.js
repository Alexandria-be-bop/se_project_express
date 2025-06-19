const BAD_REQUEST = 400;
const NOT_FOUND = 404;
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
  } else {
    res.status(DEFAULT).send({ status: DEFAULT, message: err.message });
  }
  next();
};

module.exports = { errorHandler, DEFAULT, NOT_FOUND, BAD_REQUEST };
