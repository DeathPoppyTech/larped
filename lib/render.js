import { readFile } from 'fs/promises';
import { join } from 'path';

export const renderTemplate = async (templateName, title, replacements = {}) => {
  const filePath = join(process.cwd(), `${templateName}.html`);
  let content = await readFile(filePath, 'utf8');

  for (const [key, value] of Object.entries(replacements)) {
    content = content.replaceAll(`{{${key}}}`, value);
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-zinc-950 text-zinc-100 font-sans min-h-screen flex flex-col justify-between">
  ${content}
</body>
</html>
  `;
};
