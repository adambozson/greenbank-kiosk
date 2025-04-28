import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(__dirname));
app.use('/img', express.static(path.join(__dirname, 'img')));

app.get('/images', (req, res) => {
  const files = fs.readdirSync(path.join(__dirname, 'img'))
    .filter(f => /\.(png|jpe?g|gif|webp|svg)$/i.test(f))
    .map(f => `/img/${encodeURIComponent(f)}`);
  res.json(files);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});