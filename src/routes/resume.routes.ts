import { Router } from "express"
import * as resumeControllers from "../controller/resume.controller"
import { upload } from "../middleware/upload"

const resumeRouter = Router()

resumeRouter.post("/upload", upload.single("resume"), resumeControllers.uploadResume)
// resumeRouter.post("/analyze", resumeControllers.analyzeResume)
resumeRouter.get("/analyze/:resumeId", resumeControllers.analyzeResumeUsingAi)

export default resumeRouter  