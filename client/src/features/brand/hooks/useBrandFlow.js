import { useCallback, useMemo } from 'react';
import { brandApi } from '~/api/brand.js';
import { useAppContext } from '~/context/useAppContext.js';
import { useImmediateFlow } from '~/hooks/useImmediateFlow.js';
import { useAsyncJob } from '~/hooks/useAsyncJob.js';

/**
 * Hook for all Brand flows.
 * Immediate-response flows use useImmediateFlow.
 * Async job flows (extract-brand) use useAsyncJob.
 */
export function useBrandFlow(flowKey) {
  const { addLog } = useAppContext();

  const immediateFlows = useMemo(() => ({
    'list-brands': {
      submitApi: (input) => brandApi.getBrands(input),
      onResponse: (data, _input, { addLog: log }) => {
        const brands = data.body?.brands ?? data.body?.result?.brands;
        if (brands?.length) {
          log(`Received ${brands.length} brands`);
        } else {
          log('No brands found');
        }
      },
    },
    'create-brand': {
      submitApi: (input) => brandApi.createBrand(input),
      onResponse: (data, _input, { addLog: log }) => {
        const brandId = data.body?.brandId ?? data.body?.result?.brandId;
        if (brandId) log(`Brand ID: ${brandId}`);
      },
    },
    'set-default-brand': {
      submitApi: (input) => brandApi.setDefaultBrand(input),
      onResponse: (data, _input, { addLog: log }) => {
        const success = data.body?.success ?? data.body?.result?.success;
        log(success ? 'Default brand set successfully' : 'Failed to set default brand');
      },
    },
    'archive-brand': {
      submitApi: (input) => brandApi.archiveBrand(input),
      onResponse: (data, _input, { addLog: log }) => {
        const success = data.body?.success ?? data.body?.result?.success;
        log(success ? 'Brand archived successfully' : 'Failed to archive brand');
      },
    },
    'update-brand': {
      submitApi: (input) => brandApi.updateBrand(input),
      onResponse: (data, _input, { addLog: log }) => {
        const brandId = data.body?.brandId ?? data.body?.result?.brandId;
        if (brandId) log(`Brand updated. ID: ${brandId}`);
        else log('Brand update completed');
      },
    },
  }), []);

  const listBrandsFlow = useImmediateFlow(
    immediateFlows['list-brands'].submitApi,
    'list-brands',
    { onResponse: immediateFlows['list-brands'].onResponse }
  );

  const createBrandFlow = useImmediateFlow(
    immediateFlows['create-brand'].submitApi,
    'create-brand',
    { onResponse: immediateFlows['create-brand'].onResponse }
  );

  const setDefaultBrandFlow = useImmediateFlow(
    immediateFlows['set-default-brand'].submitApi,
    'set-default-brand',
    { onResponse: immediateFlows['set-default-brand'].onResponse }
  );

  const archiveBrandFlow = useImmediateFlow(
    immediateFlows['archive-brand'].submitApi,
    'archive-brand',
    { onResponse: immediateFlows['archive-brand'].onResponse }
  );

  const updateBrandFlow = useImmediateFlow(
    immediateFlows['update-brand'].submitApi,
    'update-brand',
    { onResponse: immediateFlows['update-brand'].onResponse }
  );

  const extractBrandJob = useAsyncJob(brandApi.extractBrand, 'extract-brand', {
    onResult: (data) => {
      const details = data.body?.result?.brandDetails;
      if (details) {
        addLog(`Extracted brand: ${details.brandName || 'unknown'}`);
      } else {
        addLog('Brand extraction completed but no details found');
      }
    },
  });

  const submit = useCallback(
    (input, webhookEnabled) => {
      switch (flowKey) {
        case 'list-brands':
          return listBrandsFlow.submit(input);
        case 'create-brand':
          return createBrandFlow.submit(input);
        case 'set-default-brand':
          return setDefaultBrandFlow.submit(input);
        case 'archive-brand':
          return archiveBrandFlow.submit(input);
        case 'update-brand':
          return updateBrandFlow.submit(input);
        case 'extract-brand':
          return extractBrandJob.submit(input, webhookEnabled);
        default:
          throw new Error(`Unknown brand flow: ${flowKey}`);
      }
    },
    [
      flowKey,
      listBrandsFlow,
      createBrandFlow,
      setDefaultBrandFlow,
      archiveBrandFlow,
      updateBrandFlow,
      extractBrandJob,
    ]
  );

  return { submit, handleWebhookEvent: extractBrandJob.handleWebhookEvent };
}
