import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

const BLOGS_DIR = path.join(process.cwd(), 'content', 'blogs');

marked.setOptions({
  gfm: true,
  breaks: true,
});

function toSlug(fileName) {
  return fileName.replace(/\.(md|mdx)$/i, '');
}

function normalizePost(fileName, frontMatter, markdownContent) {
  const slug = toSlug(fileName);
  const title = frontMatter.title || slug;
  const date = frontMatter.date || null;
  const excerpt = frontMatter.excerpt || '';
  const coverImage = frontMatter.coverImage || null;
  const contentHtml = marked.parse(markdownContent);

  return {
    slug,
    title,
    date,
    excerpt,
    coverImage,
    contentHtml,
  };
}

async function getBlogFileNames() {
  try {
    const files = await readdir(BLOGS_DIR);
    return files.filter((fileName) => /\.(md|mdx)$/i.test(fileName));
  } catch {
    return [];
  }
}

export async function getAllBlogPosts() {
  const fileNames = await getBlogFileNames();

  const posts = await Promise.all(
    fileNames.map(async (fileName) => {
      const fullPath = path.join(BLOGS_DIR, fileName);
      const rawContent = await readFile(fullPath, 'utf8');
      const { data, content } = matter(rawContent);

      return normalizePost(fileName, data, content);
    })
  );

  return posts.sort((postA, postB) => {
    if (!postA.date || !postB.date) return 0;
    return new Date(postB.date).getTime() - new Date(postA.date).getTime();
  });
}

export async function getBlogPostBySlug(slug) {
  const fileNames = await getBlogFileNames();
  const matchedFileName = fileNames.find((fileName) => toSlug(fileName) === slug);

  if (!matchedFileName) {
    return null;
  }

  const fullPath = path.join(BLOGS_DIR, matchedFileName);
  const rawContent = await readFile(fullPath, 'utf8');
  const { data, content } = matter(rawContent);

  return normalizePost(matchedFileName, data, content);
}

export async function getAllBlogSlugs() {
  const fileNames = await getBlogFileNames();
  return fileNames.map((fileName) => toSlug(fileName));
}
