import jsonwebtoken from "jsonwebtoken";
export const logger = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Somethings went wrong!";

  res.send({
    message,
    statusCode,
    stack: err.stack,
  });
};
