import express from "express";
import { userAddController } from "./userAddController";
import { userDelController } from "./userDelController";
import { userViewController } from "./userViewController";

export const userRouter = express.Router();

userRouter.get(  "/view", express.json(), userViewController );

userRouter.post( "/add", express.json(), userAddController );
userRouter.post( "/del", express.json(), userDelController );