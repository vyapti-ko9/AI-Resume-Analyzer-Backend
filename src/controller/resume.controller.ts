import { Request, Response } from "express";
import fs from "fs";
import { PDFParse } from "pdf-parse";
import Resume from "../models/resume.model";
import * as resumeServices from "../services/resumeAnalyzer.service"

export const uploadResume = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return
    }

    const dataBuffer = req.file.buffer;

    const parser = new PDFParse({ data: dataBuffer });

    const pdfData = await parser.getText();
    const resumeText = pdfData.text;

    await parser.destroy();
    const savedResume = await Resume.create({
      fileName: req.file.originalname,
      text: resumeText
    });

    res.status(200).json({
      message: "Resume uploaded and parsed successfully",
      resumeId: savedResume._id,
      preview: resumeText.substring(0, 500),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const analyzeResume = async (req: Request, res: Response) => {
  try {
    const { resumeId } = req.body;

    if (!resumeId) {
      res.status(400).json({ message: "resumeId is required" })
      return
    }
    const resume = await Resume.findById(resumeId)

    if (!resume) {
      res.status(400).json({ message: "Resume not found" })
      return
    }

    const analysis = resumeServices.analyzeResume(resume.text);

    resume.score = analysis.score;
    resume.strengths = analysis.strengths;
    resume.weaknesses = analysis.weaknesses;
    resume.suggestions = analysis.suggestions;

    await resume.save()

    res.status(200).json({
      message: "Resume analyzed successfully",
      score: analysis.score,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      suggestions: analysis.suggestions
    });

  } catch (error) {
    console.error("error:", error);
    res.status(500).json({ message: "Internal server error" })
  }
}

export const analyzeResumeUsingAi = async (req: Request, res: Response) => {
  try {

    const { resumeId } = req.params;

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      res.status(404).json({ message: "Resume not found" });
      return
    }

    let aiResult: string;
    try {
      aiResult = await resumeServices.analyzeWithAI(resume.text);
    } catch (apiError: unknown) {
      const err = apiError as { status?: number };
      if (err?.status === 429) {
        const analysis = resumeServices.analyzeResume(resume.text);
        resume.score = analysis.score;
        resume.strengths = analysis.strengths;
        resume.weaknesses = analysis.weaknesses;
        resume.suggestions = analysis.suggestions;
        await resume.save();
        return res.json({
          message: "AI analysis is temporarily unavailable (API quota exceeded). Showing rule-based analysis. Check your plan at https://ai.google.dev/gemini-api/docs/rate-limits",
          data: resume,
          fallback: true
        });
      }
      throw apiError;
    }

    // Strip markdown code fence if present (e.g. ```json ... ```)
    let jsonStr = aiResult.trim();
    jsonStr = jsonStr.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();

    const analysis = JSON.parse(jsonStr);

    resume.score = analysis.score;
    resume.strengths = analysis.strengths;
    resume.weaknesses = analysis.weaknesses;
    resume.suggestions = analysis.suggestions;

    await resume.save();

    res.json({
      message: "Resume analyzed successfully",
      data: resume
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};