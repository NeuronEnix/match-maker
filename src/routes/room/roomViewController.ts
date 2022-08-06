import express, { Request, Response } from "express";
import { respond } from "../../response";
import { TUserId } from "../../lib/User/user.types";
import { roomManager, userManager } from "../../resource";

export const router = express.Router();

export function roomViewController ( req:Request, res:Response ) {
  return respond.ok( res, { roomSize: roomManager.size } )

  const roomList = roomManager.map( room => ({
    rid: room.roomId, uCount: room.userCount, tCount: room.teamCount,
    teamList: room.map( team => ({ tid: team.teamId, ldr: team.leader?.userId, uid: team.map( user => user.userId ) }))
  }))
  return respond.ok( res, { roomList } )
}