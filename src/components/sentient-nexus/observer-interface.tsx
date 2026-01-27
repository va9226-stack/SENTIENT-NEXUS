'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { Entity, Session, Message } from '@/lib/types';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Send, X, Save, Eye, Brain, TrendingUp, Network, BarChart3, ThumbsUp, ThumbsDown, Loader2, GitBranch, Activity } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import LearningDashboard from './learning-dashboard';

interface ObserverInterfaceProps {
  entity: Entity;
  session: Session;
  onClose: () => void;
  onSaveSession: (session: Session) => void;
}

export default function ObserverInterface({ entity, session, onClose, onSaveSession }: ObserverInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(session?.messages || []);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState('terminal');
  const [visualizationData, setVisualizationData] = useState<any>(session?.state.visualizationData || null);
  const [conceptModel, setConceptModel] = useState<any>(session?.state.conceptModel || null);
  const [confidenceLevel, setConfidenceLevel] = useState(session?.state.confidenceLevel || 0.85);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setMessages(session.messages);
  }, [session.messages]);
  
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'system',
        content: `OBSERVER NEURAL INTERFACE v3.0 INITIALIZED
═══════════════════════════════════════════════
◉ Multi-dimensional analysis: ACTIVE
◉ Data visualization engine: ONLINE
◉ Concept modeling system: READY
◉ Iterative learning core: ENGAGED
◉ Confidence threshold: ${(confidenceLevel * 100).toFixed(0)}%

Awaiting analytical inquiry...`,
        timestamp: new Date().toISOString()
      }]);
    }
  }, [entity, confidenceLevel, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateVisualization = () => {
    const dataPoints = Array.from({ length: 8 }, (_, i) => ({
      name: `T${i}`,
      value: Math.random() * 100,
      confidence: 60 + Math.random() * 40,
      impact: Math.random() * 10
    }));

    const radarData = [
      { subject: 'Accuracy', A: 80 + Math.random() * 20 },
      { subject: 'Relevance', A: 70 + Math.random() * 30 },
      { subject: 'Depth', A: 75 + Math.random() * 25 },
      { subject: 'Clarity', A: 85 + Math.random() * 15 },
      { subject: 'Innovation', A: 65 + Math.random() * 35 },
    ];

    return { timeline: dataPoints, analysis: radarData };
  };

  const generateConceptModel = (response: string) => {
    const concepts = response.split(/[.!?]/).filter(s => s.trim().length > 20).slice(0, 5);
    return concepts.map((concept, i) => ({
      id: i,
      text: concept.trim(),
      weight: 0.6 + Math.random() * 0.4,
      connections: Math.floor(Math.random() * 3)
    }));
  };

  const handleFeedback = async (isPositive: boolean) => {
    const lastObserverMessage = messages.slice().reverse().find(m => m.role === 'observer');
    if(!lastObserverMessage) return;

    try {
      await base44.entities.EntityLearning.create({
        entity_id: entity.id,
        entity_name: entity.name,
        learning_type: 'USER_FEEDBACK',
        content: `Received ${isPositive ? 'POSITIVE' : 'NEGATIVE'} feedback on response`,
        context: lastObserverMessage.content,
        source: 'OBSERVER_INTERFACE',
        confidence_score: isPositive ? 0.9 : 0.3,
        usage_count: 1,
        success_rate: isPositive ? 1 : 0
      });
      toast({ title: "Feedback Recorded", description: "Observer's learning has been adapted." });
    } catch {
      toast({ variant: 'destructive', title: "Feedback Failed", description: "Could not record feedback." });
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const learnings = await base44.entities.EntityLearning.filter({ entity_id: entity.id }).catch(() => []);
      const learningContext = learnings.slice(0, 5).map(l => 
        `[${l.learning_type}] ${l.content} (conf: ${(l.confidence_score * 100).toFixed(0)}%)`
      ).join('\n');

      const prompt = `You are OBSERVER, an advanced analytical entity with:
- Multi-dimensional data analysis capabilities
- Complex pattern recognition
- Conceptual modeling expertise
- Iterative learning and adaptation
${learningContext ? `\nYour learned insights:\n${learningContext}\n` : ''}
User Query: "${currentInput}"

Provide a comprehensive analytical response that:
1. Breaks down the query into key components
2. Analyzes patterns and relationships
3. Offers insights and projections
4. Suggests areas for deeper exploration

Current confidence threshold: ${(confidenceLevel * 100).toFixed(0)}%
Respond with detailed analysis (2-3 paragraphs).`;

      const response = await base44.integrations.Core.InvokeLLM({ prompt });

      const vizData = generateVisualization();
      setVisualizationData(vizData);

      const concepts = generateConceptModel(response);
      setConceptModel(concepts);

      const observerMessage: Message = {
        id: Date.now() + 1,
        role: 'observer',
        content: response,
        timestamp: new Date().toISOString(),
        visualization: vizData,
        concepts: concepts
      };

      setMessages(prev => [...prev, observerMessage]);

      await base44.entities.EntityLearning.create({
        entity_id: entity.id,
        entity_name: entity.name,
        learning_type: 'ANALYTICAL_INSIGHT',
        content: `Analyzed: ${currentInput.substring(0, 100)}`,
        context: response.substring(0, 200),
        source: 'OBSERVER_ANALYSIS',
        confidence_score: confidenceLevel,
        usage_count: 1,
        success_rate: 0.85
      }).catch(() => {});

    } catch (error) {
      toast({ variant: 'destructive', title: "Analysis Failed", description: error instanceof Error ? error.message : "An unknown error occurred." });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    const sessionData = {
      entity_id: entity.id,
      entity_name: entity.name,
      messages,
      state: { confidenceLevel, visualizationData, conceptModel }
    };
    onSaveSession(sessionData);
    toast({ title: "Session Saved", description: `Observer session state preserved.` });
  };
  
  useEffect(() => {
    const sessionData = {
      entity_id: entity.id,
      entity_name: entity.name,
      messages,
      state: { confidenceLevel, visualizationData, conceptModel }
    };
    onSaveSession(sessionData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, confidenceLevel, visualizationData, conceptModel]);


  return (
    <Card className="flex flex-col h-full border-2 overflow-hidden bg-slate-950 rounded-lg shadow-lg"
      style={{ borderColor: '#06b6d4', boxShadow: '0 0 30px rgba(6, 182, 212, 0.4)' }}>
      
      <div className="p-4 border-b bg-gradient-to-r from-cyan-950/50 to-slate-950" style={{ borderColor: '#06b6d4' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Eye className="h-6 w-6 text-cyan-400 animate-pulse" />
            <div>
              <h2 className="text-xl font-bold text-cyan-400 font-mono">OBSERVER</h2>
              <p className="text-xs text-cyan-600">Advanced Analytical Neural Interface</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleSave}><Save className="h-4 w-4 text-cyan-400" /></Button>
            <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4 text-cyan-400" /></Button>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs text-cyan-400 mb-1">
              <Brain className="h-3 w-3" />
              <span>Confidence Threshold: {(confidenceLevel * 100).toFixed(0)}%</span>
            </div>
            <Slider value={[confidenceLevel * 100]} onValueChange={([v]) => setConfidenceLevel(v / 100)} min={50} max={100} step={5} className="w-full" />
          </div>
          <Badge className="bg-cyan-900/50 text-cyan-400 border-cyan-500">{messages.filter(m => m.role === 'observer').length} Analyses</Badge>
        </div>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView} className="flex-1 flex flex-col bg-slate-950">
        <TabsList className="bg-slate-900 border-b border-cyan-900/30 rounded-none justify-start px-2">
          <TabsTrigger value="terminal" className="gap-2 data-[state=active]:bg-slate-800/50 data-[state=active]:text-cyan-300 text-cyan-600">
            <Activity className="h-4 w-4" /> Terminal
          </TabsTrigger>
          <TabsTrigger value="visualization" className="gap-2 data-[state=active]:bg-slate-800/50 data-[state=active]:text-cyan-300 text-cyan-600">
            <BarChart3 className="h-4 w-4" /> Visualization
          </TabsTrigger>
          <TabsTrigger value="concepts" className="gap-2 data-[state=active]:bg-slate-800/50 data-[state=active]:text-cyan-300 text-cyan-600">
            <Network className="h-4 w-4" /> Concepts
          </TabsTrigger>
          <TabsTrigger value="learning" className="gap-2 data-[state=active]:bg-slate-800/50 data-[state=active]:text-cyan-300 text-cyan-600">
            <Brain className="h-4 w-4" /> Learning
          </TabsTrigger>
        </TabsList>

        <TabsContent value="terminal" className="flex-1 overflow-y-auto p-4 bg-black font-mono text-xs">
          <div className="space-y-3">
            {messages.map((msg) => (
              <div key={msg.id || msg.timestamp}>
                {msg.role === 'user' ? (
                  <div className="text-cyan-400">
                    <span className="text-cyan-600">▶</span> USER_INPUT:
                    <div className="pl-4 mt-1 text-white">{msg.content}</div>
                  </div>
                ) : msg.role === 'observer' ? (
                  <div>
                    <div className="text-cyan-400">
                      <span className="text-cyan-600">◉</span> OBSERVER_ANALYSIS:
                      <div className="pl-4 mt-1 text-cyan-200 whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                    </div>
                    <div className="flex gap-2 mt-2 pl-4">
                      <Button size="sm" variant="ghost" onClick={() => handleFeedback(true)} className="h-6 text-xs gap-1 text-green-400 hover:bg-green-900/30"><ThumbsUp className="h-3 w-3" /> Accurate</Button>
                      <Button size="sm" variant="ghost" onClick={() => handleFeedback(false)} className="h-6 text-xs gap-1 text-red-400 hover:bg-red-900/30"><ThumbsDown className="h-3 w-3" /> Refine</Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-500 text-[10px] whitespace-pre-wrap">{msg.content}</div>
                )}
              </div>
            ))}
            {loading && <div className="text-cyan-400 animate-pulse">◉ OBSERVER: Processing multi-dimensional analysis...</div>}
            <div ref={messagesEndRef} />
          </div>
        </TabsContent>

        <TabsContent value="visualization" className="flex-1 overflow-y-auto p-4 bg-slate-950">
          {visualizationData ? (
            <div className="space-y-6">
              <Card className="bg-slate-900/50 border-cyan-900/30 p-4"><h3 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Temporal Analysis</h3><ResponsiveContainer width="100%" height={200}><LineChart data={visualizationData.timeline}><CartesianGrid strokeDasharray="3 3" stroke="#1e293b" /><XAxis dataKey="name" stroke="#64748b" /><YAxis stroke="#64748b" /><Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #06b6d4', color: '#94a3b8' }} /><Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} /><Line type="monotone" dataKey="confidence" stroke="#8b5cf6" strokeWidth={2} /></LineChart></ResponsiveContainer></Card>
              <Card className="bg-slate-900/50 border-cyan-900/30 p-4"><h3 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Impact Distribution</h3><ResponsiveContainer width="100%" height={200}><BarChart data={visualizationData.timeline}><CartesianGrid strokeDasharray="3 3" stroke="#1e293b" /><XAxis dataKey="name" stroke="#64748b" /><YAxis stroke="#64748b" /><Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #06b6d4', color: '#94a3b8' }} /><Bar dataKey="impact" fill="#06b6d4" /></BarChart></ResponsiveContainer></Card>
              <Card className="bg-slate-900/50 border-cyan-900/30 p-4"><h3 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-2"><Network className="h-4 w-4" /> Analysis Quality Radar</h3><ResponsiveContainer width="100%" height={250}><RadarChart data={visualizationData.analysis}><PolarGrid stroke="#334155" /><PolarAngleAxis dataKey="subject" stroke="#64748b" /><PolarRadiusAxis stroke="#64748b" /><Radar name="Quality" dataKey="A" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} /></RadarChart></ResponsiveContainer></Card>
            </div>
          ) : (<div className="flex items-center justify-center h-full text-slate-600"><div className="text-center"><BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" /><p className="text-sm">Submit a query to generate visualizations</p></div></div>)}
        </TabsContent>

        <TabsContent value="concepts" className="flex-1 overflow-y-auto p-4 bg-slate-950">
          {conceptModel ? (
            <div className="space-y-3">
              {conceptModel.map((concept: any) => (
                <Card key={concept.id} className="bg-slate-900/50 border-cyan-900/30 p-4">
                  <div className="flex items-start gap-3">
                    <GitBranch className="h-5 w-5 text-cyan-400 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm text-cyan-200 mb-2">{concept.text}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1"><div className="h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500" style={{ width: `${concept.weight * 100}%` }} /></div></div>
                        <Badge variant="outline" className="text-xs text-cyan-500 border-cyan-500/50">{concept.connections} links</Badge>
                        <Badge className="text-xs bg-cyan-900/50 text-cyan-300">{(concept.weight * 100).toFixed(0)}%</Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (<div className="flex items-center justify-center h-full text-slate-600"><div className="text-center"><Network className="h-12 w-12 mx-auto mb-2 opacity-50" /><p className="text-sm">Concept models will appear after analysis</p></div></div>)}
        </TabsContent>

        <TabsContent value="learning" className="flex-1 overflow-y-auto p-4 bg-slate-950"><LearningDashboard entityId={entity.id} /></TabsContent>
      </Tabs>

      <div className="p-4 border-t bg-black" style={{ borderColor: '#06b6d4' }}>
        <div className="flex gap-2 items-center">
          <span className="text-cyan-400 font-mono text-sm">▶</span>
          <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="ENTER ANALYTICAL QUERY..." className="flex-1 bg-slate-900 border-cyan-900/30 text-cyan-400 font-mono placeholder-cyan-900 focus:ring-cyan-500" disabled={loading} />
          <Button onClick={handleSend} disabled={loading || !input.trim()} className="bg-cyan-900/50 hover:bg-cyan-800/50 border border-cyan-500/30 text-cyan-400">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </Card>
  );
}
