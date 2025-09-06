# Sivi API Explorer

A comprehensive web application that demonstrates the Sivi AI API capabilities for AI-driven design generation. This interactive tool allows developers to explore different API functionalities, view real-time responses, monitor logs, and experiment with various input parameters.

## 🚀 Features

- **Interactive API Testing**: Test Sivi AI API endpoints with a user-friendly interface
- **Real-time Monitoring**: View API responses, request logs, and performance metrics
- **Design Generation**: Generate designs from text prompts using Sivi's Large Design Model (LDM)
- **Design Variants**: Explore multiple variations of generated designs
- **Status Polling**: Monitor asynchronous design generation progress
- **Request History**: Track and replay previous API requests
- **Preset Templates**: Quick-start with predefined design prompts
- **Response Visualization**: View generated designs and detailed API responses

## 🏗️ Architecture

```
sivi-api-explorer/
├── client/          # React frontend application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── presets/     # Design prompt presets
│   │   ├── utils/       # Utility functions
│   │   └── hooks/       # Custom React hooks
│   └── public/      # Static assets
└── server/          # Express.js backend server
    └── server.js    # API proxy server
```

## 📋 Prerequisites

- Node.js (v16 or higher)
- Yarn package manager
- Sivi AI API key

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/sivi/sivi-api-explorer.git
cd sivi-api-explorer
```

### 2. Server Setup

```bash
cd server
yarn install

# Create environment file
cp .env.example .env
```

Edit `.env` file with your Sivi API credentials:

```env
SIVI_API_URL=https://api.sivi.ai
SIVI_API_KEY=your_sivi_api_key_here
```

Start the server:

```bash
yarn dev
```

Server will run on `http://localhost:4000`

### 3. Client Setup

```bash
cd ../client
yarn install

# Create environment file
cp .env.example .env
```

Edit client `.env` file:

```env
VITE_API_BASE_URL=http://localhost:4000
```

Start the client:

```bash
yarn dev
```

Client will run on `http://localhost:5173`


## 📊 Monitoring & Debugging

### API Logs

The application provides comprehensive logging:

- **Request Timing**: Measures API response times
- **Status Updates**: Real-time status of design generation
- **Error Handling**: Detailed error messages and stack traces
- **Request History**: Persistent storage of API interactions

### Console Output

Server logs include:
```
designs-from-prompt: 1.234s
get-request-status response: { status: 'processing', progress: 45 }
get-design-variants: 0.567s
```

### Error Handling

Common error scenarios:
- Invalid API key: `401 Unauthorized`
- Rate limiting: `429 Too Many Requests`
- Invalid parameters: `400 Bad Request`
- Server errors: `500 Internal Server Error`

## 🎯 Design Presets

The application includes predefined presets for quick testing:

- **Social Media Posts**: Instagram, Facebook, Twitter formats
- **Marketing Materials**: Banners, flyers, advertisements
- **E-commerce**: Product showcases, promotional graphics
- **YouTube Thumbnails**: Video preview images
- **Business Cards**: Professional networking materials

## 🔐 Environment Variables

### Server (.env)
```env
SIVI_API_URL=https://api.sivi.ai
SIVI_API_KEY=your_api_key_here
PORT=4000
```

### Client (.env)
```env
VITE_API_BASE_URL=http://localhost:4000
VITE_APP_NAME=Sivi API Explorer
```

## 🚀 Deployment

### Production Build

```bash
# Build client
cd client
yarn build

# The built files will be in client/dist/
```

### Docker Support

```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
EXPOSE 4000
CMD ["yarn", "dev"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📚 API Documentation

For complete API documentation, visit:
- **Sivi API Docs**: [https://developer.sivi.ai/docs/sivi-api/overview](https://developer.sivi.ai/docs/sivi-api/overview)
- **SDK Documentation**: [https://developer.sivi.ai/docs/sivi-ui-sdk/overview](https://developer.sivi.ai/docs/sivi-ui-sdk/overview)

## 🐛 Troubleshooting

### Common Issues

**API Key Issues**:
```bash
Error: 401 Unauthorized
Solution: Verify your SIVI_API_KEY in the .env file
```

**CORS Errors**:
```bash
Error: CORS policy blocked
Solution: Ensure server is running on port 4000
```

**Design Generation Timeout**:
```bash
Error: Request timeout
Solution: Complex designs may take longer; increase polling interval
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Sivi AI Official Website](https://sivi.ai)
- [Developer Documentation](https://developer.sivi.ai)
- [API Reference](https://developer.sivi.ai/docs/sivi-api/overview)
- [Support](https://support.sivi.ai)

---

**Built with ❤️ by the Sivi AI team**