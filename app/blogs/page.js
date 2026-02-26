import Link from 'next/link';
import { getAllBlogPosts } from '../lib/blog-posts';
import styles from './blogs-shell.module.css';

export const metadata = {
  title: 'Blog',
  alternates: {
    canonical: '/blogs',
  },
};

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default async function BlogsPage() {
  const posts = await getAllBlogPosts();

  return (
    <main style={{ width: '100%', margin: '0 auto', paddingTop: '3rem', paddingBottom: '4rem', paddingLeft: 'clamp(20px, 6vw, 100px)', paddingRight: 'clamp(20px, 6vw, 100px)' }}>
      <div className="solutions-header" style={{ maxWidth: '100%', paddingTop: 0, marginBottom: '22px', textAlign: 'center' }}>
        <h1 style={{ paddingBottom: '1.7rem' }}>
          Explorez nos dernières <span className="solutions-h2">Blogs</span>
        </h1>
      </div>

      {posts.length === 0 && <p>Aucun article trouvé. Ajoutez un fichier `.md` dans `content/blogs`.</p>}

      <section className={styles.blogsGrid}>
        {posts.map((post) => {
          return (
            <article key={post.slug} className="solution-card" style={{ padding: '20px 20px' }}>
              {post.coverImage && (
                <Link href={`/blogs/${post.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
                  <img
                    src={post.coverImage}
                    alt={post.title || 'Image article'}
                    style={{ width: '100%', height: '190px', objectFit: 'cover', borderRadius: '10px', marginBottom: '14px' }}
                  />
                </Link>
              )}
              <p style={{ fontSize: '14px', opacity: 0.7, marginBottom: '8px' }}>{post.date ? `Créé le ${formatDate(post.date)}` : ''}</p>
              <Link href={`/blogs/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3 style={{ marginBottom: '8px' }}>{post.title ? (post.title.length > 60 ? post.title.slice(0, 60) + '…' : post.title) : 'Sans titre'}</h3>
              </Link>
              <p>{post.excerpt ? (post.excerpt.length > 90 ? post.excerpt.slice(0, 90) + '…' : post.excerpt) : 'Découvrez cet article.'}</p>
              <p style={{ marginTop: '14px' }}>
                <Link href={`/blogs/${post.slug}`} style={{ color: '#632BC5', textDecoration: 'none', fontWeight: 600 }}>
                  Lire l’article →
                </Link>
              </p>
            </article>
          );
        })}
      </section>

    </main>
  );
}
