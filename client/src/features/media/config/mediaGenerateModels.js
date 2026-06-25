export const IMAGE_GEN_MODELS = [
  { value: 'auto', label: 'Auto', credits: '0.03–3', premium: false, canGenerate: true, canEnhance: true },
  { value: 'flux-schnell', label: 'Flux Schnell', credits: '0.03', premium: false, canGenerate: true, canEnhance: false },
  { value: 'flux-klein-4b', label: 'Flux Klein 4B', credits: '0.03', premium: false, canGenerate: true, canEnhance: false },
  { value: 'flux-klein-9b', label: 'Flux Klein 9B', credits: '0.05', premium: false, canGenerate: true, canEnhance: true },
  { value: 'flux-dev', label: 'Flux Dev', credits: '0.05', premium: true, canGenerate: true, canEnhance: false },
  { value: 'twinflow-z-image-turbo', label: 'TwinFLOW Z Image Turbo', credits: '0.05', premium: false, canGenerate: true, canEnhance: false },
  { value: 'z-image-turbo', label: 'Z Image Turbo', credits: '0.1', premium: false, canGenerate: true, canEnhance: false },
  { value: 'nano-banana:1k', label: 'Nano Banana', credits: '2', premium: true, canGenerate: true, canEnhance: true },
  { value: 'nano-banana-2:1k', label: 'Nano Banana 2', credits: '2', premium: true, canGenerate: true, canEnhance: true },
  { value: 'nano-banana-pro:1k', label: 'Nano Banana Pro', credits: '3', premium: true, canGenerate: true, canEnhance: true },
];

const NANO_BANANA_MODELS = ['nano-banana:1k', 'nano-banana-2:1k', 'nano-banana-pro:1k'];

export const STANDARD_DIMENSIONS = [
  { width: 1024, height: 1024, label: '1:1' },
  { width: 1344, height: 768, label: '7:4' },
  { width: 1280, height: 960, label: '4:3' },
  { width: 960, height: 1280, label: '3:4' },
  { width: 768, height: 1344, label: '4:7' },
];

export const NANO_BANANA_DIMENSIONS = [
  { width: 1264, height: 848, label: '~3:2' },
  { width: 848, height: 1264, label: '~2:3' },
  { width: 1200, height: 896, label: '~4:3' },
  { width: 896, height: 1200, label: '~3:4' },
  { width: 1152, height: 928, label: '~5:4' },
  { width: 928, height: 1152, label: '~4:5' },
  { width: 1376, height: 768, label: '~16:9' },
  { width: 768, height: 1376, label: '~9:16' },
  { width: 1548, height: 672, label: '~23:10' },
];

export const getDimensionsForModel = (model) => {
  const all = [...STANDARD_DIMENSIONS];
  if (NANO_BANANA_MODELS.includes(model)) {
    all.push(...NANO_BANANA_DIMENSIONS);
  }
  return all.map((d) => ({
    value: `${d.width}x${d.height}`,
    label: `${d.width} × ${d.height} (${d.label})`,
    width: d.width,
    height: d.height,
  }));
};

export const getModelsForMode = (enhance) =>
  IMAGE_GEN_MODELS.filter((m) => (enhance ? m.canEnhance : m.canGenerate));

export const formatDimensionValue = (width, height) => `${width}x${height}`;

export const parseDimensionValue = (value) => {
  const [w, h] = value.split('x').map(Number);
  return { width: w, height: h };
};
