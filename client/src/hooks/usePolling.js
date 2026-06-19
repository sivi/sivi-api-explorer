import { useRef, useCallback } from 'react';

export function usePolling() {
  const timerRef = useRef(null);
  const abortRef = useRef(false);

  const start = useCallback((fn, interval = 5000, immediate = false) => {
    abortRef.current = false;
    if (immediate) fn();

    const tick = async () => {
      if (abortRef.current) return;
      try {
        const shouldContinue = await fn();
        if (shouldContinue !== false && !abortRef.current) {
          timerRef.current = setTimeout(tick, interval);
        }
      } catch {
        // Stop polling on error unless explicitly handled by caller
      }
    };

    timerRef.current = setTimeout(tick, interval);
  }, []);

  const stop = useCallback(() => {
    abortRef.current = true;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return { start, stop };
}
