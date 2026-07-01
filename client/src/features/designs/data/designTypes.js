export const designTypes = {
  // Social Media Designs
  instagram: {
    label: "Instagram",
    subtypes: {
      "instagram-post": { label: "Post (1080×1080)", width: 1080, height: 1080 },
      "instagram-post-small": { label: "Post Small (800×800)", width: 800, height: 800 },
      "instagram-ad": { label: "Ad (1080×1080)", width: 1080, height: 1080 }
    }
  },
  
  facebook: {
    label: "Facebook",
    subtypes: {
      "facebook-post": { label: "Post (1200×900)", width: 1200, height: 900 },
      "facebook-ad": { label: "Ad (1200×628)", width: 1200, height: 628 },
      "facebook-cover": { label: "Cover (851×315)", width: 851, height: 315 }
    }
  },
  
  twitter: {
    label: "Twitter",
    subtypes: {
      "twitter-post": { label: "Post (1024×512)", width: 1024, height: 512 },
      "twitter-ad": { label: "Ad (1200×675)", width: 1200, height: 675 },
      "twitter-cover": { label: "Cover (1500×500)", width: 1500, height: 500 }
    }
  },
  
  linkedin: {
    label: "LinkedIn",
    subtypes: {
      "linkedIn-post": { label: "Post (1200×628)", width: 1200, height: 628 },
      "linkedIn-ad": { label: "Ad (1080×1080)", width: 1080, height: 1080 },
      "linkedIn-banner": { label: "Banner (1584×396)", width: 1584, height: 396 }
    }
  },
  
  pinterest: {
    label: "Pinterest",
    subtypes: {
      "pinterest-pin-small": { label: "Pin Small (400×600)", width: 400, height: 600 }
    }
  },
  
  whatsapp: {
    label: "WhatsApp",
    subtypes: {
      "whatsapp-post": { label: "Post (800×800)", width: 800, height: 800 },
      "whatsapp-wide-post": { label: "Wide Post (800×400)", width: 800, height: 400 },
      "whatsapp-business-cover": { label: "Business Cover (1211×681)", width: 1211, height: 681 }
    }
  },
  
  youtube: {
    label: "YouTube",
    subtypes: {
      "youtube-thumbnail-small": { label: "Thumbnail (640x360)", width: 640, height: 360 },
      "youtube-shorts-thumbnail-small": { label: "Shorts Thumbnail (540×960)", width: 540, height: 960 },
    }
  },
  
  // Display & Web Advertising
  displayAds: {
    label: "Display Ads",
    subtypes: {
      // Standard Display Ads
      "displayAds-half-page-ad": { label: "Half Page Ad (300×600)", width: 300, height: 600 },
      "displayAds-large-rectangle": { label: "Large Rectangle (336×280)", width: 336, height: 280 },
      "displayAds-inline-rectangle": { label: "Inline Rectangle (300×250)", width: 300, height: 250 },
      
      // Skyscraper Display Ads
      "displayAds-fat-skyscraper": { label: "Fat Skyscraper (240×400)", width: 240, height: 400 }
    }
  },
  
  // Amazon Ads
  amazon: {
    label: "Amazon",
    subtypes: {
      "amazon-ad": { label: "Ad (300×250)", width: 300, height: 250 },
      "amazon-fullscreen": { label: "Fullscreen (727×356)", width: 727, height: 356 },
      "amazon-large-square": { label: "Large Square (727×727)", width: 727, height: 727 },
      "amazon-rectangle": { label: "Rectangle (970×600)", width: 970, height: 600 },
      "amazon-square": { label: "Square (300×300)", width: 300, height: 300 }
    }
  },
  
  // Website Elements
  website: {
    label: "Website",
    subtypes: {
      "website-large-rectangle": { label: "Large Rectangle (500×780)", width: 500, height: 780 },
      "website-medium-rectangle": { label: "Medium Rectangle (450×580)", width: 450, height: 580 },
      "website-rectangle": { label: "Rectangle (420×330)", width: 420, height: 330 },
      "website-wide-rectangle": { label: "Wide Rectangle (610×210)", width: 610, height: 210 },
      "website-tall-rectangle": { label: "Tall Rectangle (380×520)", width: 380, height: 520 },
      "website-square": { label: "Square (450×450)", width: 450, height: 450 },
      "website-small-square": { label: "Small Square (300×300)", width: 300, height: 300 },
      "website-large-square": { label: "Large Square (600×600)", width: 600, height: 600 },
      "website-standard": { label: "Standard (1280×400)", width: 1280, height: 400 }
    }
  },
  
  // Email Marketing
  email: {
    label: "Email",
    subtypes: {
      "square": { label: "Square (600×600)", width: 600, height: 600 },
      "tall": { label: "Tall (600×800)", width: 600, height: 800 },
      "rectangle": { label: "Rectangle (600×450)", width: 600, height: 450 },
      "wide": { label: "Wide (600×250)", width: 600, height: 250 },
      "small": { label: "Small (300×450)", width: 300, height: 450 },
      "small-square": { label: "Small Square (300×300)", width: 300, height: 300 }
    }
  },
  
  // Custom Dimensions
  custom: {
    label: "Custom",
    subtypes: {
      "custom": { label: "Custom Dimensions", width: null, height: null }
    }
  }
};

// Imagine model types (predefined dimensions, no custom input)
export const imagineDesignTypes = {
  "gpt-square": {
    label: "GPT Image (Square)",
    subtypes: {
      "square": { label: "Square (1024×1024)", width: 1024, height: 1024 },
    }
  },
  "landscape": {
    label: "GPT Image (Landscape)",
    subtypes: {
      "landscape": { label: "Landscape (1536×1024)", width: 1536, height: 1024 },
    }
  },
  "potrait": {
    label: "GPT Image (Portrait)",
    subtypes: {
      "potrait": { label: "Portrait (1024×1536)", width: 1024, height: 1536 },
    }
  },
  "nano-banana": {
    label: "Nano Banana",
    subtypes: {
      "nano-banana-1:1-1k": { label: "1:1 (1024×1024)", width: 1024, height: 1024 },
      "nano-banana-3:2-1k": { label: "3:2 (1264×848)", width: 1264, height: 848 },
      "nano-banana-2:3-1k": { label: "2:3 (848×1264)", width: 848, height: 1264 },
      "nano-banana-4:3-1k": { label: "4:3 (1200×896)", width: 1200, height: 896 },
      "nano-banana-3:4-1k": { label: "3:4 (896×1200)", width: 896, height: 1200 },
      "nano-banana-4:5-1k": { label: "4:5 (1152×928)", width: 1152, height: 928 },
      "nano-banana-5:4-1k": { label: "5:4 (928×1152)", width: 928, height: 1152 },
      "nano-banana-16:9-1k": { label: "16:9 (1376×768)", width: 1376, height: 768 },
      "nano-banana-9:16-1k": { label: "9:16 (768×1376)", width: 768, height: 1376 },
      "nano-banana-21:9-1k": { label: "21:9 (1548×672)", width: 1548, height: 672 },
    }
  },
  "nano-banana-2": {
    label: "Nano Banana 2",
    subtypes: {
      "nano-banana-2-1:1-1k": { label: "1:1 1k (1024×1024)", width: 1024, height: 1024 },
      "nano-banana-2-3:2-1k": { label: "3:2 1k (1264×848)", width: 1264, height: 848 },
      "nano-banana-2-2:3-1k": { label: "2:3 1k (848×1264)", width: 848, height: 1264 },
      "nano-banana-2-4:3-1k": { label: "4:3 1k (1200×896)", width: 1200, height: 896 },
      "nano-banana-2-3:4-1k": { label: "3:4 1k (896×1200)", width: 896, height: 1200 },
      "nano-banana-2-4:5-1k": { label: "4:5 1k (1152×928)", width: 1152, height: 928 },
      "nano-banana-2-5:4-1k": { label: "5:4 1k (928×1152)", width: 928, height: 1152 },
      "nano-banana-2-16:9-1k": { label: "16:9 1k (1376×768)", width: 1376, height: 768 },
      "nano-banana-2-9:16-1k": { label: "9:16 1k (768×1376)", width: 768, height: 1376 },
      "nano-banana-2-21:9-1k": { label: "21:9 1k (1548×672)", width: 1548, height: 672 },
      "nano-banana-2-1:1-2k": { label: "1:1 2k (2048×2048)", width: 2048, height: 2048 },
      "nano-banana-2-3:2-2k": { label: "3:2 2k (2528×1696)", width: 2528, height: 1696 },
      "nano-banana-2-2:3-2k": { label: "2:3 2k (1696×2528)", width: 1696, height: 2528 },
      "nano-banana-2-4:3-2k": { label: "4:3 2k (2400×1792)", width: 2400, height: 1792 },
      "nano-banana-2-3:4-2k": { label: "3:4 2k (1792×2400)", width: 1792, height: 2400 },
      "nano-banana-2-4:5-2k": { label: "4:5 2k (2304×1856)", width: 2304, height: 1856 },
      "nano-banana-2-5:4-2k": { label: "5:4 2k (1856×2304)", width: 1856, height: 2304 },
      "nano-banana-2-16:9-2k": { label: "16:9 2k (2752×1536)", width: 2752, height: 1536 },
      "nano-banana-2-9:16-2k": { label: "9:16 2k (1536×2752)", width: 1536, height: 2752 },
      "nano-banana-2-21:9-2k": { label: "21:9 2k (3096×1344)", width: 3096, height: 1344 },
      "nano-banana-2-1:1-4k": { label: "1:1 4k (4096×4096)", width: 4096, height: 4096 },
      "nano-banana-2-3:2-4k": { label: "3:2 4k (5056×3392)", width: 5056, height: 3392 },
      "nano-banana-2-2:3-4k": { label: "2:3 4k (3392×5056)", width: 3392, height: 5056 },
      "nano-banana-2-4:3-4k": { label: "4:3 4k (4800×3584)", width: 4800, height: 3584 },
      "nano-banana-2-3:4-4k": { label: "3:4 4k (3584×4800)", width: 3584, height: 4800 },
      "nano-banana-2-4:5-4k": { label: "4:5 4k (4608×3712)", width: 4608, height: 3712 },
      "nano-banana-2-5:4-4k": { label: "5:4 4k (3712×4608)", width: 3712, height: 4608 },
      "nano-banana-2-16:9-4k": { label: "16:9 4k (5504×3072)", width: 5504, height: 3072 },
      "nano-banana-2-9:16-4k": { label: "9:16 4k (3072×5504)", width: 3072, height: 5504 },
      "nano-banana-2-21:9-4k": { label: "21:9 4k (6192×2688)", width: 6192, height: 2688 },
    }
  },
  "nano-banana-pro": {
    label: "Nano Banana Pro",
    subtypes: {
      "nano-banana-pro-1:1-1k": { label: "1:1 1k (1024×1024)", width: 1024, height: 1024 },
      "nano-banana-pro-3:2-1k": { label: "3:2 1k (1264×848)", width: 1264, height: 848 },
      "nano-banana-pro-2:3-1k": { label: "2:3 1k (848×1264)", width: 848, height: 1264 },
      "nano-banana-pro-4:3-1k": { label: "4:3 1k (1200×896)", width: 1200, height: 896 },
      "nano-banana-pro-3:4-1k": { label: "3:4 1k (896×1200)", width: 896, height: 1200 },
      "nano-banana-pro-4:5-1k": { label: "4:5 1k (1152×928)", width: 1152, height: 928 },
      "nano-banana-pro-5:4-1k": { label: "5:4 1k (928×1152)", width: 928, height: 1152 },
      "nano-banana-pro-16:9-1k": { label: "16:9 1k (1376×768)", width: 1376, height: 768 },
      "nano-banana-pro-9:16-1k": { label: "9:16 1k (768×1376)", width: 768, height: 1376 },
      "nano-banana-pro-21:9-1k": { label: "21:9 1k (1548×672)", width: 1548, height: 672 },
      "nano-banana-pro-1:1-2k": { label: "1:1 2k (2048×2048)", width: 2048, height: 2048 },
      "nano-banana-pro-3:2-2k": { label: "3:2 2k (2528×1696)", width: 2528, height: 1696 },
      "nano-banana-pro-2:3-2k": { label: "2:3 2k (1696×2528)", width: 1696, height: 2528 },
      "nano-banana-pro-4:3-2k": { label: "4:3 2k (2400×1792)", width: 2400, height: 1792 },
      "nano-banana-pro-3:4-2k": { label: "3:4 2k (1792×2400)", width: 1792, height: 2400 },
      "nano-banana-pro-4:5-2k": { label: "4:5 2k (2304×1856)", width: 2304, height: 1856 },
      "nano-banana-pro-5:4-2k": { label: "5:4 2k (1856×2304)", width: 1856, height: 2304 },
      "nano-banana-pro-16:9-2k": { label: "16:9 2k (2752×1536)", width: 2752, height: 1536 },
      "nano-banana-pro-9:16-2k": { label: "9:16 2k (1536×2752)", width: 1536, height: 2752 },
      "nano-banana-pro-21:9-2k": { label: "21:9 2k (3096×1344)", width: 3096, height: 1344 },
      "nano-banana-pro-1:1-4k": { label: "1:1 4k (4096×4096)", width: 4096, height: 4096 },
      "nano-banana-pro-3:2-4k": { label: "3:2 4k (5056×3392)", width: 5056, height: 3392 },
      "nano-banana-pro-2:3-4k": { label: "2:3 4k (3392×5056)", width: 3392, height: 5056 },
      "nano-banana-pro-4:3-4k": { label: "4:3 4k (4800×3584)", width: 4800, height: 3584 },
      "nano-banana-pro-3:4-4k": { label: "3:4 4k (3584×4800)", width: 3584, height: 4800 },
      "nano-banana-pro-4:5-4k": { label: "4:5 4k (4608×3712)", width: 4608, height: 3712 },
      "nano-banana-pro-5:4-4k": { label: "5:4 4k (3712×4608)", width: 3712, height: 4608 },
      "nano-banana-pro-16:9-4k": { label: "16:9 4k (5504×3072)", width: 5504, height: 3072 },
      "nano-banana-pro-9:16-4k": { label: "9:16 4k (3072×5504)", width: 3072, height: 5504 },
      "nano-banana-pro-21:9-4k": { label: "21:9 4k (6192×2688)", width: 6192, height: 2688 },
    }
  }
};

// Design models for Compose mode (from supported-models.md)
export const composeModels = {
  'auto': { label: 'Auto Model' },
  'sivi-gen-28h-lite': { label: 'Sivi Gen-2.8H Lite' },
  'sivi-gen-28h-pro': { label: 'Sivi Gen-2.8H Pro' },
  'sivi-gen-28h-max': { label: 'Sivi Gen-2.8H Max' },
  'sivi-gen-27': { label: 'Sivi Gen-2.7' },
};

// Design models for Imagine mode — each model maps to its imagineDesignTypes keys
// qualityFilter filters subtypes by suffix (e.g., '1k', '2k', '4k')
export const imagineModels = {
  'nano-banana:1k': {
    label: 'Nano Banana',
    types: ['nano-banana'],
  },
  'nano-banana-2:1k': {
    label: 'Nano Banana 2 1k',
    types: ['nano-banana-2'],
    qualityFilter: '1k',
  },
  'nano-banana-2:2k': {
    label: 'Nano Banana 2 2k',
    types: ['nano-banana-2'],
    qualityFilter: '2k',
  },
  'nano-banana-2:4k': {
    label: 'Nano Banana 2 4k',
    types: ['nano-banana-2'],
    qualityFilter: '4k',
  },
  'nano-banana-pro:1k': {
    label: 'Nano Banana Pro 1k',
    types: ['nano-banana-pro'],
    qualityFilter: '1k',
  },
  'nano-banana-pro:2k': {
    label: 'Nano Banana Pro 2k',
    types: ['nano-banana-pro'],
    qualityFilter: '2k',
  },
  'nano-banana-pro:4k': {
    label: 'Nano Banana Pro 4k',
    types: ['nano-banana-pro'],
    qualityFilter: '4k',
  },
  'gpt-image-1:low': {
    label: 'GPT Image 1 Low',
    types: ['gpt-square', 'landscape', 'potrait'],
  },
  'gpt-image-1:medium': {
    label: 'GPT Image 1 Medium',
    types: ['gpt-square', 'landscape', 'potrait'],
  },
  'gpt-image-1:high': {
    label: 'GPT Image 1 High',
    types: ['gpt-square', 'landscape', 'potrait'],
  },
};

// Helper function to get subtypes for a given type (checks both compose and imagine)
export const getSubtypesForType = (type) => {
  return designTypes[type]?.subtypes || imagineDesignTypes[type]?.subtypes || {};
};

// Helper function to get filtered subtypes for an imagine model
// Filters subtypes by quality suffix (e.g., '1k', '2k', '4k') when qualityFilter is set
export const getFilteredSubtypesForModel = (modelKey, type) => {
  const model = imagineModels[modelKey];
  const allSubtypes = getSubtypesForType(type);
  if (!model?.qualityFilter) return allSubtypes;
  const filtered = {};
  Object.entries(allSubtypes).forEach(([key, subtype]) => {
    if (key.endsWith('-' + model.qualityFilter)) {
      filtered[key] = subtype;
    }
  });
  return filtered;
};

// Helper function to get dimensions for a type/subtype combination
export const getDimensionsForSubtype = (type, subtype) => {
  const subtypeData = designTypes[type]?.subtypes?.[subtype] || imagineDesignTypes[type]?.subtypes?.[subtype];
  return subtypeData ? { width: subtypeData.width, height: subtypeData.height } : null;
};

// Helper function to check if a type/subtype requires custom dimensions
export const requiresCustomDimensions = (type, subtype) => {
  return type === 'custom' || subtype === 'custom-dimensions';
};

// Helper to check if a type is an imagine type
export const isImagineType = (type) => {
  return Object.prototype.hasOwnProperty.call(imagineDesignTypes, type);
};
