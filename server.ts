import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { execSync } from 'child_process';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Serve the custom dynamic avatar
  app.get('/api/avatar.jpg', (req, res) => {
    const rootJpg = path.join(process.cwd(), 'avatar.jpg');
    const rootPng = path.join(process.cwd(), 'avatar.png');
    const rootJpeg = path.join(process.cwd(), 'avatar.jpeg');
    const persistedPath = path.join(process.cwd(), 'avatar_persisted.jpg');
    const defaultPath = path.join(process.cwd(), 'src', 'assets', 'images', 'avatar.jpg');
    
    if (fs.existsSync(rootJpg)) {
      res.setHeader('Content-Type', 'image/jpeg');
      return res.sendFile(rootJpg);
    } else if (fs.existsSync(rootPng)) {
      res.setHeader('Content-Type', 'image/png');
      return res.sendFile(rootPng);
    } else if (fs.existsSync(rootJpeg)) {
      res.setHeader('Content-Type', 'image/jpeg');
      return res.sendFile(rootJpeg);
    } else if (fs.existsSync(persistedPath)) {
      res.setHeader('Content-Type', 'image/jpeg');
      return res.sendFile(persistedPath);
    } else if (fs.existsSync(defaultPath)) {
      res.setHeader('Content-Type', 'image/jpeg');
      return res.sendFile(defaultPath);
    } else {
      console.log('[AvatarRequest] Avatar not found anywhere!');
      res.status(404).send('Avatar Not Found');
    }
  });

  // Select a preset/discovered photo to copy as default avatar
  app.post('/api/select-avatar', express.json(), (req, res) => {
    try {
      const { filename } = req.body;
      if (!filename) {
        return res.status(400).json({ error: 'Missing filename' });
      }

      // Safe filename verification to prevent traversal
      const cleanFilename = path.basename(filename);
      const sourcePath = path.join(process.cwd(), 'src', 'assets', 'images', cleanFilename);

      if (!fs.existsSync(sourcePath)) {
        return res.status(404).json({ error: `Source image ${cleanFilename} not found` });
      }

      const buffer = fs.readFileSync(sourcePath);
      
      // Save root backup
      const persistedPath = path.join(process.cwd(), 'avatar_persisted.jpg');
      fs.writeFileSync(persistedPath, buffer);

      // Save to src workspace path
      const targetPath = path.join(process.cwd(), 'src', 'assets', 'images', 'avatar.jpg');
      fs.writeFileSync(targetPath, buffer);

      console.log(`[SelectAvatar] Successfully copied ${cleanFilename} to default paths.`);
      return res.json({ success: true, avatarUrl: '/api/avatar.jpg' });
    } catch (error) {
      console.error('[SelectAvatar] Error:', error);
      return res.status(500).json({ error: 'Failed to copy selected avatar' });
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

  // Helper to save avatar from base64 and auto-center face
  async function saveAvatarFromBase64(base64Str: string): Promise<string | null> {
    const tempInputPath = path.join(process.cwd(), 'temp_uploaded_raw');
    const tempOutputPath = path.join(process.cwd(), 'temp_uploaded_processed.jpg');
    
    try {
      const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return null;
      }
      const mimeType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');
      
      // Determine file extension from mimeType
      let ext = '.png';
      if (mimeType.includes('jpeg') || mimeType.includes('jpg')) {
        ext = '.jpg';
      } else if (mimeType.includes('webp')) {
        ext = '.webp';
      }
      
      const inputPath = tempInputPath + ext;
      fs.writeFileSync(inputPath, buffer);
      
      // Get image size using ImageMagick
      let width = 0;
      let height = 0;
      try {
        const sizeStr = execSync(`identify -format "%w %h" "${inputPath}"`).toString().trim();
        const parts = sizeStr.split(' ');
        width = parseInt(parts[0], 10);
        height = parseInt(parts[1], 10);
      } catch (err) {
        console.error('Error identifying image size:', err);
      }
      
      let cropped = false;
      
      if (width > 0 && height > 0 && process.env.GEMINI_API_KEY) {
        try {
          const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
            httpOptions: {
              headers: {
                'User-Agent': 'aistudio-build',
              }
            }
          });
          
          console.log('[FaceDetection] Analyzing face bounding box with Gemini...');
          const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: [
              {
                inlineData: {
                  mimeType: mimeType.includes('svg') ? 'image/png' : mimeType,
                  data: base64Data
                }
              },
              "Identify the main person's face/head in this image. Output the bounding box [ymin, xmin, ymax, xmax] normalized on a 0-1000 scale."
            ],
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  ymin: { type: Type.INTEGER, description: 'Top boundary on 0-1000 scale' },
                  xmin: { type: Type.INTEGER, description: 'Left boundary on 0-1000 scale' },
                  ymax: { type: Type.INTEGER, description: 'Bottom boundary on 0-1000 scale' },
                  xmax: { type: Type.INTEGER, description: 'Right boundary on 0-1000 scale' },
                },
                required: ['ymin', 'xmin', 'ymax', 'xmax'],
              }
            }
          });
          
          const resultText = response.text || '';
          console.log('[FaceDetection] Gemini response:', resultText);
          const result = JSON.parse(resultText);
          const { ymin, xmin, ymax, xmax } = result;
          
          if (typeof ymin === 'number' && typeof xmin === 'number' && typeof ymax === 'number' && typeof xmax === 'number') {
            const top = Math.round((ymin / 1000) * height);
            const bottom = Math.round((ymax / 1000) * height);
            const left = Math.round((xmin / 1000) * width);
            const right = Math.round((xmax / 1000) * width);
            
            const faceWidth = right - left;
            const faceHeight = bottom - top;
            const faceCenterX = left + faceWidth / 2;
            const faceCenterY = top + faceHeight / 2;
            
            const boundingDimension = Math.max(faceWidth, faceHeight);
            let cropSize = Math.round(boundingDimension * 1.85); // 1.85x is ideal
            cropSize = Math.min(cropSize, width, height);
            
            let xStart = Math.round(faceCenterX - cropSize / 2);
            let yStart = Math.round(faceCenterY - cropSize / 2);
            
            if (xStart < 0) xStart = 0;
            if (yStart < 0) yStart = 0;
            if (xStart + cropSize > width) xStart = width - cropSize;
            if (yStart + cropSize > height) yStart = height - cropSize;
            
            console.log(`[FaceDetection] Cropping at: ${cropSize}x${cropSize}+${xStart}+${yStart}`);
            execSync(`convert "${inputPath}" -crop ${cropSize}x${cropSize}+${xStart}+${yStart} +repage "${tempOutputPath}"`);
            cropped = true;
          }
        } catch (geminiErr) {
          console.error('[FaceDetection] Gemini or crop error, falling back to center-crop:', geminiErr);
        }
      }
      
      if (!cropped && width > 0 && height > 0) {
        // Fallback to simple center crop
        const cropSize = Math.min(width, height);
        const xStart = Math.round((width - cropSize) / 2);
        const yStart = Math.round((height - cropSize) / 2);
        console.log(`[FaceDetection] Fallback center crop: ${cropSize}x${cropSize}+${xStart}+${yStart}`);
        execSync(`convert "${inputPath}" -crop ${cropSize}x${cropSize}+${xStart}+${yStart} +repage "${tempOutputPath}"`);
        cropped = true;
      }
      
      const finalOutputPath = cropped ? tempOutputPath : inputPath;
      const finalBuffer = fs.readFileSync(finalOutputPath);
      
      // Save root backup
      const persistedPath = path.join(process.cwd(), 'avatar_persisted.jpg');
      fs.writeFileSync(persistedPath, finalBuffer);
      
      // Also write back to workspace / static assets
      try {
        const imageDir = path.join(process.cwd(), 'src', 'assets', 'images');
        if (!fs.existsSync(imageDir)) {
          fs.mkdirSync(imageDir, { recursive: true });
        }
        fs.writeFileSync(path.join(imageDir, 'avatar.jpg'), finalBuffer);
        // Also save in root as avatar.jpg so serving route catches it instantly
        fs.writeFileSync(path.join(process.cwd(), 'avatar.jpg'), finalBuffer);
      } catch (wsErr) {
        console.error('Non-blocking: Could not write to src workspace path:', wsErr);
      }
      
      // Cleanup temporary files
      try {
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        if (fs.existsSync(tempOutputPath)) fs.unlinkSync(tempOutputPath);
      } catch (cleanupErr) {
        console.error('Non-blocking cleanup error:', cleanupErr);
      }
      
      return '/api/avatar.jpg';
    } catch (error) {
      console.error('Error saving avatar from base64:', error);
      // Ensure cleanup in case of error
      try {
        const possibleExtensions = ['.png', '.jpg', '.jpeg', '.webp'];
        possibleExtensions.forEach(ext => {
          const pathToCheck = tempInputPath + ext;
          if (fs.existsSync(pathToCheck)) fs.unlinkSync(pathToCheck);
        });
        if (fs.existsSync(tempOutputPath)) fs.unlinkSync(tempOutputPath);
      } catch (e) {}
      return null;
    }
  }

  // Save synchronized portfolio data (includes avatar if it's uploaded as Base64)
  app.post('/api/portfolio-data', express.json({ limit: '50mb' }), async (req, res) => {
    try {
      const { personalInfo, projects } = req.body;
      if (!personalInfo) {
        return res.status(400).json({ error: 'Missing personalInfo' });
      }

      // If avatar is uploaded as Base64, convert and persist it as a real static file
      if (personalInfo.avatar && personalInfo.avatar.startsWith('data:')) {
        const savedPath = await saveAvatarFromBase64(personalInfo.avatar);
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
