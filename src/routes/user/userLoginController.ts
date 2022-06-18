
import express, { Request, Response } from "express";
import { TUserId, TUserInfo } from "src/lib/User";
import { userManager } from "../../resource";

export const router = express.Router();

type TLoginReqBody = {
  userId: TUserId;
  userInfo: TUserInfo;
}

export function userLoginController( req:Request, res:Response ) {
  const data: TLoginReqBody = req.body;
  userManager.addUser( data.userId, data.userInfo );
  return res.send( { userId: req.body.userId });
}