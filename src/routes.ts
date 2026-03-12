import { Router } from "express";
import resumeRouter from "./routes/resume.routes";

const routes = Router()

routes.use("/resume", resumeRouter)

export default routes