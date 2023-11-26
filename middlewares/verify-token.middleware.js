import jsonwebtoken from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authorization = req.headers.authorization;
  const token = authorization ? authorization.split(" ")[1] : null;

  if (!authorization) {
    res.status(500).send("You must provide an authorization in the header.");
    return;
  }

  // Check token validation

  try {
    const verifiedToken = jsonwebtoken.verify(
      token,
      process.env.SECRET_ACCESS_TOKEN
    );
    const payload = verifiedToken.payload;

    req.user = payload;

    next();
  } catch (error) {
    res.status(500).send(error);
  }
};
