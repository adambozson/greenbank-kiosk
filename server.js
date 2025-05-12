import express from 'express';
import fs from 'fs';

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
app.use('/placeholder', express.static('img'));
app.use(
  '/img',
  express.static(IMAGE_DIR, {
    etag: false,
    lastModified: false,
    maxAge: 0,
    setHeaders: (res) => res.set('Cache-Control', 'no-store'),
  })
);

app.get('/images', (_req, res) => {
  let files;
  try {
    files = fs.readdirSync(IMAGE_DIR)
      .filter(f => /\.(png|jpe?g|gif|webp|svg)$/i.test(f))
      .map(f => `/img/${encodeURIComponent(f)}`);
  } catch (err) {
    console.error(err);
    files = [];
  }

  // If no images are found in the specified directory,
  // fall back to the placeholder directory (pics of doggos)
  if (files.length === 0) {
    files = fs.readdirSync('img')
      .filter(f => /\.(png|jpe?g|gif|webp|svg)$/i.test(f))
      .map(f => `/placeholder/${encodeURIComponent(f)}`);
  }

  res.json(files);
});

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
  console.log(`Serving images from: ${IMAGE_DIR}`);
});