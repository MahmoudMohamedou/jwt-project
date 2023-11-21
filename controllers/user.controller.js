import { createUser } from "../repositories/user.repository.js";
import asyncHandler from "express-async-handler";

export const createUserHandler = asyncHandler(async (req, res, _) => {
  const body = req.body;
  const user = await createUser(body);
  res.status(200).send(user);
});
