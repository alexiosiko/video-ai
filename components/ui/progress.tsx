'use client';

import * as React from 'react';

interface ProgressProps {
  value: number;
  className?: string;
}

export function Progress({ value, className = '' }: ProgressProps) {
  return (
    <div className={`relative h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-blue-600 transition-all duration-300 ease-out rounded-full"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}