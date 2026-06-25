export const FLOW_GROUPS = [
  {
    label: 'Core',
    value: 'core',
    children: [
      { label: 'Designs from Prompt', value: 'designs-from-prompt' },
      { label: 'Designs from Content', value: 'designs-from-content' },
      { label: 'Content from Prompt', value: 'content-from-prompt' },
    ],
  },
  {
    label: 'Design Utilities',
    value: 'design-utilities',
    children: [
      { label: 'Get Design Variants', value: 'get-design-variants' },
      { label: 'Request Status', value: 'request-status' },
    ],
  },
  {
    label: 'Brand',
    value: 'brand',
    children: [
      { label: 'List Brands', value: 'list-brands' },
      { label: 'Create Brand', value: 'create-brand' },
      { label: 'Extract Brand', value: 'extract-brand' },
      { label: 'Set Default Brand', value: 'set-default-brand' },
      { label: 'Archive Brand', value: 'archive-brand' },
      { label: 'Update Brand', value: 'update-brand' },
    ],
  },
  {
    label: 'Media',
    value: 'media',
    children: [
      { label: 'List Media', value: 'get-media' },
      { label: 'Create Media', value: 'create-media' },
      { label: 'Update Media', value: 'update-media' },
      { label: 'Delete Media', value: 'delete-media' },
      { label: 'Generate Media', value: 'generate-media' },
    ],
  },
  {
    label: 'Files',
    value: 'files',
    children: [
      { label: 'Get Presigned URL', value: 'get-presigned-url' },
    ],
  },
  {
    label: 'Fonts',
    value: 'fonts',
    children: [
      { label: 'Get Fonts', value: 'get-fonts' },
      { label: 'Upload Fonts', value: 'upload-fonts' },
    ],
  },
  {
    label: 'User Management API',
    value: 'user-management',
    children: [
      { label: 'Login User', value: 'login-user' },
      { label: 'Delete User', value: 'delete-user' },
      { label: 'Set User Credit Limit', value: 'set-user-credit-limit' },
    ],
  },
]

export const FLOW_KEY_MAP = Object.fromEntries(
  FLOW_GROUPS.flatMap((g) => g.children.map((c) => [c.value, c.label]))
)

export function findFlowPath(flowKey) {
  for (const group of FLOW_GROUPS) {
    const child = group.children.find((c) => c.value === flowKey)
    if (child) return [group.value, child.value]
  }
  return [flowKey]
}
