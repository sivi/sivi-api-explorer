export const designPresets = {
  // Designs from Prompt presets
  simple: {
    name: "Simple",
    flows: ['designs-from-prompt'],
    data: {
      type: 'amazon',
      subtype: 'amazon-square',
      dimension: {
        width: 300,
        height: 300
      },
      prompt: 'Get Free POS Development with your landing page. Claim Now',
      assets: {
        images: [],
        logos: []
      },
      language: 'english',
      numOfVariants: 3,
      outputFormat: ['jpg'],
      settings: {
        mode: 'brand',
        // Styles
        colorsPreference: {
          mode: 'brand',
          customColors: [],
          paletteStyle: []
        },
        fontGroupPreference: {
          mode: 'brand',
          fontGroups: []
        },
        theme: [],
        frameStyle: [],
        backdropStyle: [],
        focus: [],
        imageStyle: [],
      }
    }
  },

  ecommerceCategory: {
    name: "E-commerce Category",
    flows: ['designs-from-prompt'],
    data: {
      type: 'website',
      subtype: 'website-large-square',
      dimension: {
        width: 600,
        height: 600
      },
      prompt: 'Naturally Luxurious Skincare. Experience the Skinpro difference today. View Collection',
      assets: {
        images: [
          {
            url: 'https://media.hellosivi.com/system/sample-brands/blossom-bloom/photo-1.jpg',
            imagePreference: {
              crop: true,
              removeBg: false
            }
          },
          {
            url: 'https://media.hellosivi.com/system/sample-brands/blossom-bloom/photo-2.jpg',
            imagePreference: {
              crop: true,
              removeBg: false
            }
          }
        ],
        logos: []
      },
      language: 'english',
      numOfVariants: 3,
      outputFormat: ['jpg'],
      settings: {
        mode: 'custom',
        // Styles
        colorsPreference: {
          mode: 'custom',
          customColors: [
            { primary: false, color: '#D34D75', addedBy: 'user' },
            { primary: false, color: '#4AD3A9', addedBy: 'user' },
            { primary: false, color: '#FFC84D', addedBy: 'user' }
          ],
          paletteStyle: []
        },
        fontGroupPreference: {
          mode: 'brand',
          fontGroups: []
        },
        theme: ['light'],
        frameStyle: [],
        backdropStyle: [],
        focus: ['image'],
        imageStyle: [],
      }
    }
  },

  socialMedia: {
    name: "Social Media",
    flows: ['designs-from-prompt'],
    data: {
      type: 'twitter',
      subtype: 'twitter-post',
      dimension: {
        width: 1024,
        height: 512
      },
      prompt: 'Title: Bask in the Sun, Subtext: Let natural light flood your space with our designs., Button: Get a Quote',
      assets: {
        images: [
          {
            url: 'https://media.hellosivi.com/system/sample-brands/solid-home/photo-1.jpg',
            imagePreference: {
              crop: true,
              removeBg: false
            }
          }
        ],
        logos: []
      },
      fonts: [],
      language: 'english',
      numOfVariants: 3,
      outputFormat: ['jpg'],
      settings: {
        mode: 'custom',
        // Styles
        colorsPreference: {
          mode: 'custom',
          customColors: [
            { primary: false, color: '#2F5693', addedBy: 'user' },
            { primary: false, color: '#0372CD', addedBy: 'user' },
            { primary: false, color: '#9BCBEB', addedBy: 'user' }
          ],
          paletteStyle: []
        },
        fontGroupPreference: {
          mode: 'brand',
          fontGroups: []
        },
        theme: [],
        frameStyle: [],
        backdropStyle: [],
        focus: [],
        imageStyle: [],
      }
    }
  },

  brandAwareness: {
    name: "Brand Awareness",
    flows: ['designs-from-prompt'],
    data: {
      type: 'displayAds',
      subtype: 'displayAds-half-page-ad',
      dimension: {
        width: 300,
        height: 600
      },
      prompt: 'Navigating Real Estate, Simplified. Your trusted partner for buying and selling property. Learn More',
      assets: {
        images: [
          {
            url: 'https://media.hellosivi.com/system/sample-brands/solid-home/photo-2.jpg',
            imagePreference: {
              crop: true,
              removeBg: false
            }
          }
        ],
        logos: [
          {
            url: 'https://media.hellosivi.com/system/sample-brands/solid-home/solid-home-logo.png',
            logoStyles: ['direct', 'neutral']
          }
        ]
      },
      language: 'english',
      numOfVariants: 4,
      outputFormat: ['jpg'],
      settings: {
        mode: 'custom',
        // Styles
        colorsPreference: {
          mode: 'custom',
          customColors: [
            { primary: false, color: '#2F5693', addedBy: 'user' },
            { primary: false, color: '#0372CD', addedBy: 'user' }
          ],
          paletteStyle: []
        },
        fontGroupPreference: {
          mode: 'brand',
          fontGroups: []
        },
        theme: ['dark'],
        frameStyle: [],
        backdropStyle: [],
        focus: [],
        imageStyle: [],
      }
    }
  },

  videoThumbnail: {
    name: "Video Thumbnail",
    flows: ['designs-from-prompt'],
    data: {
      type: 'youtube',
      subtype: 'youtube-thumbnail-small',
      dimension: {
        width: 640,
        height: 360
      },
      prompt: 'Thumbnails for money management videos',
      assets: {
        images: [
          {
            url: 'https://media.hellosivi.com/system/sample-brands/xyz-beats/photo-1.jpg',
            imagePreference: {
              crop: true,
              removeBg: false
            }
          }
        ],
        logos: []
      },
      fonts: [],
      language: 'english',
      numOfVariants: 4,
      outputFormat: ['jpg'],
      settings: {
        mode: 'brand',
        // Styles
        colorsPreference: {
          mode: 'brand',
          customColors: [],
          paletteStyle: []
        },
        fontGroupPreference: {
          mode: 'brand',
          fontGroups: []
        },
        theme: [],
        frameStyle: [],
        backdropStyle: [],
        focus: [],
        imageStyle: [],
      }
    }
  },

  profileCover: {
    name: "Profile Cover",
    flows: ['designs-from-prompt'],
    data: {
      type: 'facebook',
      subtype: 'facebook-cover',
      dimension: {
        width: 851,
        height: 315
      },
      prompt: 'Best Movie Clips. Discover unforgettable moments in cinema history.',
      assets: {
        images: [
          {
            url: 'https://media.hellosivi.com/system/sample-brands/xyz-beats/photo-2.jpg',
            imagePreference: {
              crop: true,
              removeBg: false
            }
          }
        ],
        logos: []
      },
      fonts: [],
      language: 'english',
      numOfVariants: 3,
      outputFormat: ['jpg'],
      settings: {
        mode: 'brand',
        // Styles
        colorsPreference: {
          mode: 'brand',
          customColors: [],
          paletteStyle: []
        },
        fontGroupPreference: {
          mode: 'brand',
          fontGroups: []
        },
        theme: [],
        frameStyle: [],
        backdropStyle: [],
        focus: [],
        imageStyle: [],
      }
    }
  },
  // Designs from Content presets — inspired by sample brands
  contentSimple: {
    name: "Taco Tuesday Offer",
    flows: ['designs-from-content'],
    data: {
      type: 'instagram',
      subtype: 'instagram-post',
      dimension: { width: 1080, height: 1080 },
      content: {
        supertext: ' Taco Tuesday',
        title: "Alberto's Taco",
        subtext: 'Bold, authentic Mexican flavors made fresh, fast, and always satisfying',
        offer: 'Up to 50% Off All Tacos',
        button: 'Order Now',
      },
      assets: {
        images: [
          { url: 'https://media.hellosivi.com/system/sample-brands/albertos-taco/photo-1.png', imagePreference: { crop: true, removeBg: false } },
          { url: 'https://media.hellosivi.com/system/sample-brands/albertos-taco/photo-2.png', imagePreference: { crop: true, removeBg: false } }
        ],
        logos: [
          { url: 'https://media.hellosivi.com/system/sample-brands/albertos-taco/albertos-taco-logo.png', logoStyles: ['direct', 'neutral'] }
        ]
      },
      language: 'english',
      numOfVariants: 3,
      outputFormat: ['jpg'],
      settings: {
        mode: 'custom',
        colorsPreference: {
          mode: 'custom',
          customColors: ['#A12324', '#527A00', '#B3892D'],
          paletteStyle: []
        },
        fontGroupPreference: { mode: 'brand', fontGroups: [] },
        theme: ['light'],
        frameStyle: [],
        backdropStyle: [],
        focus: ['image'],
        imageStyle: [],
      }
    }
  },
  contentEcommerce: {
    name: "Blossom & Bloom Showcase",
    flows: ['designs-from-content'],
    data: {
      type: 'website',
      subtype: 'website-large-square',
      dimension: { width: 600, height: 600 },
      content: {
        supertext: 'Fresh Arrivals',
        title: 'Blossom & Bloom',
        subtext: 'Fresh flowers that make every occasion feel special',
        bulletlist: ['Same-day delivery', 'Handpicked blooms', 'Custom arrangements'],
        button: 'View Collection',
      },
      assets: {
        images: [
          { url: 'https://media.hellosivi.com/system/sample-brands/blossom-bloom/photo-1.jpg', imagePreference: { crop: true, removeBg: false } },
          { url: 'https://media.hellosivi.com/system/sample-brands/blossom-bloom/photo-2.jpg', imagePreference: { crop: true, removeBg: false } }
        ],
        logos: [
          { url: 'https://media.hellosivi.com/system/sample-brands/blossom-bloom/blossom-bloom-logo.png', logoStyles: ['direct', 'neutral'] }
        ]
      },
      language: 'english',
      numOfVariants: 3,
      outputFormat: ['jpg'],
      settings: {
        mode: 'custom',
        colorsPreference: {
          mode: 'custom',
          customColors: ['#D34D75', '#4AD3A9', '#FFC84D'],
          paletteStyle: []
        },
        fontGroupPreference: { mode: 'brand', fontGroups: [] },
        theme: ['light'],
        frameStyle: [],
        backdropStyle: [],
        focus: ['image'],
        imageStyle: [],
      }
    }
  },
  contentSocialMedia: {
    name: "XYZ Beats Live Event",
    flows: ['designs-from-content'],
    data: {
      type: 'facebook',
      subtype: 'facebook-post',
      dimension: { width: 1200, height: 900 },
      content: {
        supertext: 'Live Event',
        title: 'XYZ Beats Live in Concert',
        subtext: 'All about elevating events with powerful sound and unforgettable beats',
        date_time: 'July 15, 2024 at 8 PM',
        button: 'Get Tickets',
        instagram: '@xyzbeats',
        website: 'www.xyzbeats.com',
      },
      assets: {
        images: [
          { url: 'https://media.hellosivi.com/system/sample-brands/xyz-beats/photo-1.jpg', imagePreference: { crop: true, removeBg: false } }
        ],
        logos: [
          { url: 'https://media.hellosivi.com/system/sample-brands/xyz-beats/xyz-beats-logo.png', logoStyles: ['direct', 'neutral'] }
        ]
      },
      language: 'english',
      numOfVariants: 3,
      outputFormat: ['jpg'],
      settings: {
        mode: 'custom',
        colorsPreference: {
          mode: 'custom',
          customColors: ['#D64938', '#FF7518', '#3B0600'],
          paletteStyle: []
        },
        fontGroupPreference: { mode: 'brand', fontGroups: [] },
        theme: ['dark'],
        frameStyle: [],
        backdropStyle: [],
        focus: ['image'],
        imageStyle: [],
      }
    }
  },
  contentRealEstate: {
    name: "Solid Home Listing",
    flows: ['designs-from-content'],
    data: {
      type: 'displayAds',
      subtype: 'displayAds-half-page-ad',
      dimension: { width: 300, height: 600 },
      content: {
        title: 'Solid Home Co.',
        subtext: 'Your one-stop shop for quality home improvement products, trusted brands, and solutions built to last',
        numberedlist: ['Free in-store consultation', 'Expert installation', '30-day returns'],
        button: 'Shop Now',
        phone: '+1 (800) 765-4321',
        website: 'www.solidhome.com',
      },
      assets: {
        images: [
          { url: 'https://media.hellosivi.com/system/sample-brands/solid-home/photo-1.jpg', imagePreference: { crop: true, removeBg: false } }
        ],
        logos: [
          { url: 'https://media.hellosivi.com/system/sample-brands/solid-home/solid-home-logo.png', logoStyles: ['direct', 'neutral'] }
        ]
      },
      language: 'english',
      numOfVariants: 4,
      outputFormat: ['jpg'],
      settings: {
        mode: 'custom',
        colorsPreference: {
          mode: 'custom',
          customColors: ['#2F5693', '#0372CD', '#9BCBEB'],
          paletteStyle: []
        },
        fontGroupPreference: { mode: 'brand', fontGroups: [] },
        theme: ['light'],
        frameStyle: [],
        backdropStyle: [],
        focus: ['image'],
        imageStyle: [],
      }
    }
  },
  contentVideoPromo: {
    name: "XYZ Beats Video",
    flows: ['designs-from-content'],
    data: {
      type: 'youtube',
      subtype: 'youtube-thumbnail-small',
      dimension: { width: 640, height: 360 },
      content: {
        title: 'XYZ Beats — Ultimate Sound Mix',
        subtext: 'Powerful beats and unforgettable soundscapes',
        caption: 'Episode 12 — Live DJ Set',
        offer: 'Free Download Inside',
      },
      assets: {
        images: [
          { url: 'https://media.hellosivi.com/system/sample-brands/xyz-beats/photo-2.jpg', imagePreference: { crop: true, removeBg: false } }
        ],
        logos: [
          { url: 'https://media.hellosivi.com/system/sample-brands/xyz-beats/xyz-beats-logo.png', logoStyles: ['direct', 'neutral'] }
        ]
      },
      language: 'english',
      numOfVariants: 4,
      outputFormat: ['jpg'],
      settings: {
        mode: 'custom',
        colorsPreference: {
          mode: 'custom',
          customColors: ['#D64938', '#FF7518', '#3B0600'],
          paletteStyle: []
        },
        fontGroupPreference: { mode: 'brand', fontGroups: [] },
        theme: ['dark'],
        frameStyle: [],
        backdropStyle: [],
        focus: ['image'],
        imageStyle: [],
      }
    }
  },
  contentRestaurant: {
    name: "Alberto's Taco Menu",
    flows: ['designs-from-content'],
    data: {
      type: 'whatsapp',
      subtype: 'whatsapp-post',
      dimension: { width: 800, height: 800 },
      content: {
        supertext: 'Grand Opening',
        title: "Alberto's Taco",
        subtext: 'Bold, authentic Mexican flavors made fresh, fast, and always satisfying',
        bulletlist: ['Tacos starting at $5', 'Lunch combo $12', 'Free salsa with first order'],
        coupon: 'TACO20',
        offer: '20% Off on All Orders This Week',
        button: 'Order Online',
        phone: '+1 (635) 162 1222',
        address: '40, M. Ave, Richmond Road, US',
        instagram: '@albertostaco',
      },
      assets: {
        images: [
          { url: 'https://media.hellosivi.com/system/sample-brands/albertos-taco/photo-3.png', imagePreference: { crop: true, removeBg: false } },
          { url: 'https://media.hellosivi.com/system/sample-brands/albertos-taco/photo-4.png', imagePreference: { crop: true, removeBg: false } }
        ],
        logos: [
          { url: 'https://media.hellosivi.com/system/sample-brands/albertos-taco/albertos-taco-logo.png', logoStyles: ['direct', 'neutral'] }
        ]
      },
      language: 'english',
      numOfVariants: 3,
      outputFormat: ['jpg'],
      settings: {
        mode: 'custom',
        colorsPreference: {
          mode: 'custom',
          customColors: ['#A12324', '#527A00', '#B3892D'],
          paletteStyle: []
        },
        fontGroupPreference: { mode: 'brand', fontGroups: [] },
        theme: ['light'],
        frameStyle: [],
        backdropStyle: [],
        focus: ['image'],
        imageStyle: [],
      }
    }
  },
  contentLinkedIn: {
    name: "Solid Home Webinar",
    flows: ['designs-from-content'],
    data: {
      type: 'linkedin',
      subtype: 'linkedIn-post',
      dimension: { width: 1200, height: 628 },
      content: {
        title: 'Smart Home Renovation Strategies',
        subtext: 'Join Solid Home Co. experts for a deep dive into modern home improvement solutions',
        date_time: 'August 8, 2024 at 2 PM EST',
        button: 'Register Free',
        linkedin: 'solid-home-co',
        website: 'www.solidhome.com/webinar',
      },
      assets: {
        images: [
          { url: 'https://media.hellosivi.com/system/sample-brands/solid-home/photo-3.jpg', imagePreference: { crop: true, removeBg: false } }
        ],
        logos: [
          { url: 'https://media.hellosivi.com/system/sample-brands/solid-home/solid-home-logo.png', logoStyles: ['direct', 'neutral'] }
        ]
      },
      language: 'english',
      numOfVariants: 3,
      outputFormat: ['jpg'],
      settings: {
        mode: 'custom',
        colorsPreference: {
          mode: 'custom',
          customColors: ['#2F5693', '#0372CD', '#9BCBEB'],
          paletteStyle: []
        },
        fontGroupPreference: { mode: 'brand', fontGroups: [] },
        theme: ['light'],
        frameStyle: [],
        backdropStyle: [],
        focus: ['image'],
        imageStyle: [],
      }
    }
  },
  // Content from Prompt presets
  contentSummerSale: {
    name: "Summer Sale Content",
    flows: ['content-from-prompt'],
    data: {
      type: 'displayAds',
      subtype: 'displayAds-half-page-ad',
      dimension: { width: 300, height: 600 },
      prompt: 'Generate catchy headlines and descriptions for a summer sale campaign with 20% off on all t-shirts',
      language: 'english',
    }
  },
  contentPromptRealEstate: {
    name: "Real Estate Content",
    flows: ['content-from-prompt'],
    data: {
      type: 'displayAds',
      subtype: 'displayAds-half-page-ad',
      dimension: { width: 300, height: 600 },
      prompt: 'Create engaging content for a real estate agency promoting luxury apartments in the city center',
      language: 'english',
    }
  },
  // Extract Brand presets (empty for now)
};
