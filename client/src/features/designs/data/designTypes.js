export const designTypes = {
  // Social Media Designs
  instagram: {
    label: "Instagram",
    subtypes: {
      "instagram-post": { label: "Post (1080×1080)", width: 1080, height: 1080 },
      "instagram-post-small": { label: "Post Small (800×800)", width: 800, height: 800 },
      "instagram-ad": { label: "Ad (1080×1080)", width: 1080, height: 1080 },
      "instagram-story": { label: "Story (1080×1920)", width: 1080, height: 1920 },
      "instagram-portrait-ad": { label: "Portrait Ad (1080×1350)", width: 1080, height: 1350 },
      "instagram-reel-cover-small": { label: "Reel Cover Small (540×960)", width: 540, height: 960 },
      "instagram-reel-cover": { label: "Reel Cover (1080×1920)", width: 1080, height: 1920 },
      "instagram-portrait-ad-small": { label: "Portrait Ad Small (600×750)", width: 600, height: 750 },
      "instagram-story-small": { label: "Story Small (540×960)", width: 540, height: 960 }
    }
  },
  
  facebook: {
    label: "Facebook",
    subtypes: {
      "facebook-ad": { label: "Ad (1200×628)", width: 1200, height: 628 },
      "facebook-ad-small": { label: "Ad Small (800×800)", width: 800, height: 800 },
      "facebook-post": { label: "Post (1200×900)", width: 1200, height: 900 },
      "facebook-post-small": { label: "Post Small (800×800)", width: 800, height: 800 },
      "facebook-cover": { label: "Cover (851×315)", width: 851, height: 315 },
      "facebook-event-cover-small": { label: "Event Cover Small (768×402)", width: 768, height: 402 },
      "facebook-event-cover": { label: "Event Cover (1920×1005)", width: 1920, height: 1005 }
    }
  },
  
  twitter: {
    label: "Twitter",
    subtypes: {
      "twitter-ad": { label: "Ad (1200×675)", width: 1200, height: 675 },
      "twitter-ad-small": { label: "Ad Small (640×360)", width: 640, height: 360 },
      "twitter-post": { label: "Post (1024×512)", width: 1024, height: 512 },
      "twitter-cover": { label: "Cover (1500×500)", width: 1500, height: 500 },
      "twitter-cover-small": { label: "Cover Small (750×250)", width: 750, height: 250 }
    }
  },
  
  linkedin: {
    label: "LinkedIn",
    subtypes: {
      "linkedIn-ad": { label: "Ad (1080×1080)", width: 1080, height: 1080 },
      "linkedIn-ad-small": { label: "Ad Small (800×800)", width: 800, height: 800 },
      "linkedIn-post": { label: "Post (1200×628)", width: 1200, height: 628 },
      "linkedIn-post-small": { label: "Post Small (600×314)", width: 600, height: 314 },
      "linkedIn-cover": { label: "Cover (1128×191)", width: 1128, height: 191 },
      "linkedIn-cover-small": { label: "Cover Small (564×96)", width: 564, height: 96 },
      "linkedIn-banner": { label: "Banner (1584×396)", width: 1584, height: 396 }
    }
  },
  
  pinterest: {
    label: "Pinterest",
    subtypes: {
      "pinterest-std-pin": { label: "Standard Pin (600×900)", width: 600, height: 900 },
      "pinterest-pin-small": { label: "Pin Small (400×600)", width: 400, height: 600 },
      "pinterest-board-cover": { label: "Board Cover (600×600)", width: 600, height: 600 }
    }
  },
  
  whatsapp: {
    label: "WhatsApp",
    subtypes: {
      "whatsapp-post": { label: "Post (800×800)", width: 800, height: 800 },
      "whatsapp-wide-post": { label: "Wide Post (800×400)", width: 800, height: 400 },
      "whatsapp-status": { label: "Status (1080×1920)", width: 1080, height: 1920 },
      "whatsapp-business-cover": { label: "Business Cover (1211×681)", width: 1211, height: 681 },
      "whatsapp-status-small": { label: "Status Small (540×960)", width: 540, height: 960 }
    }
  },
  
  youtube: {
    label: "YouTube",
    subtypes: {
      "youtube-thumbnail": { label: "Thumbnail (1280×720)", width: 1280, height: 720 },
      "youtube-thumbnail-small": { label: "Thumbnail Small (640×360)", width: 640, height: 360 },
      "youtube-shorts-thumbnail-small": { label: "Shorts Thumbnail (540×960)", width: 540, height: 960 },
      "youtube-shorts-thumbnail": { label: "Shorts Thumbnail (1080×1920)", width: 1080, height: 1920 },
    }
  },
  
  snapchat: {
    label: "Snapchat",
    subtypes: {
      "snapchat-post-small": { label: "Post Small (540×960)", width: 540, height: 960 },
      "snapchat-post": { label: "Post (1080×1920)", width: 1080, height: 1920 },
      "snapchat-ad-small": { label: "Ad Small (540×960)", width: 540, height: 960 },
      "snapchat-ad": { label: "Ad (1080×1920)", width: 1080, height: 1920 }
    }
  },
  
  reddit: {
    label: "Reddit",
    subtypes: {
      "reddit-ad": { label: "Ad (1440×1080)", width: 1440, height: 1080 },
      "reddit-ad-square": { label: "Ad Square (1080×1080)", width: 1080, height: 1080 },
      "reddit-ad-small": { label: "Ad Small (600×450)", width: 600, height: 450 }
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
      "displayAds-square": { label: "Square (250×250)", width: 250, height: 250 },
      "displayAds-small-square": { label: "Small Square (200×200)", width: 200, height: 200 },
      
      // Skyscraper Display Ads
      "displayAds-skyscraper": { label: "Skyscraper (120×600)", width: 120, height: 600 },
      "displayAds-fat-skyscraper": { label: "Fat Skyscraper (240×400)", width: 240, height: 400 },
      "displayAds-wide-skyscraper": { label: "Wide Skyscraper (160×600)", width: 160, height: 600 },
      "displayAds-small-skyscraper": { label: "Small Skyscraper (120×240)", width: 120, height: 240 },
      
      // Leaderboard Display Ads
      "displayAds-leaderboard": { label: "Leaderboard (728×90)", width: 728, height: 90 },
      "displayAds-mobile-leaderboard": { label: "Mobile Leaderboard (320×50)", width: 320, height: 50 },
      "displayAds-large-leaderboard": { label: "Large Leaderboard (970×90)", width: 970, height: 90 },
      "displayAds-banner": { label: "Banner (468×60)", width: 468, height: 60 }
    }
  },
  
  // Amazon Ads
  amazon: {
    label: "Amazon",
    subtypes: {
      "amazon-ad": { label: "Ad (300×250)", width: 300, height: 250 },
      "amazon-one-third": { label: "One Third (1500×300)", width: 1500, height: 300 },
      "amazon-fullscreen": { label: "Fullscreen (727×356)", width: 727, height: 356 },
      "amazon-fullscreen-HD": { label: "Fullscreen HD (1920×1080)", width: 1920, height: 1080 },
      "amazon-large-square": { label: "Large Square (727×727)", width: 727, height: 727 },
      "amazon-rectangle": { label: "Rectangle (970×600)", width: 970, height: 600 },
      "amazon-standard": { label: "Standard (970×300)", width: 970, height: 300 },
      "amazon-square": { label: "Square (300×300)", width: 300, height: 300 },
      "amazon-small-square": { label: "Small Square (220×220)", width: 220, height: 220 }
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
      "website-fullscreen-HD": { label: "Fullscreen HD (1920×1080)", width: 1920, height: 1080 },
      "website-half-page": { label: "Half Page (1600×450)", width: 1600, height: 450 },
      "website-one-third": { label: "One Third (1600×300)", width: 1600, height: 300 },
      "website-standard": { label: "Standard (1280×400)", width: 1280, height: 400 },
      "website-hello-bar": { label: "Hello Bar (1280×100)", width: 1280, height: 100 },
      "website-hello-bar-small": { label: "Hello Bar Small (640×200)", width: 640, height: 200 },
      "website-blog-banner": { label: "Blog Banner (1200×630)", width: 1200, height: 630 }
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
      "small-square": { label: "Small Square (300×300)", width: 300, height: 300 },
      "email-signature": { label: "Signature (600×150)", width: 600, height: 150 }
    }
  },
  
  // Podcast & Streaming
  podcast: {
    label: "Podcast",
    subtypes: {
      "podcast-cover": { label: "Cover (1400×1400)", width: 1400, height: 1400 },
      "podcast-cover-small": { label: "Cover Small (1000×1000)", width: 1000, height: 1000 }
    }
  },
  
  twitch: {
    label: "Twitch",
    subtypes: {
      "twitch-banner": { label: "Banner (1200×480)", width: 1200, height: 480 }
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
  'sivi-gen-28h': { label: 'Sivi Gen-2.8H Pro' },
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
