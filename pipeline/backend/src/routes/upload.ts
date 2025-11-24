import { Router, Request, Response } from 'express';
import { upload, getUploadUrl } from '../utils/upload.js';
import { authenticateToken } from '../middleware/auth.js';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { existsSync, copyFileSync, unlinkSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();
const UPLOAD_DIR = join(__dirname, '../uploads');
const PUBLIC_DIR = join(__dirname, '../public/uploads');

// Ensure public directory exists
if (!existsSync(PUBLIC_DIR)) {
  mkdirSync(PUBLIC_DIR, { recursive: true });
}

// Upload multiple images (protected)
router.post('/images', authenticateToken, upload.array('images', 10), (req: Request, res: Response) => {
  try {
    if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const files = Array.isArray(req.files) ? req.files : [req.files];
    const uploadedFiles = files.map((file: Express.Multer.File) => {
      // Copy to public directory for serving
      const publicPath = join(PUBLIC_DIR, file.filename);
      copyFileSync(file.path, publicPath);
      
      return {
        filename: file.filename,
        originalName: file.originalname,
        url: getUploadUrl(file.filename),
        size: file.size,
      };
    });

    res.json({
      success: true,
      files: uploadedFiles,
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
});

// Delete uploaded image (protected)
router.delete('/images/:filename', authenticateToken, (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    const uploadPath = join(UPLOAD_DIR, filename);
    const publicPath = join(PUBLIC_DIR, filename);

    if (existsSync(uploadPath)) {
      unlinkSync(uploadPath);
    }
    if (existsSync(publicPath)) {
      unlinkSync(publicPath);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

export default router;

