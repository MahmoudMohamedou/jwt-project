export const getToken = (req, res) => {
  const authorization = req.headers.authorization;
  const accessToken = authorization ? authorization.split(" ")[1] : null;

  if (!accessToken) return res.status(500).send("Access Token not provided!");

  return accessToken;
};
