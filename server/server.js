import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/api.js';
import './services/firebaseAdmin.js'; // ensure admin is initialized

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cookieParser());
app.use(cors());
app.use(express.json());

// Mount API before static assets so /api/* are handled by Express
app.use('/api', apiRouter);

// Serve static files from the project root dist folder
const staticRoot = path.join(__dirname, '..', 'dist');
app.use(express.static(staticRoot));

// SPA fallback - serve index.html for unknown routes
app.use((req, res) => {
    res.sendFile(path.join(staticRoot, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});

