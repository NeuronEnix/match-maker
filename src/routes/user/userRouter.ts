import express from "express";
import { userLoginController } from "./userLoginController";

export const userRouter = express.Router();

userRouter.post( "/login", express.json(), userLoginController );