import { useCallback, useMemo } from 'react';
import { filesApi } from '../../../api/files.js';
import { useImmediateFlow } from '../../../hooks/useImmediateFlow.js';

/**
 * Hook for File flows.
 */
export function useFileFlow(flowKey) {
  const immediateFlows = useMemo(() => ({
    'get-presigned-url': {
      submitApi: (input) => filesApi.getPresignedUrl(input),
      onResponse: (data, _input, { addLog: log }) => {
        const uploadUrl = data.body?.uploadUrl;
        if (uploadUrl) {
          log(`Presigned URL generated: ${uploadUrl.substring(0, 80)}...`);
        } else {
          log('Presigned URL response received');
        }
      },
    },
  }), []);

  const getPresignedUrlFlow = useImmediateFlow(
    immediateFlows['get-presigned-url'].submitApi,
    'get-presigned-url',
    { onResponse: immediateFlows['get-presigned-url'].onResponse }
  );

  const submit = useCallback(
    (input) => {
      switch (flowKey) {
        case 'get-presigned-url':
          return getPresignedUrlFlow.submit(input);
        default:
          throw new Error(`Unknown file flow: ${flowKey}`);
      }
    },
    [flowKey, getPresignedUrlFlow]
  );

  return { submit };
}
