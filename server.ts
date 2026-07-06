import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Serve the custom dynamic avatar
  app.get('/api/avatar.jpg', (req, res) => {
    const persistedPath = path.join(process.cwd(), 'avatar_persisted.jpg');
    const defaultPath = path.join(process.cwd(), 'src', 'assets', 'images', 'avatar.jpg');
    
    if (fs.existsSync(persistedPath)) {
      res.setHeader('Content-Type', 'image/jpeg');
      return res.sendFile(persistedPath);
    } else if (fs.existsSync(defaultPath)) {
      res.setHeader('Content-Type', 'image/jpeg');
      return res.sendFile(defaultPath);
    } else {
      res.status(404).send('Avatar Not Found');
    }
  });

  // Get synchronized portfolio data
  app.get('/api/portfolio-data', (req, res) => {
    const persistedPath = path.join(process.cwd(), 'portfolio_persisted.json');
    if (fs.existsSync(persistedPath)) {
      try {
        const data = fs.readFileSync(persistedPath, 'utf-8');
        return res.json(JSON.parse(data));
      } catch (e) {
        console.error('Error reading persisted portfolio data:', e);
      }
    }
    return res.json(null);
  });

  // Helper to save avatar from base64
  function saveAvatarFromBase64(base64Str: string): string | null {
    try {
      const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return null;
      }
      const buffer = Buffer.from(matches[2], 'base64');
      
      // Save root backup
      const persistedPath = path.join(process.cwd(), 'avatar_persisted.jpg');
      fs.writeFileSync(persistedPath, buffer);

      // Also try to write back to the workspace src folder so it commits/rebuilds natively next time
      try {
        const imageDir = path.join(process.cwd(), 'src', 'assets', 'images');
        if (!fs.existsSync(imageDir)) {
          fs.mkdirSync(imageDir, { recursive: true });
        }
        fs.writeFileSync(path.join(imageDir, 'avatar.jpg'), buffer);
      } catch (wsErr) {
        console.error('Non-blocking: Could not write to src workspace path:', wsErr);
      }

      return '/api/avatar.jpg';
    } catch (error) {
      console.error('Error saving avatar from base64:', error);
      return null;
    }
  }

  // Save synchronized portfolio data (includes avatar if it's uploaded as Base64)
  app.post('/api/portfolio-data', express.json({ limit: '50mb' }), (req, res) => {
    try {
      const { personalInfo, projects } = req.body;
      if (!personalInfo) {
        return res.status(400).json({ error: 'Missing personalInfo' });
      }

      // If avatar is uploaded as Base64, convert and persist it as a real static file
      if (personalInfo.avatar && personalInfo.avatar.startsWith('data:')) {
        const savedPath = saveAvatarFromBase64(personalInfo.avatar);
        if (savedPath) {
          personalInfo.avatar = savedPath;
        }
      }

      const persistedPath = path.join(process.cwd(), 'portfolio_persisted.json');
      fs.writeFileSync(persistedPath, JSON.stringify({ personalInfo, projects }, null, 2));

      return res.json({ success: true, personalInfo, projects });
    } catch (error) {
      console.error('Error saving portfolio data:', error);
      return res.status(500).json({ error: 'Failed to save portfolio data' });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
