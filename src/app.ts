import dotenv from "dotenv";
dotenv.config();
import express, { urlencoded, type Request, type Response } from "express"
import cors from "cors"
import cookieParser from 'cookie-parser'
import routes from "./routes";

const app = express();

app.use(cors())

app.use(express.json())
app.use(urlencoded({ extended: true }))
app.use(cookieParser())

app.use((req, res, next) => {
  console.log("request received:", req.url);
  next()
})

app.get("/", (_req: Request, res: Response) => {
  res.status(500).json({ message: "Server running" });
})

app.use("/api", routes)

export default app