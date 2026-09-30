import React, { useEffect, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number; // duration in ms, default 700ms
  className?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 750,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState<number>(value);

  useEffect(() => {
    // If not a finite number, just set it
    if (!Number.isFinite(value)) {
      setDisplayValue(value);
      return;
    }

    let startTimestamp: number | null = null;
    const initialValue = displayValue;
    const targetValue = value;
    const difference = targetValue - initialValue;

    if (Math.abs(difference) < 0.000001) {
      setDisplayValue(targetValue);
      return;
    }

    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Ease out cubic: 1 - pow(1 - progress, 3)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = initialValue + difference * easeProgress;
      
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setDisplayValue(targetValue);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [value, duration]);

  if (!Number.isFinite(value)) {
    return <span className={className}>—</span>;
  }

  const safeDisplay = Number.isFinite(displayValue) ? displayValue : value;
  const formatted = Number.isFinite(safeDisplay)
    ? safeDisplay.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : '—';

  return (
    <span className={`tabular-nums font-mono ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

export default AnimatedNumber;
