
import express, { Request, Response } from "express";
import { TUserId, TUserInfo } from "../../lib/User/user.types";
import { respond } from "../../response";
import { userManager, logicTime } from "../../resource";

import { performance } from "perf_hooks";

// let startTime = performance.now();
// let ind=0;

// // while( performance.now()-startTime < 1000 ) {
// while( ind< 1148577 ) {
//   userManager.addUser( ind, { userName: "u"+(++ind)});
// }

// // console.log( { size: userManager.size })
// console.log( { size: userManager.size, timeEnd: performance.now()-startTime })

export const router = express.Router();

type TLoginReqBody = {
  userId: TUserId;
  userInfo: TUserInfo;
}

export function userAddController( req: Request, res: Response ) {
  
  const data: TLoginReqBody = req.body;
  const startTime = performance.now();
  const addedUser = userManager.addUser( data.userId, data.userInfo );
  logicTime.user.add += performance.now() - startTime;
  return respond.ok( res, { userId: addedUser.userId } );
}