import { context } from "../config.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { getToken } from "../utils/token.utils.js";

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

    // save token record in db

    const tokenRecord = await context.prismaClient.token.create({
      data: {
        userId: user.id,
      },
    });

    const payload = {
      email,
      username: user.username,
      id: user.id,
      tokenId: tokenRecord.tokenId,
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
        expiresIn: "7 days",
      }
    );

    res.status(200).send({
      user,
      accessToken,
      refreshToken,
    });
  } catch (e) {
    res.status(500).send("Somethings went wrong!!");
  }
});

export const logoutHandler = asyncHandler(async (req, res) => {
  // delete token from db
  const token = getToken(req, res);
  const tokenId = jsonwebtoken.decode(token).tokenId;
  await context.prismaClient.token.delete({
    where: {
      tokenId,
    },
  });

  res.send(true);
});

export const refreshTokenHandler = async (req, res) => {
  const { refreshToken } = req.body;
  const accessToken = getToken(req, res);

  try {
    currentAccessToken = jsonwebtoken.verify(
      accessToken,
      process.env.SECRET_ACCESS_TOKEN
    );

    return res.send({ accessToken, refreshToken });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // Check refrech Token

      try {
        const currentRefreshToken = jsonwebtoken.verify(
          refreshToken,
          process.env.SECRET_REFRESH_TOKEN
        );

        const updatedToken = await context.prismaClient.token.update({
          where: {
            tokenId: currentRefreshToken.payload.tokenId,
          },
          data: {
            tokenId: uuid(),
          },
        });

        // Generate new Tokens

        const { email, username, id } = currentRefreshToken.payload;

        const payload = {
          email,
          username,
          id,
          tokenId: updatedToken.tokenId,
        };

        const newRefreshToken = jsonwebtoken.sign(
          payload,
          process.env.SECRET_REFRESH_TOKEN,
          {
            expiresIn: "7 days",
          }
        );
        const newToken = jsonwebtoken.sign(
          payload,
          process.env.SECRET_ACCESS_TOKEN,
          {
            expiresIn: "1 hour",
          }
        );

        return res.send({
          accessToken: newToken,
          refreshToken: newRefreshToken,
        });
      } catch (err) {
        return res.status(500).send(err);
      }
    }
    return res.status(500).send(error);
  }
};
