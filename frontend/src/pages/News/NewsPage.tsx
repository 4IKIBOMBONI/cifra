import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
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

  const typeLabel = (type: string) => {
    const m: Record<string, { text: string; cls: string }> = {
      news: { text: 'Новость', cls: 'bg-primary/10 text-primary' },
      announcement: { text: 'Анонс', cls: 'bg-accent/10 text-accent' },
      result: { text: 'Результат', cls: 'bg-success/10 text-success' },
    };
    return m[type] || { text: type, cls: 'bg-bg-elevated text-text-secondary' };
  };

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6">Новости и анонсы</h1>

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
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.key
                ? 'bg-primary text-white'
                : 'bg-bg-surface border border-border text-text-secondary hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-bg-surface rounded-lg border border-border p-6 animate-pulse h-32" />
          ))}
        </div>
      ) : news.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <Newspaper size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">Нет публикаций</p>
        </div>
      ) : (
        <div className="space-y-4">
          {news.map(post => {
            const tl = typeLabel(post.type);
            return (
              <Link key={post.id} to={`/news/${post.slug}`}>
                <Card className="group">
                  <div className="flex items-start gap-4">
                    {post.cover_image_url ? (
                      <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="w-24 h-24 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shrink-0">
                        <Newspaper size={32} className="text-text-muted" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`badge text-xs ${tl.cls}`}>{tl.text}</span>
                        {post.published_at && (
                          <span className="text-xs text-text-muted">
                            {new Date(post.published_at).toLocaleDateString('ru-RU', {
                              day: 'numeric', month: 'long', year: 'numeric'
                            })}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-text-secondary mt-1 line-clamp-2"
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
