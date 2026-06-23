export const CONTENT_CATEGORIES = {
  text: {
    label: 'Text-Based Content Blocks',
    required: true,
    blocks: {
      title: { label: 'Title', placeholder: 'e.g. Discover the Freedom', inputType: 'text', alwaysPresent: true },
      supertext: { label: 'Supertext', placeholder: 'e.g. New Year', inputType: 'text' },
      subtext: { label: 'Subtext', placeholder: 'e.g. Explore our latest collection', inputType: 'text' },
      text: { label: 'Text', placeholder: 'e.g. Leading auto portal for content and commerce', inputType: 'text' },
      caption: { label: 'Caption', placeholder: 'e.g. Terms and conditions apply.', inputType: 'text' },
    },
  },
  cta: {
    label: 'Call-to-Action Blocks',
    required: true,
    blocks: {
      button: { label: 'Button', placeholder: 'e.g. Shop Now', inputType: 'text' },
      coupon: { label: 'Coupon', placeholder: 'e.g. BONUS20', inputType: 'text' },
      offer: { label: 'Offer', placeholder: 'e.g. Limited Time: Up to 20% Off', inputType: 'text' },
    },
  },
  list: {
    label: 'List Content Blocks',
    required: false,
    blocks: {
      bulletlist: { label: 'Bullet List', placeholder: 'Enter list item', inputType: 'list' },
      numberedlist: { label: 'Numbered List', placeholder: 'Enter list item', inputType: 'list' },
    },
  },
  dateTime: {
    label: 'Date and Time Blocks',
    required: false,
    blocks: {
      date_time: { label: 'Date / Time', placeholder: 'e.g. 12th July 2024', inputType: 'text' },
    },
  },
  contact: {
    label: 'Contact Information Blocks',
    required: false,
    blocks: {
      phone: { label: 'Phone', placeholder: 'e.g. +1 (800) 3543 323', inputType: 'text' },
      email: { label: 'Email', placeholder: 'e.g. joe@example.com', inputType: 'text' },
      website: { label: 'Website', placeholder: 'e.g. www.example.com', inputType: 'text' },
      address: { label: 'Address', placeholder: 'e.g. 40, M. Ave, Richmond road, US', inputType: 'text' },
    },
  },
  social: {
    label: 'Social Media Blocks',
    required: false,
    blocks: {
      whatsapp: { label: 'WhatsApp', placeholder: 'e.g. +1 6351621222', inputType: 'text' },
      instagram: { label: 'Instagram', placeholder: 'e.g. @example', inputType: 'text' },
      facebook: { label: 'Facebook', placeholder: 'e.g. example', inputType: 'text' },
      linkedin: { label: 'LinkedIn', placeholder: 'e.g. joe_example', inputType: 'text' },
      twitter: { label: 'Twitter', placeholder: 'e.g. @example', inputType: 'text' },
      behance: { label: 'Behance', placeholder: 'e.g. example', inputType: 'text' },
      dribbble: { label: 'Dribbble', placeholder: 'e.g. example', inputType: 'text' },
      pinterest: { label: 'Pinterest', placeholder: 'e.g. example', inputType: 'text' },
      slack: { label: 'Slack', placeholder: 'e.g. example', inputType: 'text' },
    },
  },
};

export const DEFAULT_CONTENT = { title: '' };

export function getAvailableBlocksForCategory(categoryKey) {
  const category = CONTENT_CATEGORIES[categoryKey];
  if (!category) return [];
  return Object.entries(category.blocks).map(([key, block]) => ({
    value: key,
    label: block.label,
  }));
}

export function getBlockMeta(categoryKey, blockKey) {
  return CONTENT_CATEGORIES[categoryKey]?.blocks?.[blockKey];
}

export function isBlockAlwaysPresent(categoryKey, blockKey) {
  return CONTENT_CATEGORIES[categoryKey]?.blocks?.[blockKey]?.alwaysPresent === true;
}
