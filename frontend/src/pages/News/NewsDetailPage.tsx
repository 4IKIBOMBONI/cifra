import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { newsApi } from '@/api';
import type { NewsPost } from '@/types/api';

export function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<NewsPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    newsApi.get(slug).then(res => {
      setPost(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <PageLayout>
        <div className="space-y-4">
          <div className="h-8 w-64 bg-bg-surface rounded animate-pulse" />
          <div className="h-64 bg-bg-surface rounded-lg animate-pulse" />
        </div>
      </PageLayout>
    );
  }

  if (!post) {
    return (
      <PageLayout>
        <div className="text-center py-16 text-text-muted">
          <p className="text-lg">Публикация не найдена</p>
          <Link to="/news" className="text-primary mt-2 inline-block">Все новости</Link>
        </div>
      </PageLayout>
    );
  }

  const typeLabel: Record<string, string> = {
    news: 'Новость',
    announcement: 'Анонс',
    result: 'Результат',
  };

  return (
    <PageLayout>
      <Link to="/news" className="text-sm text-text-muted hover:text-primary mb-4 inline-block">
        ← Все новости
      </Link>

      <article>
        {post.cover_image_url && (
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full h-64 object-cover rounded-xl mb-6"
          />
        )}

        <div className="flex items-center gap-3 mb-4">
          <span className="badge bg-primary/10 text-primary">{typeLabel[post.type] || post.type}</span>
          {post.published_at && (
            <span className="text-sm text-text-muted">
              {new Date(post.published_at).toLocaleDateString('ru-RU', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold mb-6">{post.title}</h1>

        <Card hover={false}>
          <div
            className="prose prose-invert max-w-none text-text-primary
              [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3
              [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2
              [&_p]:mb-3 [&_p]:text-text-secondary [&_p]:leading-relaxed
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3
              [&_li]:mb-1 [&_li]:text-text-secondary
              [&_strong]:text-white [&_strong]:font-semibold"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </Card>
      </article>
    </PageLayout>
  );
}
