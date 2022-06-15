import express, { Application, Request, Response, NextFunction } from "express";

const app: Application = express();
const port: number = 3000;

app.get('/', (req: Request, res: Response, next: NextFunction ) => {
  res.send("hello");
})

app.post( "/login", ( req:Request, res:Response ) => {

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})