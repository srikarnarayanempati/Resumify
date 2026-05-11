
"use server";

import { analyzeResume } from '@/ai/flows/analyze-resume-flow';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';

export async function analyzeResumeAction(fileBase64: string, fileName: string, fileType: string) {
  try {
    const buffer = Buffer.from(fileBase64.split(',')[1], 'base64');
    let extractedText = '';

    if (fileType === 'application/pdf') {
      const data = await pdf(buffer);
      extractedText = data.text;
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else if (fileType === 'text/plain') {
      extractedText = buffer.toString('utf-8');
    } else {
      throw new Error('Unsupported file type. Please upload a PDF, DOCX, or TXT file.');
    }

    if (!extractedText || extractedText.trim().length < 50) {
      throw new Error('The document seems to be empty or contains too little text to analyze.');
    }

    const result = await analyzeResume({ resumeText: extractedText });
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Analysis Error:', error);
    
    let userMessage = error.message || 'The AI model failed to process the resume.';
    
    if (userMessage.includes('401') || userMessage.includes('invalid_api_key')) {
      userMessage = 'Invalid Groq API Key. Please ensure GROQ_API_KEY is set in your .env file.';
    } else if (userMessage.includes('429') || userMessage.includes('rate_limit')) {
      userMessage = 'Groq API rate limit exceeded. Please try again in a moment.';
    } else if (userMessage.includes('503')) {
      userMessage = 'The AI service is currently overloaded. Please try again in a few seconds.';
    }

    return { 
      success: false, 
      error: userMessage
    };
  }
}
