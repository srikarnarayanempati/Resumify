
'use server';
/**
 * @fileOverview A Genkit flow for analyzing resumes using the Groq SDK.
 *
 * - analyzeResume - A function that handles the resume analysis process via Groq.
 * - AnalyzeResumeInput - The input type for the analyzeResume function.
 * - AnalyzeResumeOutput - The return type for the analyzeResume function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import Groq from 'groq-sdk';

const AnalyzeResumeInputSchema = z.object({
  resumeText: z.string().describe('The raw text extracted from the user\'s resume.'),
});
export type AnalyzeResumeInput = z.infer<typeof AnalyzeResumeInputSchema>;

const AnalyzeResumeOutputSchema = z.object({
  ats_score: z.number().int().min(0).max(100).describe('An ATS compatibility score out of 100.'),
  summary: z.string().describe('A concise summary of the resume\'s overall quality and potential.'),
  strengths: z.array(z.string()).describe('A list of key strengths identified in the resume.'),
  weaknesses: z.array(z.string()).describe('A list of areas where the resume could be improved.'),
  missing_skills: z.array(z.string()).describe('A list of skills that are commonly sought after in relevant industries but are not present or emphasized in the resume.'),
  grammar_issues: z.array(z.string()).describe('A list of grammatical errors, typos, or awkward phrasing found in the resume.'),
  improvements: z.array(z.string()).describe('Actionable suggestions for improving the resume\'s content and structure.'),
  job_matches: z.array(z.string()).describe('Suggestions for types of job roles or industries that align well with the resume\'s content.'),
  detected_sections: z.array(z.string()).describe('A list of common resume sections detected in the document (e.g., Skills, Experience, Education, Projects, Certifications).'),
  keyword_analysis: z.object({
    present_keywords: z.array(z.string()).describe('A list of industry-relevant keywords successfully identified in the resume.'),
    missing_keywords: z.array(z.string()).describe('A list of important industry keywords that are absent from the resume.'),
  }).describe('Detailed analysis of keyword optimization within the resume.'),
});
export type AnalyzeResumeOutput = z.infer<typeof AnalyzeResumeOutputSchema>;

export async function analyzeResume(input: AnalyzeResumeInput): Promise<AnalyzeResumeOutput> {
  return analyzeResumeFlow(input);
}

const analyzeResumeFlow = ai.defineFlow(
  {
    name: 'analyzeResumeFlow',
    inputSchema: AnalyzeResumeInputSchema,
    outputSchema: AnalyzeResumeOutputSchema,
  },
  async (input) => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey === 'your_groq_api_key_here') {
      throw new Error('GROQ_API_KEY is not configured in the server environment. Please add your key to the .env file.');
    }

    const groq = new Groq({ apiKey });

    const systemPrompt = `You are an expert ATS system and HR recruiter. 
    Analyze the provided resume text and return a detailed report in JSON format.
    
    The JSON must follow this structure exactly:
    {
      "ats_score": number (0-100),
      "summary": "string",
      "strengths": ["string"],
      "weaknesses": ["string"],
      "missing_skills": ["string"],
      "grammar_issues": ["string"],
      "improvements": ["string"],
      "job_matches": ["string"],
      "detected_sections": ["string"],
      "keyword_analysis": {
        "present_keywords": ["string"],
        "missing_keywords": ["string"]
      }
    }
    
    Ensure all arrays have at least 2-3 items if applicable. Be critical and professional. Use markdown formatting for the summary if needed.`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analyze this resume text:\n\n${input.resumeText}` }
      ],
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Groq returned an empty response.');
    }

    try {
      const parsed = JSON.parse(content);
      return AnalyzeResumeOutputSchema.parse(parsed);
    } catch (e: any) {
      console.error('Validation or Parsing Error:', e);
      throw new Error(`Failed to process analysis: ${e.message}`);
    }
  }
);
