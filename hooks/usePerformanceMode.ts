'use client';

import { useEffect, useState } from 'react';

/**
 * Detect weak device based on hardware capabilities
 */
function detectWeakDevice(): boolean {
  if (typeof window === 'undefined') return false;

  const nav = navigator as any;
  
  // Check hardware concurrency (CPU cores) and device memory
  const cores = nav.hardwareConcurrency || 4;
  const memory = nav.deviceMemory || 4; // GB
  
  // Weak device: <= 2 cores OR <= 2GB RAM
  const isWeak = cores <= 2 || memory <= 2;
  
  console.log('[Performance Mode] Device detection:', {
    cores,
    memory,
    isWeak
  });
  
  return isWeak;
}

/**
 * Hook to detect and apply performance mode for weak devices
 * Automatically enables lite-mode class on document.body
 */
export function usePerformanceMode() {
  const [isWeakDevice, setIsWeakDevice] = useState(false);
  const [isLiteMode, setIsLiteMode] = useState(false);

  useEffect(() => {
    // Detect weak device
    const weak = detectWeakDevice();
    setIsWeakDevice(weak);

    // Auto-enable lite mode for weak devices
    if (weak) {
      document.body.classList.add('lite-mode');
      setIsLiteMode(true);
      console.log('[Performance Mode] Lite mode enabled automatically');
    }

    // Cleanup
    return () => {
      document.body.classList.remove('lite-mode');
    };
  }, []);

  // Manual toggle function (for user preference)
  const toggleLiteMode = () => {
    const newState = !isLiteMode;
    setIsLiteMode(newState);
    
    if (newState) {
      document.body.classList.add('lite-mode');
    } else {
      document.body.classList.remove('lite-mode');
    }
    
    // Save preference
    localStorage.setItem('liteMode', newState ? '1' : '0');
    console.log('[Performance Mode] Lite mode', newState ? 'enabled' : 'disabled');
  };

  return {
    isWeakDevice,
    isLiteMode,
    toggleLiteMode,
  };
}
