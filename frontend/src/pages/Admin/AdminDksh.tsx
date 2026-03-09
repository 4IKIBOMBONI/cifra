import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { dkshApi } from '@/api';
import type { DkshProfile } from '@/types/api';
import { ChevronLeft, FileText } from 'lucide-react';

export function AdminDksh() {
  const [candidates, setCandidates] = useState<DkshProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dkshApi.candidates().then(res => {
      setCandidates(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <PageLayout>
      <Link to="/admin/dashboard" className="text-sm text-text-muted hover:text-primary mb-4 inline-flex items-center gap-1">
        <ChevronLeft size={14} /> Админ-панель
      </Link>
      <h1 className="text-2xl font-bold mb-6">Кандидаты ДКШ</h1>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="bg-bg-surface rounded-lg border border-border p-4 animate-pulse h-24" />)}</div>
      ) : candidates.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <FileText size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">Нет кандидатов</p>
        </div>
      ) : (
        <div className="space-y-3">
          {candidates.map(c => (
            <Card key={c.id} hover={false}>
              <div className="flex items-start justify-between">
                <div>
                  {c.about && <p className="text-sm mb-2">{c.about}</p>}
                  <div className="space-y-1">
                    {c.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-text-muted">Навыки:</span>
                        {c.skills.map((s, i) => (
                          <span key={i} className="badge bg-primary/10 text-primary text-xs">{s}</span>
                        ))}
                      </div>
                    )}
                    {c.interests.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-text-muted">Интересы:</span>
                        {c.interests.map((s, i) => (
                          <span key={i} className="badge bg-secondary/10 text-secondary text-xs">{s}</span>
                        ))}
                      </div>
                    )}
                    {c.achievements.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-text-muted">Достижения:</span>
                        {c.achievements.map((s, i) => (
                          <span key={i} className="badge bg-accent/10 text-accent text-xs">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 mt-2 text-xs text-text-muted">
                    {c.contact_telegram && <span>TG: {c.contact_telegram}</span>}
                    {c.contact_vk && <span>VK: {c.contact_vk}</span>}
                    {c.contact_phone && <span>Тел: {c.contact_phone}</span>}
                  </div>
                </div>
                <span className={`badge text-xs ${c.is_active ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                  {c.is_active ? 'Активна' : 'Неактивна'}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
