import { renderTemplate } from '../lib/render.js';

export default async function handler(req, res) {
  const page = await renderTemplate('index', 'Larpmail - Home');
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(page);
}
