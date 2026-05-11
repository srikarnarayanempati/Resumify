
"use client";

import React, { useState } from 'react';
import { UploadContainer } from '@/components/resumify/UploadContainer';
import { AnalysisDashboard } from '@/components/resumify/AnalysisDashboard';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import type { AnalyzeResumeOutput } from '@/ai/flows/analyze-resume-flow';

export default function Home() {
  const [results, setResults] = useState<AnalyzeResumeOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleReset = () => {
    setResults(null);
    setIsAnalyzing(false);
  };

  if (results) {
    return (
      <main className="min-h-screen bg-background relative overflow-x-hidden">
        {/* Decorative Background Elements */}
        <div className="fixed inset-0 pointer-events-none opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 animate-fade-in-up">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="font-brush text-4xl md:text-5xl text-gradient">Resumify</h1>
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground bg-white/5 px-2 py-1 rounded">Report v1.0</span>
              </div>
              <p className="text-muted-foreground flex items-center gap-2">
                Comprehensive AI Analysis for your professional profile
              </p>
            </div>
            
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleReset} 
              className="group rounded-2xl border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all"
            >
              <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Analyze New Resume
            </Button>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <AnalysisDashboard data={results} />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col md:flex-row items-center justify-center p-6 md:p-12 lg:p-24 gap-12 overflow-hidden bg-background">
      {/* Left Side: Branding */}
      <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-6 animate-fade-in-up">
        <h1 className="font-brush text-7xl md:text-8xl lg:text-9xl text-gradient leading-tight select-none">
          Resumify
        </h1>
        <div className="space-y-4 max-w-xl">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground/90 font-headline">
            AI-Powered Resume Analyzer
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Analyze your resume with Groq's lightning-fast AI and improve ATS performance instantly. Identify missing skills and land your dream job with ease.
          </p>
        </div>
        
        <div className="flex items-center gap-6 pt-8 text-sm text-muted-foreground/60">
          <div className="flex flex-col items-center md:items-start">
            <span className="font-bold text-foreground">100+</span>
            <span>ATS Factors</span>
          </div>
          <div className="h-8 w-px bg-border"></div>
          <div className="flex flex-col items-center md:items-start">
            <span className="font-bold text-foreground">Llama-3</span>
            <span>Ultra-Fast</span>
          </div>
          <div className="h-8 w-px bg-border"></div>
          <div className="flex flex-col items-center md:items-start">
            <span className="font-bold text-foreground">Secure</span>
            <span>Privacy First</span>
          </div>
        </div>
      </div>

      {/* Right Side: Upload Card */}
      <div className="flex-1 w-full max-w-md animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <UploadContainer onAnalysisComplete={setResults} />
      </div>
    </main>
  );
}
