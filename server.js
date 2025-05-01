import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const argv = process.argv.slice(2);

let cliImgDir = null;
const dirFlag = argv.findIndex(a => a === '--img-dir' || a === '-d');
if (dirFlag !== -1 && argv[dirFlag + 1]) {
  cliImgDir = argv[dirFlag + 1];
}
const IMAGE_DIR = cliImgDir || process.env.KIOSK_IMG_DIR || 'img';

let cliPort = null;
const portFlag = argv.findIndex(a => a === '--port' || a === '-p');
if (portFlag !== -1 && argv[portFlag + 1]) {
  cliPort = Number(argv[portFlag + 1]);
}
const PORT = cliPort || Number(process.env.PORT) || 3000;

let cliHost = null;
const hostFlag = argv.findIndex(a => a === '--host' || a === '-h');
if (hostFlag !== -1 && argv[hostFlag + 1]) {
  cliHost = argv[hostFlag + 1];
}
const HOST = cliHost || process.env.HOST || 'localhost';

const app = express();

app.use('/', express.static('public'));
app.use('/img', express.static(IMAGE_DIR));

app.get('/images', (_req, res) => {
  const files = fs.readdirSync(IMAGE_DIR)
    .filter(f => /\.(png|jpe?g|gif|webp|svg)$/i.test(f))
    .map(f => `/img/${encodeURIComponent(f)}`);
  res.json(files);
});

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
  console.log(`Serving images from: ${IMAGE_DIR}`);
});