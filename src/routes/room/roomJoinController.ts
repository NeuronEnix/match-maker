import express, { Request, Response } from "express";
import { respond } from "../../response";
import { TUserId } from "../../lib/User/user.types";
import { roomManager, userManager } from "../../resource";

export const router = express.Router();

type TJoinRoomReqBody = {
  userId: TUserId;
};

export function roomJoinController ( req:Request, res:Response ) {
  const data: TJoinRoomReqBody = req.body;

  const user = userManager.getUser( data.userId );
  if ( !user ) return respond.err( res, {}, "User doesn't exist" );

  const room = roomManager.joinRoom( user.lobbyTeam );
  user.lobbyTeam.forEach( lobbyUser => lobbyUser.room = room );
  return respond.ok( res, {
    roomId: room.roomId, teamCount: room.teamCount, userCount: room.userCount, isFull: room.isFull, vacancy: room.hasVacancy(1)
  })
}