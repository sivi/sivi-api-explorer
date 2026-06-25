/**
 * Global flow action helpers.
 *
 * Flow actions allow any component to ask the app to switch to a different
 * flow and pre-fill form fields. This is intentionally generic so future
 * use-cases (e.g. "use this brand in Create Media", "use this result in Update
 * Brand") can be added without touching the App component.
 */

export const FLOW_ACTION_TARGETS = {
  MEDIA: 'create-media',
  FONT: 'upload-fonts',
};

/**
 * Map a content-type returned by a presigned-URL request to a target flow and
 * the initial form data that should be pre-filled.
 */
export function resolveFlowActionFromPresignedUrl(contentType, uploadUrl) {
  if (!uploadUrl || !contentType) return null;

  const normalized = String(contentType).toLowerCase().trim();

  if (normalized.startsWith('font/') || normalized.includes('font')) {
    return {
      flowKey: FLOW_ACTION_TARGETS.FONT,
      initialFormData: { uploadedURL: uploadUrl },
    };
  }

  // Default any image/media content type to Create Media.
  return {
    flowKey: FLOW_ACTION_TARGETS.MEDIA,
    initialFormData: {
      uploadUrl,
      type: 'photo',
      subType: 'image',
    },
  };
}

export function isFlowActionSupported(contentType) {
  return !!resolveFlowActionFromPresignedUrl(contentType, 'https://example.com');
}
