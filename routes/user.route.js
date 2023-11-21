import { Router } from "express";
import { createUserHandler } from "../controllers/user.controller.js";

export const userRouter = Router();

userRouter.get("/", (req, res) => {
  res.send("Yes");
});
userRouter.get("/:id", () => {});

userRouter.post("/create", createUserHandler);
