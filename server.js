import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the dist folder
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback - serve index.html for any unknown route so client-side routing works
// Use app.use(...) instead of app.get('*', ...) to avoid path-to-regexp issues with Express 5
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});

