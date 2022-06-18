import express from "express";
import { joinTeamController } from "./joinTeamController";

export const teamRouter = express.Router();

teamRouter.post( "/joinTeam", express.json(), joinTeamController );