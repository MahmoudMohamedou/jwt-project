import { context } from "../config.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

export const loginHandler = asyncHandler(async (req, res, __) => {
  // Check user credentials

  const { email, password } = req.body;

  try {
    const user = await context.prismaClient.user.findUnique({
      where: {
        email,
      },
    });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      res.status(401).send("Unauthorized");
      return;
    }

    // generate access token & refresh token

    const payload = {
      email,
      username: user.username,
      id: user.id,
    };

    const accessToken = jsonwebtoken.sign(
      payload,
      process.env.SECRET_ACCESS_TOKEN,
      {
        expiresIn: "1 hour",
      }
    );
    const refreshToken = jsonwebtoken.sign(
      payload,
      process.env.SECRET_REFRESH_TOKEN,
      {
        expiresIn: "1 day",
      }
    );

    res.cookie("access-token", accessToken);
    res.cookie("refresh-token", refreshToken);

    res.status(200).send({
      user,
      accessToken,
      refreshToken,
    });
  } catch (e) {
    res.status(500).send("Somethings went wrong!!");
  }
});

export const logoutHandler = (req, res) => {
  console.log("Logout!");
};

export const refreshTokenHandler = (req, res) => {
  const { refrechToken } = req.body;
  const authorization = req.headers.authorization;
  const accessToken = authorization ? authorization.split(" ")[1] : null;

  if (!accessToken) return res.status(500).send("Access Token not provided!");

  let tokenId;

  try {
    tokenId = jsonwebtoken.verify(accessToken, process.env.SECRET_ACCESS_TOKEN);

    return res.send({ accessToken, refrechToken });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // Check refrech Token

      try {
        const refreshTokenId = jsonwebtoken.verify(
          refrechToken,
          process.env.SECRET_REFRESH_TOKEN
        );
        // Generate new Tokens

        const newRefreshToken = jsonwebtoken.sign(
          refreshTokenId.payload,
          process.env.SECRET_REFRESH_TOKEN
        );
        const newToken = jsonwebtoken.sign(
          tokenId.payload,
          process.env.SECRET_ACCESS_TOKEN
        );
        return res.send({
          accessToken: newToken,
          refrechToken: newRefreshToken,
        });
      } catch (err) {
        return res.status(500).send(err);
      }
    }
    return res.status(500).send(error);
  }
};
