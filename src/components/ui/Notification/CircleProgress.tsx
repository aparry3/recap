import React, { useState, useEffect, FC } from 'react';
import styles from './CircleProgress.module.scss';
export const CircularProgress: FC<{ percentage: number, children: React.ReactNode }> = ({ percentage, children }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smoothly animate the progress
    const timer = setTimeout(() => setProgress(percentage), 300);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className={styles.circularProgress}>
      <div
        className={styles.circle}
        style={{
          '--percentage': progress,
        } as React.CSSProperties}
      >
        <div className={styles.overlay}>
          {children}
        </div>
      </div>
    </div>
  );
}
