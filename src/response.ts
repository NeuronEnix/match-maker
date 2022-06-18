
import express, { Request, Response } from "express";

class Respond {
  constructor( ){}
  ok( res: Response, data: object, msg: string = "OK" ) {
    return res.status( 200 ).send({ code: 0, msg, data });
  }
  err( res: Response, info: object, msg: string = "FAILED" ) {
    return res.status( 400 ).send({ code: 1, msg, info });
  }
}

export const respond = new Respond();
