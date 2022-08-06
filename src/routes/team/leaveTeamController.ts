import express, { Request, Response } from "express";
import { userManager } from "../../resource";
import { TUserId } from "../../lib/User/user.types";
import { respond } from "../../response";

export const router = express.Router();

type TLeaveTeamReqBody = {
  leavingUserId: TUserId;
}

export function leaveTeamController( req:Request, res:Response ) {
  const data: TLeaveTeamReqBody = req.body;

  const leavingUser = userManager.getUser( data.leavingUserId );
  if ( !leavingUser ) return respond.err( res, {}, "User doesn't exist" );


  const oldTeam = leavingUser.lobbyTeam;
  leavingUser.lobbyTeam = null;
  const newTeam = leavingUser.lobbyTeam;
  
  return respond.ok( res, {
    leavingUserId: leavingUser.userId,
    oldTeam: { id: oldTeam.teamId, userCount: oldTeam.size, leader: oldTeam.leader?.userId },
    newTeam: { id: newTeam.teamId, userCount: newTeam.size, leader: newTeam.leader?.userId }

  });
  
}