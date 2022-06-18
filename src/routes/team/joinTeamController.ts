import express, { Request, Response } from "express";
import { userManager } from "../../resource";
import { TUserId } from "src/lib/User";

export const router = express.Router();

type TJoinTeamReqBody = {
  joinToTeamOfUserId: TUserId;
  userIdWhoWantsToJoin: TUserId;
}

export function joinTeamController( req:Request, res:Response ) {
  const data: TJoinTeamReqBody = req.body;

  const userWhoWantsToJoin = userManager.getUser( data.userIdWhoWantsToJoin );
  if ( !userWhoWantsToJoin ) return res.status( 400 ).send({ msg: "User who wants to join doesn't exist" });
  
  const joinToThisUser = userManager.getUser( data.joinToTeamOfUserId );
  if ( !joinToThisUser ) return res.status( 400 ).send({ msg: "Destination user doesn't exist"});

  if ( !joinToThisUser.hasVacancyInMyTeam(1) ) return res.status( 400 ).send({ msg: "No Vacancy"});

  joinToThisUser.addUserToMyTeam( userWhoWantsToJoin );

  res.send([
    { userId: joinToThisUser.userId, teamId: joinToThisUser.team.teamId, leaderId: joinToThisUser.team.leader?.userId },
    { userId: userWhoWantsToJoin.userId, teamId: userWhoWantsToJoin.team.teamId, leaderId: userWhoWantsToJoin.team.leader?.userId },
  ])
  
}