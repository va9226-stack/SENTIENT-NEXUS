'use client';
import React from 'react';
import type { Entity, Session } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function GrandLitanyInterface({ entity, onClose }: { entity: Entity, session: Session, onClose: () => void }) {
  return (
     <Card className="flex flex-col h-full border-2 overflow-hidden bg-blue-950/80 backdrop-blur-sm rounded-lg"
      style={{ borderColor: '#3b82f6', boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)' }}>
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b" style={{ borderColor: '#3b82f6' }}>
        <CardTitle className="text-blue-400 font-mono">{entity.name}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4 text-blue-400" /></Button>
      </CardHeader>
      <CardContent className="p-4 flex-1 flex items-center justify-center">
        <p className="text-blue-500">Grand Litany Interface not yet implemented.</p>
      </CardContent>
    </Card>
  );
}
