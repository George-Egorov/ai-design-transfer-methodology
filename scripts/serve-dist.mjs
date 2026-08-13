import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';

const host = process.env.HOST || '127.0.0.1';
const port = Number.parseInt(process.env.PORT || '4322', 10);
const base = (process.env.SITE_BASE || '/bridge-design-methodology').replace(/\/$/u, '');
const root = path.resolve('dist');

const mimeTypes = new Map([
  ['.avif', 'image/avif'],
  ['.css', 'text/css; charset=utf-8'],
  ['.gif', 'image/gif'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml; charset=utf-8'],
  ['.webmanifest', 'application/manifest+json; charset=utf-8'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
  ['.xml', 'application/xml; charset=utf-8'],
]);

const resolveRequest = async (requestUrl = '/') => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(requestUrl, `http://${host}`).pathname);
  } catch {
    return null;
  }

  if (base && pathname !== base && !pathname.startsWith(`${base}/`)) return null;
  const relativeUrl = base ? pathname.slice(base.length) : pathname;
  const relativePath = relativeUrl.replace(/^\/+|\/+$/gu, '');
  let candidate = path.resolve(root, relativePath || '.');
  const relativeToRoot = path.relative(root, candidate);
  if (relativeToRoot.startsWith('..') || path.isAbsolute(relativeToRoot)) return null;

  try {
    const info = await stat(candidate);
    if (info.isDirectory()) candidate = path.join(candidate, 'index.html');
    const fileInfo = await stat(candidate);
    return fileInfo.isFile() ? { path: candidate, size: fileInfo.size } : null;
  } catch {
    return null;
  }
};

const server = createServer(async (request, response) => {
  const file = await resolveRequest(request.url);
  if (!file) {
    const fallback = path.join(root, '404.html');
    response.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
    createReadStream(fallback).pipe(response);
    return;
  }

  const type = mimeTypes.get(path.extname(file.path).toLowerCase()) || 'application/octet-stream';
  response.writeHead(200, {
    'cache-control': 'no-store',
    'content-length': file.size,
    'content-type': type,
  });
  if (request.method === 'HEAD') response.end();
  else createReadStream(file.path).pipe(response);
});

server.listen(port, host, () => {
  process.stdout.write(`Serving ${root} at http://${host}:${port}${base}/\n`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
