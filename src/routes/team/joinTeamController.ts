import express, { Request, Response } from "express";
import { userManager } from "../../resource";
import { TUserId } from "src/lib/User";
import { respond } from "../../response";

export const router = express.Router();

type TJoinTeamReqBody = {
  joinToTeamOfUserId: TUserId;
  userIdWhoWantsToJoin: TUserId;
}

export function joinTeamController( req:Request, res:Response ) {
  const data: TJoinTeamReqBody = req.body;

  const userWhoWantsToJoin = userManager.getUser( data.userIdWhoWantsToJoin );
  if ( !userWhoWantsToJoin ) return respond.err( res, {}, "User who wants to join doesn't exist" );
  
  const joinToThisUser = userManager.getUser( data.joinToTeamOfUserId );
  if ( !joinToThisUser ) return respond.err( res, {}, "Destination user doesn't exist" );

  if ( !joinToThisUser.hasVacancyInMyTeam(1) ) return respond.err( res, {}, "No Vacancy" );

  joinToThisUser.addUserToMyTeam( userWhoWantsToJoin );
  return respond.ok( res, { userId: userWhoWantsToJoin.userId, joinedTo: joinToThisUser.userId, leaderId: userWhoWantsToJoin.team.leader?.userId });
  
}