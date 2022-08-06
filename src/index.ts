import express, { Application, Request, Response } from "express";
import { mainRouter } from "./routes";

const app: Application = express();
const port: number = 3001;

// app.use( express.json(), ( req, res, next ) => {
  
//   console.log({
//     method: req.method,
//     path: req.path,
//     body: req.body,
//     query: req.query
//   })
//   return next();

// })

app.get("/", ( req, res ) => {
  return res.send( {msg:"home"});
})
app.use( mainRouter );

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
