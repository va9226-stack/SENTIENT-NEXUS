'use client';

import React from 'react';

interface IntegrityMeterProps {
  score: number;
  maxScore?: number;
  label: string;
  color?: string;
}

export default function IntegrityMeter({ score, maxScore = 100, label, color = '#22c55e' }: IntegrityMeterProps) {
  const percentage = (score / maxScore) * 100;

  return (
    <div className="flex flex-col gap-1 text-xs font-mono">
      <div className="flex justify-between items-center">
        <span style={{ color }}>{label}</span>
        <span className="font-bold" style={{ color }}>{score.toFixed(0)}</span>
      </div>
      <div className="w-full bg-gray-700/50 rounded-full h-1.5">
        <div 
          className="h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
