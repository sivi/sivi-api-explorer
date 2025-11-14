export const designPresets = {
  simple: {
    name: "Simple",
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
        currentbId: 'sivi_sample_1',
        // Styles
        colors: [],
        fontGroups: [],
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
            url: 'https://media.hellosivi.com/photos/se4WDeo0vkA.jpg',
            imagePreference: {
              crop: true,
              removeBg: false
            }
          },
          {
            url: 'https://media.hellosivi.com/photos/sM7n56orwHM.jpg',
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
        currentbId: 'sivi_sample_2',
        // Styles
        colors: ['#668135', '#D6DEC1', '#0E1A01'],
        fontGroups: [],
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
            url: 'https://media.hellosivi.com/photos/ssl11TjAFoA.jpg',
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
        currentbId:'sivi_sample_1',
        // Styles
        colors: ['#00B8A4', '#0679AB', '#FFFFFF'],
        fontGroups: [],
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
            url: 'https://media.hellosivi.com/photos/sGBdpCxKCqY.jpeg',
            imagePreference: {
              crop: true,
              removeBg: false
            }
          }
        ],
        logos: [
          {
            url: 'https://media.hellosivi.com/logos/snH2sMMwKoN.png',
            logoStyles: ['direct', 'neutral']
          }
        ]
      },
      language: 'english',
      numOfVariants: 4,
      outputFormat: ['jpg'],
      settings: {
        mode: 'custom',
        currentbId: 'sivi_sample_1',
        // Styles
        colors: ['#C31E2E'],
        fontGroups: [],
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
            url: 'https://media.hellosivi.com/photos/sEDpfWhzojS.jpeg',
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
        currentbId: 'sivi_sample_1',
        // Styles
        colors: [],
        fontGroups: [],
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
            url: 'https://media.hellosivi.com/photos/s300YDkgbpa.jpeg',
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
        currentbId: 'sivi_sample_1',
        // Styles
        colors: [],
        fontGroups: [],
        theme: [],
        frameStyle: [],
        backdropStyle: [],
        focus: [],
        imageStyle: [],
      }
    }
  }
};
