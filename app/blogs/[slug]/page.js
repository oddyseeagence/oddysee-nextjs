import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllBlogSlugs, getBlogPostBySlug } from '../../lib/blog-posts';
import styles from '../blogs-shell.module.css';

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article introuvable',
    };
  }

  return {
    title: post.title || 'Article',
    alternates: {
      canonical: `/blogs/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const featuredImage = post.coverImage;

  return (
    <main className={styles.blogMain}>
      <p style={{ marginBottom: '1rem' }}>
        <Link href="/blogs" className={styles.backLink}>← Retour aux articles</Link>
      </p>

      <h1 className={styles.blogTitle} style={{ marginBottom: '0.5rem' }}>{post.title || 'Sans titre'}</h1>
      <p className={styles.meta} style={{ marginBottom: '1.2rem' }}>{post.date ? `Créé le ${formatDate(post.date)}` : ''}</p>

      {featuredImage && (
        <img
          src={featuredImage}
          alt={post.title || 'Image article'}
          className={styles.heroImage}
        />
      )}

      <article className={styles.contentHtml} dangerouslySetInnerHTML={{ __html: post.contentHtml || '' }} />
    </main>
  );
}
