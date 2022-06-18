import express from "express";
import { joinTeamController } from "./joinTeamController";
import { leaveTeamController } from "./leaveTeamController";

export const teamRouter = express.Router();

teamRouter.post( "/joinTeam", express.json(), joinTeamController );
teamRouter.post( "/leaveTeam", express.json(), leaveTeamController );