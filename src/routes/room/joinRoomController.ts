import express, { Request, Response } from "express";

export const router = express.Router();

export function joinRoomController ( req:Request, res:Response ) {
  return res.sendStatus( 200 );
}