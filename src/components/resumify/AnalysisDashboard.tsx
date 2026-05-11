
"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Target, 
  Layers, 
  Cpu, 
  BookOpen,
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import type { AnalyzeResumeOutput } from '@/ai/flows/analyze-resume-flow';

export function AnalysisDashboard({ data }: { data: AnalyzeResumeOutput }) {
  if (!data) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-primary';
    return 'text-orange-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-500/10';
    if (score >= 60) return 'bg-primary/10';
    return 'bg-orange-500/10';
  };

  const scoreColor = getScoreColor(data.ats_score);

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Score & Summary Card */}
        <Card className="lg:col-span-4 glass border-white/5 overflow-hidden flex flex-col p-8 relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp className="w-24 h-24" />
          </div>
          
          <div className="relative z-10 space-y-8">
            <div className="flex flex-col items-center text-center">
              <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-white/5"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={552.92}
                    strokeDashoffset={552.92 * (1 - (data.ats_score || 0) / 100)}
                    className={`${scoreColor} transition-all duration-1000 ease-out`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-6xl font-bold font-headline ${scoreColor}`}>{data.ats_score}</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">ATS Score</span>
                </div>
              </div>
              
              <Badge variant="outline" className={`${getScoreBg(data.ats_score)} ${scoreColor} border-none uppercase text-[10px] tracking-[0.2em] px-4 py-1 mb-4`}>
                {data.ats_score >= 80 ? 'Optimized' : data.ats_score >= 60 ? 'Competitive' : 'Needs Work'}
              </Badge>
              
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                "{data.summary}"
              </p>
            </div>
          </div>
        </Card>

        {/* Actionable Insights Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InsightCard 
            title="Strengths" 
            items={data.strengths} 
            icon={<CheckCircle2 className="h-4 w-4" />} 
            color="text-emerald-400" 
            borderColor="border-l-emerald-500/20"
          />
          <InsightCard 
            title="Critical Gaps" 
            items={data.weaknesses} 
            icon={<AlertTriangle className="h-4 w-4" />} 
            color="text-orange-400" 
            borderColor="border-l-orange-500/20"
          />
          <InsightCard 
            title="Action Items" 
            items={data.improvements} 
            icon={<BookOpen className="h-4 w-4" />} 
            color="text-accent" 
            borderColor="border-l-accent/20"
          />
          <Card className="glass border-white/5 border-l-primary/20 border-l-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                <Target className="h-4 w-4" /> Recommended Roles
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2 pt-2">
              {(data.job_matches || []).map((role, i) => (
                <Badge key={i} variant="outline" className="bg-primary/5 text-[10px] border-primary/10 rounded-lg py-1 hover:bg-primary/10 transition-colors cursor-default">
                  {role}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Skills Analysis Section */}
      <Card className="glass border-white/5">
        <CardHeader className="border-b border-white/5 bg-white/[0.02]">
          <CardTitle className="text-lg flex items-center gap-2 font-headline">
            <Cpu className="h-5 w-5 text-primary" /> Technical Profile Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-12 p-8">
          <div>
            <h4 className="text-sm font-bold mb-6 flex items-center justify-between text-emerald-400">
              <span className="flex items-center gap-2">Detected Keywords</span>
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-none px-2 rounded-md">{data.keyword_analysis?.present_keywords?.length || 0}</Badge>
            </h4>
            <div className="flex flex-wrap gap-2">
              {(data.keyword_analysis?.present_keywords || []).map((k, i) => (
                <div key={i} className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/5 text-[11px] font-medium text-foreground/80">
                  {k}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold mb-6 flex items-center justify-between text-red-400">
              <span className="flex items-center gap-2">Missing High-Impact Skills</span>
              <Badge variant="secondary" className="bg-red-500/10 text-red-400 border-none px-2 rounded-md">{data.missing_skills?.length || 0}</Badge>
            </h4>
            <div className="flex flex-wrap gap-2">
              {(data.missing_skills || []).map((k, i) => (
                <div key={i} className="px-3 py-1.5 bg-red-500/5 rounded-lg border border-red-500/10 text-[11px] font-medium text-red-400/90">
                  {k}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Structural Analysis Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass border-white/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 font-headline">
              <Layers className="h-5 w-5 text-accent" /> Structural Health
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3 pb-8">
            {(data.detected_sections || []).map((section, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-foreground/80">{section}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass border-white/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 font-headline">
              <FileText className="h-5 w-5 text-orange-400" /> Grammar & Formatting
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.grammar_issues?.length > 0 ? (
              <ul className="space-y-3">
                {data.grammar_issues.map((issue, i) => (
                  <li key={i} className="text-xs flex gap-3 text-muted-foreground bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-orange-400 flex-shrink-0">•</span> {issue}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-2">
                <CheckCircle2 className="h-8 w-8 text-emerald-400 opacity-50" />
                <p className="text-sm text-muted-foreground">No major grammatical issues detected.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InsightCard({ title, items, icon, color, borderColor }: { title: string, items: string[], icon: React.ReactNode, color: string, borderColor: string }) {
  return (
    <Card className={`glass border-white/5 ${borderColor} border-l-4`}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-sm font-bold flex items-center gap-2 ${color}`}>
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {(items || []).slice(0, 4).map((s, i) => (
            <li key={i} className="text-xs flex gap-3 text-foreground/80 leading-relaxed group">
              <span className={`${color} mt-0.5 opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0`}>
                <ArrowRight className="h-3 w-3" />
              </span> 
              {s}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
