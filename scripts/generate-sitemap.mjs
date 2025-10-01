import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const siteUrl = 'https://brincareducando.com.br';

// Get all MDX posts
const postsDir = path.join(__dirname, '../src/content/posts');
const landingsDir = path.join(__dirname, '../src/pages/landings');

function getMDXFiles(dir) {
  try {
    return fs.readdirSync(dir)
      .filter(file => file.endsWith('.mdx'))
      .map(file => {
        const slug = file.replace('.mdx', '');
        const stats = fs.statSync(path.join(dir, file));
        return {
          slug,
          lastmod: stats.mtime.toISOString().split('T')[0],
        };
      });
  } catch (err) {
    return [];
  }
}

const posts = getMDXFiles(postsDir);
const landings = getMDXFiles(landingsDir);

// Static pages
const staticPages = [
  { url: '/', changefreq: 'weekly', priority: '1.0' },
  { url: '/blog', changefreq: 'daily', priority: '0.9' },
  { url: '/loja', changefreq: 'daily', priority: '0.9' },
  { url: '/sobre', changefreq: 'monthly', priority: '0.7' },
  { url: '/produtos-recomendados', changefreq: 'weekly', priority: '0.8' },
  { url: '/politica-privacidade', changefreq: 'yearly', priority: '0.3' },
  { url: '/termos-de-uso', changefreq: 'yearly', priority: '0.3' },
];

// Generate sitemap XML
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
`;

// Add static pages
staticPages.forEach(page => {
  sitemap += `
  <url>
    <loc>${siteUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
});

// Add blog posts
posts.forEach(post => {
  sitemap += `
  <url>
    <loc>${siteUrl}/blog/${post.slug}</loc>
    <lastmod>${post.lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
});

// Add landing pages
landings.forEach(landing => {
  sitemap += `
  <url>
    <loc>${siteUrl}/landings/${landing.slug}</loc>
    <lastmod>${landing.lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
});

sitemap += `
</urlset>`;

// Write sitemap to public folder
const outputPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(outputPath, sitemap);

console.log('✅ Sitemap gerado com sucesso!');
console.log(`📄 ${posts.length} posts de blog`);
console.log(`📄 ${landings.length} landing pages`);
console.log(`📄 ${staticPages.length} páginas estáticas`);
console.log(`📍 Salvo em: ${outputPath}`);
