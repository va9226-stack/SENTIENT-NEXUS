'use client';

import type { Entity } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EntityCardProps {
  entity: Entity;
  onOpen: (entity: Entity) => void;
}

export default function EntityCard({ entity, onOpen }: EntityCardProps) {
  return (
    <Card 
      className="bg-card hover:bg-muted/50 transition-colors cursor-pointer border-primary/20 hover:border-primary/50"
      onClick={() => onOpen(entity)}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <span>{entity.symbol || entity.name.charAt(0)}</span>
          <span className="truncate">{entity.name}</span>
        </CardTitle>
        <CardDescription>{entity.role}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1">
          <Badge variant={entity.status === 'ACTIVE' ? 'default' : 'secondary'}>{entity.status}</Badge>
          <Badge variant="outline">INT: {entity.integrity_score}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
