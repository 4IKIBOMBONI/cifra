import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { newsApi } from '@/api';
import type { NewsPost } from '@/types/api';
import { ArrowLeft, Calendar as CalendarIcon } from 'lucide-react';

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
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="skeleton h-8 w-64" />
          <div className="skeleton h-64" />
        </div>
      </PageLayout>
    );
  }

  if (!post) {
    return (
      <PageLayout>
        <EmptyState title="Публикация не найдена" />
      </PageLayout>
    );
  }

  const typeConfig: Record<string, { text: string; variant: 'primary' | 'warning' | 'success' }> = {
    news: { text: 'Новость', variant: 'primary' },
    announcement: { text: 'Анонс', variant: 'warning' },
    result: { text: 'Результат', variant: 'success' },
  };
  const tc = typeConfig[post.type] || { text: post.type, variant: 'primary' as const };

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto">
        <Link to="/news" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors mb-6">
          <ArrowLeft size={16} /> Все новости
        </Link>

        <article>
          {post.cover_image_url && (
            <img src={post.cover_image_url} alt={post.title} className="w-full h-72 object-cover rounded-xl mb-6" />
          )}

          <div className="flex items-center gap-3 mb-4">
            <Badge variant={tc.variant} size="md">{tc.text}</Badge>
            {post.published_at && (
              <span className="flex items-center gap-1.5 text-sm text-text-muted">
                <CalendarIcon size={14} />
                {new Date(post.published_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold mb-6 leading-tight">{post.title}</h1>

          <Card hover={false} padding="lg">
            <div className="prose-content" dangerouslySetInnerHTML={{ __html: post.content }} />
          </Card>
        </article>
      </div>
    </PageLayout>
  );
}
