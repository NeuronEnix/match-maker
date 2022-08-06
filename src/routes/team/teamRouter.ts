import express from "express";
import { joinTeamController } from "./joinTeamController";
import { leaveTeamController } from "./leaveTeamController";

export const teamRouter = express.Router();

teamRouter.post( "/join", express.json(), joinTeamController );
teamRouter.post( "/leave", express.json(), leaveTeamController );