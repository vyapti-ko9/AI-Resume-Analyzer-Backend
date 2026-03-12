const skillsDatabase = [
  "javascript",
  "typescript",
  "react",
  "node",
  "express",
  "mongodb",
  "mysql",
  "python",
  "java",
  "docker",
  "aws",
  "git"
];

export const analyzeResume = (resumeText: string) => {

  const text = resumeText.toLowerCase();

  const foundSkills = skillsDatabase.filter(skill =>
    text.includes(skill)
  );

  const strengths = foundSkills;

  const missingSkills = skillsDatabase.filter(
    skill => !foundSkills.includes(skill)
  );

  const weaknesses = missingSkills.slice(0, 3);

  const suggestions = [
    "Add measurable achievements in projects",
    "Mention backend API experience",
    "Include more industry tools"
  ];

  const score = Math.min(100, foundSkills.length * 10);

  return {
    score,
    strengths,
    weaknesses,
    suggestions
  };
};
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const analyzeWithAI = async (resumeText: string) => {

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });

  const prompt = `
You are an ATS resume analyzer.

Analyze this resume and return ONLY JSON with:

{
 "score": number,
 "strengths": [],
 "weaknesses": [],
 "suggestions": []
}

Resume:
${resumeText}
`;

  const result = await model.generateContent(prompt);

  const response = result.response.text();

  return response;
};