
"use client";

import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, X, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { analyzeResumeAction } from '@/app/actions/analyze';
import type { AnalyzeResumeOutput } from '@/ai/flows/analyze-resume-flow';

interface UploadContainerProps {
  onAnalysisComplete: (results: AnalyzeResumeOutput) => void;
}

export function UploadContainer({ onAnalysisComplete }: UploadContainerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) validateAndSetFile(droppedFile);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (file: File) => {
    const validTypes = [
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Please upload a PDF, DOCX, or TXT file.');
      setStatus('error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) { // Increased to 10MB
      setErrorMessage('File size must be less than 10MB.');
      setStatus('error');
      return;
    }
    setFile(file);
    setStatus('idle');
    setErrorMessage('');
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const startAnalysis = async () => {
    if (!file) return;
    setStatus('uploading');
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 90; // Hold at 90 until server responds
        return prev + 15;
      });
    }, 200);

    try {
      const base64 = await readFileAsBase64(file);
      setStatus('analyzing');
      
      const response = await analyzeResumeAction(base64, file.name, file.type);
      
      if (response.success && response.data) {
        setProgress(100);
        setTimeout(() => onAnalysisComplete(response.data!), 500);
      } else {
        setErrorMessage(response.error || 'Analysis failed. The document could not be processed.');
        setStatus('error');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during file reading.');
      setStatus('error');
    } finally {
      clearInterval(interval);
    }
  };

  const reset = () => {
    setFile(null);
    setProgress(0);
    setStatus('idle');
    setErrorMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Card className="glass overflow-hidden border-white/5 relative">
      <CardContent className="p-8 space-y-6">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => status === 'idle' && fileInputRef.current?.click()}
          className={cn(
            "relative group cursor-pointer border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center space-y-4 transition-all duration-300",
            isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-white/10 hover:border-primary/50 hover:bg-white/5",
            (status === 'uploading' || status === 'analyzing') && "pointer-events-none opacity-50 border-primary/20"
          )}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.docx,.txt"
          />
          
          {file ? (
            <div className="flex flex-col items-center space-y-4 animate-in fade-in zoom-in-95">
              <div className="p-5 bg-primary/10 rounded-2xl">
                <FileText className="h-12 w-12 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-foreground max-w-[200px] truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
          ) : (
            <>
              <div className="p-5 bg-white/5 rounded-2xl group-hover:bg-primary/10 transition-colors">
                <Upload className="h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="text-center">
                <p className="text-base font-bold">Drop your resume here</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, DOCX or TXT (Max 10MB)</p>
              </div>
            </>
          )}

          {file && status === 'idle' && (
            <button
              onClick={(e) => { e.stopPropagation(); reset(); }}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {status === 'error' && (
          <div className="flex flex-col gap-3 text-destructive bg-destructive/10 p-5 rounded-3xl text-sm border border-destructive/20 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center gap-2 font-bold uppercase tracking-tighter">
              <AlertCircle className="h-4 w-4" />
              Analysis Error
            </div>
            <p className="opacity-90 leading-relaxed text-xs">{errorMessage}</p>
            <Button variant="ghost" size="sm" onClick={reset} className="text-destructive hover:bg-destructive/10 w-fit h-auto px-0 font-bold uppercase tracking-tighter text-[10px]">
              Dismiss & Try Again
            </Button>
          </div>
        )}

        {(status === 'uploading' || status === 'analyzing') && (
          <div className="space-y-5 py-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
              <span className="flex items-center gap-2 text-primary">
                <Loader2 className="h-3 w-3 animate-spin" />
                {status === 'uploading' ? 'Extracting text...' : 'AI Intelligence Scanning...'}
              </span>
              <span className="text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5 bg-white/5" />
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <p className="text-[10px] text-center text-muted-foreground leading-relaxed">
                We are parsing your professional history. This may take a few moments depending on the file size.
              </p>
            </div>
          </div>
        )}

        {status === 'idle' && (
          <Button
            disabled={!file}
            onClick={startAnalysis}
            className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
          >
            Run Intelligence Report
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
