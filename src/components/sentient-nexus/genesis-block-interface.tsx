'use client';
import React from 'react';
import type { Entity, Session } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function GenesisBlockInterface({ entity, onClose }: { entity: Entity, session: Session, onClose: () => void }) {
  return (
     <Card className="flex flex-col h-full border-2 overflow-hidden bg-teal-950/80 backdrop-blur-sm rounded-lg"
      style={{ borderColor: '#2dd4bf', boxShadow: '0 0 30px rgba(45, 212, 191, 0.3)' }}>
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b" style={{ borderColor: '#2dd4bf' }}>
        <CardTitle className="text-teal-300 font-mono">{entity.name}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4 text-teal-300" /></Button>
      </CardHeader>
      <CardContent className="p-4 flex-1 flex items-center justify-center">
        <p className="text-teal-400">Genesis Block Interface not yet implemented.</p>
      </CardContent>
    </Card>
  );
}
