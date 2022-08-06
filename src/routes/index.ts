import express from "express";
import { roomRouter } from "./room";
import { teamRouter } from "./team/teamRouter";
import { userRouter } from "./user/userRouter";

export const mainRouter = express.Router();

mainRouter.use( "/user", userRouter );
mainRouter.use( "/team", teamRouter );
mainRouter.use( "/room", roomRouter );
