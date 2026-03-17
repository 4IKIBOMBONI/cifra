import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { newsApi } from '@/api';
import type { NewsPost } from '@/types/api';
import { Newspaper } from 'lucide-react';

export function NewsPage() {
  const [news, setNews] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = filter ? { type: filter } : {};
    newsApi.list(params).then(res => {
      setNews(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [filter]);

  const typeConfig = (type: string) => {
    const m: Record<string, { text: string; variant: 'primary' | 'warning' | 'success' }> = {
      news: { text: 'Новость', variant: 'primary' },
      announcement: { text: 'Анонс', variant: 'warning' },
      result: { text: 'Результат', variant: 'success' },
    };
    return m[type] || { text: type, variant: 'primary' as const };
  };

  return (
    <PageLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Новости и анонсы</h1>
        <p className="text-text-muted text-sm">Будь в курсе событий CIFRA</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { key: '', label: 'Все' },
          { key: 'news', label: 'Новости' },
          { key: 'announcement', label: 'Анонсы' },
          { key: 'result', label: 'Результаты' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f.key
                ? 'bg-primary text-white shadow-glow-sm'
                : 'bg-bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-border-light'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="skeleton h-32" />)}
        </div>
      ) : news.length === 0 ? (
        <EmptyState icon={<Newspaper size={28} />} title="Нет публикаций" description="Попробуйте другой фильтр" />
      ) : (
        <div className="space-y-4">
          {news.map(post => {
            const tc = typeConfig(post.type);
            return (
              <Link key={post.id} to={`/news/${post.slug}`}>
                <Card className="group">
                  <div className="flex items-start gap-4">
                    {post.cover_image_url ? (
                      <img src={post.cover_image_url} alt={post.title} className="w-24 h-24 rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className="w-24 h-24 rounded-lg bg-gradient-card flex items-center justify-center shrink-0">
                        <Newspaper size={28} className="text-text-muted" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={tc.variant}>{tc.text}</Badge>
                        {post.published_at && (
                          <span className="text-xs text-text-muted">
                            {new Date(post.published_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-text-muted mt-1 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: post.content.replace(/<[^>]*>/g, ' ').slice(0, 200) }}
                      />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </PageLayout>
  );
}
