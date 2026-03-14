import { useEffect, useRef } from 'react';

const SSE_URL = 'http://localhost:4000/webhook/events';

const useWebhookEvents = (enabled, onEvent) => {
  const esRef = useRef(null);
  const onEventRef = useRef(onEvent);

  // Keep the callback ref current without re-subscribing
  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    if (!enabled) {
      if (esRef.current) {
        esRef.current.close();
        esRef.current = null;
      }
      return;
    }

    const es = new EventSource(SSE_URL);
    esRef.current = es;

    es.addEventListener('webhook', (e) => {
      try {
        const data = JSON.parse(e.data);
        onEventRef.current(data);
      } catch (err) {
        console.error('Failed to parse webhook SSE payload:', err);
      }
    });

    es.onerror = (err) => {
      console.error('SSE connection error:', err);
    };

    return () => {
      es.close();
      esRef.current = null;
    };
  }, [enabled]);
};

export default useWebhookEvents;
