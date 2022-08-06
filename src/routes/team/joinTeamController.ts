import express, { Request, Response } from "express";
import { userManager } from "../../resource";
import { TUserId } from "../../lib/User/user.types";
import { respond } from "../../response";

export const router = express.Router();

type TJoinTeamReqBody = {
  joinToTeamOfUserId: TUserId;
  userIdWhoWantsToJoin: TUserId;
}

export function joinTeamController( req:Request, res:Response ) {
  const data: TJoinTeamReqBody = req.body;

  const userWhoWantsToJoin = userManager.getUser( data.userIdWhoWantsToJoin );
  if ( !userWhoWantsToJoin ) return respond.err( res, data, "User who wants to join doesn't exist" );
  
  const joinToThisUser = userManager.getUser( data.joinToTeamOfUserId );
  if ( !joinToThisUser ) return respond.err( res, {}, "Destination user doesn't exist" );

  if ( userWhoWantsToJoin.lobbyTeam === joinToThisUser.lobbyTeam )
    return respond.ok( res, { userId: userWhoWantsToJoin.userId, joinedTo: joinToThisUser.userId, leaderId: userWhoWantsToJoin.lobbyTeam.leader?.userId, teamId: userWhoWantsToJoin.lobbyTeam.teamId });

  if ( !joinToThisUser.lobbyTeam?.hasVacancy(1) ) return respond.err( res, {}, "No Vacancy" );

  userWhoWantsToJoin.lobbyTeam = joinToThisUser.lobbyTeam;
  return respond.ok( res, { userId: userWhoWantsToJoin.userId, joinedTo: joinToThisUser.userId, leaderId: userWhoWantsToJoin.lobbyTeam.leader?.userId, teamId: userWhoWantsToJoin.lobbyTeam.teamId });
  
}