# Deployment Guide for AlgoViz Pro

## Netlify Deployment

1. **Prepare your repository**
   - Ensure all changes are committed
   - Make sure you have the following files in your repository:
     - `netlify.toml` (with proper configuration)
     - `vite.config.js` (with `base: './'`)
     - All source code files

2. **Deploy to Netlify**
   - Log in to your Netlify account
   - Click "New site from Git"
   - Connect to your Git provider and select the repository
   - Use the following build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy site"

3. **Verify deployment**
   - Once deployment is complete, Netlify will provide a URL
   - Visit the URL to ensure your application is working correctly
   - Check that all assets are loading properly
   - Test navigation and functionality

## Troubleshooting

### Common Issues

1. **Assets not loading**
   - Ensure `vite.config.js` has `base: './'` set
   - Check that all asset references use relative paths

2. **Routing issues**
   - The application uses HashRouter for compatibility with static hosting
   - Ensure `netlify.toml` has proper redirect rules

3. **Build failures**
   - Check build logs for specific errors
   - Ensure all dependencies are properly installed
   - Verify that the build command is correct

### Key Configuration Files

- **vite.config.js**: Contains build configuration
- **netlify.toml**: Contains Netlify-specific deployment settings
- **src/main.jsx**: Contains routing configuration (HashRouter)

## Local Testing

Before deploying, you can test the production build locally:

```bash
npm run build
npm run preview
```

This will build the application and serve it locally, simulating a production environment.