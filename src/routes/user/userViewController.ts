
import express, { Request, Response } from "express";
import { TUserId, TUserInfo } from "../../lib/User/user.types";
import { respond } from "../../response";
import { userManager, logicTime } from "../../resource";

export const router = express.Router();

type TViewReqBody = {
  userId: TUserId;
  userInfo: TUserInfo;
}

export function userViewController( req: Request, res: Response ) {
  // const data: TViewReqBody = req.body;
  return respond.ok( res, { userSize: userManager.size, logicTime } );

  const data = userManager.map( user => ({
    id: user.userId,
    nm: user.userInfo.userName,
    tId: user.lobbyTeam.teamId,
    tLen: user.lobbyTeam.size,
    tld: user.lobbyTeam.leader?.userId,
    rId: user.room?.roomId,
    rLen: user.room?.userCount
  }))
  
  return respond.ok( res, { userList: data } );
}