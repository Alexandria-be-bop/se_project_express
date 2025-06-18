const errorHandler = (err, req, res) => {
  // Log the exception
  if (err.name === "DocumentNotFoundError") {
    res.status(404).send({ status: 404, message: err.message });
  } else if (err.name === "CastError") {
    res.status(400).send({ status: 400, message: err.message });
  } else {
    res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = errorHandler;
