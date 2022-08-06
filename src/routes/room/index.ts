import express from "express";
import { roomViewController } from "./roomViewController";
import { roomJoinController } from "./roomJoinController";

export const roomRouter = express.Router();

roomRouter.get( "/view", express.json(), roomViewController );
roomRouter.post( "/join", express.json(), roomJoinController );