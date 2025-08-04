# NightreignQuickRef

Quick reference for Elden Ring: Nightreign entries, categorized to match in-game structure for instant lookup.

All data reference files are located in the [raw_data/](./reference/raw_data/) directory.

## Tech Stack

- **React 19.1.0**
- **TypeScript 5.8.3** 
- **Vite 7.0.4**
- **Ant Design 5.26.7**

## Project Setup

### Requirements

- Node.js 18+ 
- npm or yarn

### Install Dependencies

```bash
cd nightreign-reference-notebook
npm install
```

### Development Mode

```bash
npm run dev
```

Start the development server, default address is `http://localhost:5173`

### Build Production Version

```bash
npm run build
```

Build output will be generated in the `dist` directory

### Preview Build Result

```bash
npm run preview
```

## GitHub Pages Deployment

### Initial Deployment (Completed)

1. Install gh-pages:
   ```bash
   npm install -D gh-pages
   ```

2. Configure GitHub Pages:
   - Go to GitHub repository settings
   - Select "Pages" → "Source" → "Deploy from a branch"
   - Choose "gh-pages" branch
   - Select "root" folder
   - Save settings

### Subsequent Deployments

After modifying code, run the following command to redeploy:

```bash
npm run deploy
```

### Access URL

After deployment, you can access via:
- **Online URL**: https://xxiixi.github.io/NightreignQuickRef/


