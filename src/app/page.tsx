'use client';

import React, { useState, useEffect } from 'react';
import { entities } from '@/lib/entities';
import type { Entity, Session, Message } from '@/lib/types';
import EntityCard from '@/components/sentient-nexus/entity-card';
import EntityInterface from '@/components/sentient-nexus/entity-interface';
import { useLocalStorage } from '@/hooks/use-local-storage';

export default function Home() {
  const [activeSessions, setActiveSessions] = useLocalStorage<Session[]>('sentient-nexus-sessions', []);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const openInterface = (entity: Entity) => {
    if (!activeSessions.find(s => s.entity_id === entity.id)) {
      setActiveSessions(prev => [...prev, {
        entity_id: entity.id,
        entity_name: entity.name,
        messages: [],
        state: {}
      }]);
    }
  };

  const closeInterface = (entityId: string) => {
    setActiveSessions(prev => prev.filter(s => s.entity_id !== entityId));
  };

  const saveSession = (session: Session) => {
    setActiveSessions(prev => prev.map(s => s.entity_id === session.entity_id ? session : s));
  };
  
  const handleCrossEntitySend = (targetEntity: Entity, message: Message) => {
    setActiveSessions(prev => {
      // Find if the target session is open
      const targetSessionIndex = prev.findIndex(s => s.entity_id === targetEntity.id);
      
      if (targetSessionIndex > -1) {
        // If open, add the message
        const newSessions = [...prev];
        const updatedSession = { ...newSessions[targetSessionIndex] };
        updatedSession.messages = [...updatedSession.messages, message];
        newSessions[targetSessionIndex] = updatedSession;
        return newSessions;
      } else {
        // If not open, open it with the new message
        return [...prev, {
          entity_id: targetEntity.id,
          entity_name: targetEntity.name,
          messages: [message],
          state: {}
        }];
      }
    });
  };

  const getEntityById = (id: string) => entities.find(e => e.id === id);

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Sentient Nexus</h1>
        <p className="text-muted-foreground mt-2">Central Command for Autonomous Cognitive Entities</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {entities.map(entity => (
          <EntityCard key={entity.id} entity={entity} onOpen={openInterface} />
        ))}
      </div>

      <div className="fixed inset-0 pointer-events-none z-10">
        {activeSessions.map((session, index) => {
          const entity = getEntityById(session.entity_id);
          if (!entity) return null;
          
          return (
            <div 
              key={session.entity_id}
              className="absolute pointer-events-auto"
              style={{ top: `${5 + index * 5}%`, left: `${10 + index * 5}%`, width: 'clamp(300px, 60vw, 800px)', height: 'clamp(400px, 80vh, 900px)' }}
            >
              <EntityInterface
                entity={entity}
                session={session}
                onClose={() => closeInterface(session.entity_id)}
                onSaveSession={saveSession}
                onCrossEntitySend={handleCrossEntitySend}
                allEntities={entities}
              />
            </div>
          );
        })}
      </div>
    </main>
  );
}
