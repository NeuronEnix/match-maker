import express, { Request, Response } from "express";
import { userManager } from "../../resource";
import { TUserId } from "src/lib/User";
import { respond } from "../../response";

export const router = express.Router();

type TLeaveTeamReqBody = {
  leavingUserId: TUserId;
}

export function leaveTeamController( req:Request, res:Response ) {
  const data: TLeaveTeamReqBody = req.body;

  const leavingUser = userManager.getUser( data.leavingUserId );
  if ( !leavingUser ) return respond.err( res, {}, "User doesn't exist" );

  const oldTeam = leavingUser.leaveCurrentTeam();
  const newTeam = leavingUser.team;
  
  return respond.ok( res, {
    oldTeam: { id: oldTeam.teamId, userCount: oldTeam.userCount },
    newTeam: { id: newTeam.teamId, userCount: newTeam.userCount }
  });
  
}