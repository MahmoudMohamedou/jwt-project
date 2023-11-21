import { Router } from "express";
import {
  loginHandler,
  logoutHandler,
  refreshTokenHandler,
} from "../controllers/auth.controller.js";

export const router = Router();

router.post("/login", loginHandler);

router.post("/logout", logoutHandler);

router.post("/refresh-token", refreshTokenHandler);
