import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { auditApi } from '@/api';
import { ChevronLeft, ClipboardList } from 'lucide-react';

export function AdminAudit() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [entityFilter, setEntityFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    const params: any = {};
    if (entityFilter) params.entity_type = entityFilter;
    if (actionFilter) params.action = actionFilter;
    auditApi.list(params).then(res => {
      setLogs(res.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [entityFilter, actionFilter]);

  const actionColor = (action: string) => {
    if (action.includes('create')) return 'text-success';
    if (action.includes('update')) return 'text-accent';
    if (action.includes('delete')) return 'text-error';
    return 'text-text-muted';
  };

  return (
    <PageLayout>
      <Link to="/admin/dashboard" className="text-sm text-text-muted hover:text-primary mb-4 inline-flex items-center gap-1">
        <ChevronLeft size={14} /> Админ-панель
      </Link>
      <h1 className="text-2xl font-bold mb-6">Журнал действий</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <select value={entityFilter} onChange={(e) => setEntityFilter(e.target.value)} className="input-field w-auto">
          <option value="">Все сущности</option>
          <option value="user">Пользователи</option>
          <option value="slot">Слоты</option>
          <option value="booking">Бронирования</option>
          <option value="direction">Направления</option>
          <option value="reward">Награды</option>
          <option value="news">Новости</option>
        </select>
        <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="input-field w-auto">
          <option value="">Все действия</option>
          <option value="create">Создание</option>
          <option value="update">Обновление</option>
          <option value="delete">Удаление</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-2">{[1,2,3,4,5].map(i => <div key={i} className="bg-bg-surface rounded-lg border border-border p-3 animate-pulse h-12" />)}</div>
      ) : logs.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <ClipboardList size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">Журнал пуст</p>
        </div>
      ) : (
        <div className="space-y-1">
          {logs.map((log: any, i: number) => (
            <Card key={log.id || i} hover={false} className="py-2 px-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`text-xs font-mono font-bold ${actionColor(log.action || '')}`}>
                  {log.action}
                </span>
                <span className="text-sm">{log.entity_type}</span>
                {log.details && <span className="text-xs text-text-muted truncate max-w-[300px]">{JSON.stringify(log.details)}</span>}
              </div>
              <span className="text-xs text-text-muted shrink-0">
                {log.created_at ? new Date(log.created_at).toLocaleString('ru-RU') : ''}
              </span>
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
