import express from "express";
import { joinRoomController } from "./joinRoomController";

export const roomRouter = express.Router();

roomRouter.post( "/joinRoom", express.json(), joinRoomController );