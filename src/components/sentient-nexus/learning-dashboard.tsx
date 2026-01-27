'use client';

import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { base44 } from '@/api/base44Client';
import type { Learning } from '@/lib/types';

function LearningDashboard({ entityId }: { entityId: string }) {
  const [learnings, setLearnings] = useState<Learning[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLearnings = async () => {
      setLoading(true);
      try {
        const data = await base44.entities.EntityLearning.filter({ entity_id: entityId });
        setLearnings(data);
      } catch (error) {
        console.error("Failed to fetch learnings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLearnings();
  }, [entityId]);

  const stats = {
    total: learnings.length,
    avgConfidence: learnings.length ? learnings.reduce((sum, l) => sum + l.confidence_score, 0) / learnings.length : 0,
    avgSuccess: learnings.length ? learnings.reduce((sum, l) => sum + l.success_rate, 0) / learnings.length : 0
  };

  if (loading) {
    return <div className="text-center text-slate-400">Loading learning data...</div>
  }

  return (
    <div className="space-y-4 text-white">
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-slate-900/50 border-cyan-900/30 p-3">
          <div className="text-xs text-slate-400">Total Learnings</div>
          <div className="text-2xl font-bold text-cyan-400">{stats.total}</div>
        </Card>
        <Card className="bg-slate-900/50 border-cyan-900/30 p-3">
          <div className="text-xs text-slate-400">Avg Confidence</div>
          <div className="text-2xl font-bold text-purple-400">{(stats.avgConfidence * 100).toFixed(0)}%</div>
        </Card>
        <Card className="bg-slate-900/50 border-cyan-900/30 p-3">
          <div className="text-xs text-slate-400">Success Rate</div>
          <div className="text-2xl font-bold text-green-400">{(stats.avgSuccess * 100).toFixed(0)}%</div>
        </Card>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-cyan-400">Recent Learnings</h4>
        {learnings.length === 0 && <p className="text-sm text-slate-500">No learnings recorded yet.</p>}
        {learnings.slice(0, 10).map((learning) => (
          <Card key={learning.id} className="bg-slate-900/50 border-cyan-900/30 p-3">
            <div className="flex items-start justify-between mb-1">
              <Badge className="text-xs bg-cyan-900 text-cyan-300">{learning.learning_type}</Badge>
              <Badge variant="outline" className="text-xs text-purple-400 border-purple-400/50">
                {(learning.confidence_score * 100).toFixed(0)}%
              </Badge>
            </div>
            <p className="text-sm text-cyan-200">{learning.content}</p>
            <p className="text-xs text-slate-500 mt-1">Used {learning.usage_count} times</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default LearningDashboard;
