
import express, { Request, Response } from "express";
import { TUserId, TUserInfo } from "../../lib/User/user.types";
import { respond } from "../../response";
import { userManager } from "../../resource";

export const router = express.Router();

type TDelReqBody = {
  userId: TUserId;
}

export function userDelController( req: Request, res: Response ) {
  const data: TDelReqBody = req.body;
  userManager.delUser( data.userId );
  return respond.ok( res, data );
}