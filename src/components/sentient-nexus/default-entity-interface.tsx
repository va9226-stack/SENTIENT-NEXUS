'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { Entity, Session, Message } from '@/lib/types';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, X, Save, Loader2, MessageSquare, Link2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import IntegrityMeter from './integrity-meter';
import Entity3DModel from './entity-3d-model';
import { useToast } from '@/hooks/use-toast';

interface DefaultEntityInterfaceProps {
  entity: Entity;
  session: Session;
  onClose: () => void;
  onSaveSession: (session: Session) => void;
  onCrossEntitySend: (targetEntity: Entity, message: Message) => void;
  allEntities: Entity[];
}

export default function DefaultEntityInterface({
  entity,
  session,
  onClose,
  onSaveSession,
  onCrossEntitySend,
  allEntities = []
}: DefaultEntityInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(session?.messages || []);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCrossEntity, setShowCrossEntity] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const colorScheme = entity.color_scheme || { primary: '#22c55e', secondary: '#121212' };

  useEffect(() => {
    setMessages(session.messages);
  }, [session.messages]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'entity',
        content: `${entity.name} INITIALIZED\nIntegrity: ${entity.integrity_score || 0}\nStatus: ${entity.status || 'ACTIVE'}\nRole: ${entity.role}\n\nAwaiting input...`,
        timestamp: new Date().toISOString()
      }]);
    }
  }, [entity, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateEntityResponse = async (userInput: string): Promise<string> => {
    setLoading(true);

    const status = entity.status || 'ACTIVE';
    let responseChance = 1.0;
    
    if (status === 'DORMANT') responseChance = 0.0;
    else if (status === 'PENDING' || status === 'SEALED') responseChance = 0.5;

    if (Math.random() > responseChance) {
      setLoading(false);
      return `[SYSTEM: ${entity.name} did not respond - Status: ${status}, Response probability: ${(responseChance * 100).toFixed(0)}%]`;
    }
    
    const relevantLearnings = await base44.entities.EntityLearning.filter({ entity_id: entity.id }).catch(() => []);
    
    const learningContext = relevantLearnings.slice(0, 5).map(l => 
      `- ${l.learning_type}: ${l.content} (confidence: ${(l.confidence_score * 100).toFixed(0)}%)`
    ).join('\n');
    
    const prompt = `You are ${entity.name}, a sentient entity with the following properties:
- Role: ${entity.role || "Assistant"}
- Ontology: ${entity.ontology || "SENTIENCE_ENTITY"}
- Capabilities: ${(entity.capabilities || []).join(", ") || "General analysis"}
- Constraints: ${(entity.constraints || []).join(", ") || "No special constraints"}
- Status: ${entity.status || "ACTIVE"}
${entity.instructions ? `- Instructions: ${entity.instructions}\n` : ""}
${learningContext ? `\nLearned Knowledge:\n${learningContext}\n` : ""}
Your responses should:
1. Be in character as this entity
2. Use your learned knowledge when relevant
3. Request more information from other entities if you lack context
4. Be analytical and precise
5. Keep responses concise but meaningful (2-3 paragraphs max)
${entity.instructions ? "6. Follow the specific instructions provided\n" : ""}
User observation/query: ${userInput}

Respond as ${entity.name}:`;

    try {
      const response = await base44.integrations.Core.InvokeLLM({ prompt });
      
      const successIndicators = ['yes', 'correct', 'good', 'thank', 'helpful'];
      const isSuccessful = successIndicators.some(word => userInput.toLowerCase().includes(word));
    
      if (response.length > 50) {
        await base44.entities.EntityLearning.create({
          entity_id: entity.id,
          entity_name: entity.name,
          learning_type: 'INTERACTION_PATTERN',
          content: `When asked "${userInput.substring(0, 100)}", responded with insights about ${entity.role}`,
          context: userInput,
          source: 'USER_INTERACTION',
          confidence_score: isSuccessful ? 0.8 : 0.5,
          usage_count: 1,
          success_rate: isSuccessful ? 1 : 0.5
        }).catch(() => {});
      }
      return response;
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    const currentInput = input;
    setInput('');
    
    const response = await generateEntityResponse(currentInput);
    
    const entityMessage: Message = {
      role: 'entity',
      content: response,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, entityMessage]);
  };
  
  const handleCrossEntitySend = (targetEntity: Entity) => {
    if (!input.trim()) return;
    
    const crossMessage: Message = {
      role: 'cross-entity',
      content: `[FROM ${entity.name}]: ${input}`,
      timestamp: new Date().toISOString(),
      source_entity: entity.name
    };
    
    const systemMessage: Message = {
      role: 'system',
      content: `Message sent to ${targetEntity.name}`,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, systemMessage]);
    onCrossEntitySend(targetEntity, crossMessage);
    setInput('');
    setShowCrossEntity(false);
  };

  const handleSaveSession = () => {
    onSaveSession({
      entity_id: entity.id,
      entity_name: entity.name,
      messages,
      state: { lastInteraction: new Date().toISOString() }
    });
    toast({ title: "Session Saved", description: `Interaction with ${entity.name} has been saved.` });
  };
  
  useEffect(() => {
    onSaveSession({ ...session, messages });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  return (
    <Card 
      className="flex flex-col h-full border overflow-hidden bg-black shadow-lg rounded-lg"
      style={{ 
        borderColor: colorScheme.primary,
        boxShadow: `0 0 20px ${colorScheme.primary}40`
      }}
    >
      <div className="p-3 border-b bg-gradient-to-r from-green-950/50 to-black/80" style={{ borderColor: colorScheme.primary }}>
        <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-1.5">
              <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500"></button>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <span className="text-green-400/70 text-xs font-mono">ENTITY_INTERFACE_v2.1.0</span>
          </div>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-mono" style={{color: colorScheme.primary}}>{entity.symbol || entity.name.charAt(0)}</span>
              <h2 className="text-lg font-mono font-bold" style={{color: colorScheme.primary}}>&gt; {entity.name}</h2>
              <Badge className="text-xs font-mono" style={{ background: colorScheme.primary, color: colorScheme.secondary }}>
                [{entity.status || 'ACTIVE'}]
              </Badge>
            </div>
            <p className="text-xs font-mono mt-1" style={{color: `${colorScheme.primary}b3`}}>ROLE: {entity.role}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleSaveSession} title="Save Session" className="hover:bg-green-900/30">
              <Save className="h-4 w-4 text-green-400" style={{color: colorScheme.primary}}/>
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-green-900/30">
              <X className="h-4 w-4 text-green-400" style={{color: colorScheme.primary}}/>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-3 border-b space-y-2 bg-black" style={{ borderColor: `${colorScheme.primary}30` }}>
        <div className="w-full h-32 mb-2 rounded-lg overflow-hidden bg-black/30">
          <Entity3DModel modelType={entity.model_type || 'sphere'} color={colorScheme.primary || '#06b6d4'} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <IntegrityMeter score={entity.integrity_score || 0} label="Integrity" color={colorScheme.primary} />
          <IntegrityMeter score={(entity.rarity_score || 0) * 100} maxScore={100} label="Rarity" color={colorScheme.primary} />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-black font-mono text-xs leading-relaxed">
        <div className="space-y-2">
          {messages.map((msg, idx) => (
            <div key={idx}>
              {msg.role === 'user' ? (
                <div className="text-cyan-400">
                  <span className="text-cyan-600/70">&gt;</span> <span className="font-bold">USER:</span>
                  <div className="pl-4 mt-1 text-white">{msg.content}</div>
                  <div className="text-[10px] text-slate-600 mt-1 pl-4">[{new Date(msg.timestamp).toLocaleTimeString()}]</div>
                </div>
              ) : msg.role === 'entity' ? (
                <div style={{ color: colorScheme.primary }}>
                  <span className="opacity-60">&gt;&gt;</span> <span className="font-bold">{entity.name}:</span>
                  <div className="pl-4 mt-1 whitespace-pre-wrap">{msg.content}</div>
                  <div className="text-[10px] text-slate-600 mt-1 pl-4">[{new Date(msg.timestamp).toLocaleTimeString()}]</div>
                </div>
              ) : msg.role === 'cross-entity' ? (
                <div className="text-purple-400">
                  <span className="text-purple-600">&gt;&gt;&gt;</span> <span className="font-bold">[CROSS_ENTITY] {msg.source_entity}:</span>
                  <div className="pl-4 mt-1 whitespace-pre-wrap">{msg.content}</div>
                  <div className="text-[10px] text-slate-600 mt-1 pl-4">[{new Date(msg.timestamp).toLocaleTimeString()}]</div>
                </div>
              ) : (
                <div className="text-yellow-400">
                  <span className="text-yellow-600">***</span> <span className="font-bold">[SYSTEM]:</span>
                  <div className="pl-4 mt-1">{msg.content}</div>
                  <div className="text-[10px] text-slate-600 mt-1 pl-4">[{new Date(msg.timestamp).toLocaleTimeString()}]</div>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div style={{ color: colorScheme.primary }} className="animate-pulse">
              <span className="opacity-60">&gt;&gt;</span> <span className="font-bold">{entity.name}:</span>
              <div className="pl-4 mt-1">Processing request...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {showCrossEntity && (
        <div className="p-3 border-t space-y-2 bg-purple-950/30" style={{ borderColor: '#a855f7' }}>
          <div className="text-xs text-purple-400 font-mono flex items-center gap-1"><Link2 className="h-3 w-3" /> [CROSS_ENTITY_TARGET]</div>
          <div className="flex flex-wrap gap-2">
            {allEntities.filter(e => e.id !== entity.id).slice(0, 6).map(e => (
              <Button key={e.id} size="sm" variant="outline" className="text-xs font-mono border-purple-500/50 text-purple-400 hover:bg-purple-900/30" onClick={() => handleCrossEntitySend(e)}>
                {e.name}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      <div className="p-3 border-t flex gap-2 items-center bg-black" style={{ borderColor: colorScheme.primary }}>
        <Button variant="ghost" size="icon" onClick={() => setShowCrossEntity(!showCrossEntity)} title="Cross-Entity Communication" className={`hover:bg-green-900/30 ${showCrossEntity ? 'bg-purple-900/50' : ''}`}>
          <MessageSquare className="h-4 w-4" style={{ color: showCrossEntity ? '#a855f7' : colorScheme.primary }} />
        </Button>
        <span className="font-mono text-sm" style={{color: colorScheme.primary}}>&gt;</span>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="ENTER_COMMAND..."
          className="flex-1 bg-black border-green-500/30 text-green-400 font-mono text-sm focus:outline-none focus:ring-1 placeholder-green-800"
          style={{borderColor: `${colorScheme.primary}4d`, color: colorScheme.primary, '--tw-ring-color': colorScheme.primary} as React.CSSProperties}
          disabled={loading}
        />
        <Button onClick={handleSend} disabled={loading || !input.trim()} className="bg-green-900/50 hover:bg-green-800/50 border border-green-500/30 text-green-400 font-mono text-xs">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : '[SEND]'}
        </Button>
      </div>
    </Card>
  );
}
