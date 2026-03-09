import { useEffect, useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { rewardsApi } from '@/api';
import { useAuthStore } from '@/store/authStore';
import type { Reward, RewardRequest } from '@/types/api';
import { Gift, ShoppingBag } from 'lucide-react';

export function RewardsPage() {
  const { user } = useAuthStore();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [myRequests, setMyRequests] = useState<RewardRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState<string | null>(null);
  const [tab, setTab] = useState<'catalog' | 'my'>('catalog');

  useEffect(() => {
    Promise.all([
      rewardsApi.list(),
      rewardsApi.myRequests(),
    ]).then(([rRes, mrRes]) => {
      setRewards(rRes.data);
      setMyRequests(mrRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleRequest = async (rewardId: string) => {
    if (!confirm('Обменять баллы на эту награду?')) return;
    setRequesting(rewardId);
    try {
      await rewardsApi.request(rewardId);
      const [rRes, mrRes] = await Promise.all([
        rewardsApi.list(),
        rewardsApi.myRequests(),
      ]);
      setRewards(rRes.data);
      setMyRequests(mrRes.data);
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Ошибка запроса');
    }
    setRequesting(null);
  };

  const statusLabel = (status: string) => {
    const m: Record<string, { text: string; cls: string }> = {
      pending: { text: 'Ожидает', cls: 'text-accent' },
      issued: { text: 'Выдано', cls: 'text-success' },
      rejected: { text: 'Отклонено', cls: 'text-error' },
    };
    return m[status] || { text: status, cls: 'text-text-muted' };
  };

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Награды</h1>
        <div className="text-right">
          <p className="text-sm text-text-muted">Мои баллы</p>
          <p className="text-xl font-bold font-accent text-primary">{user?.rating_score ?? 0}</p>
        </div>
      </div>

      <div className="flex gap-1 mb-6 bg-bg-surface rounded-lg p-1 border border-border w-fit">
        {[
          { key: 'catalog' as const, label: 'Каталог' },
          { key: 'my' as const, label: `Мои запросы (${myRequests.length})` },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === t.key ? 'bg-primary text-white' : 'text-text-secondary hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-bg-surface rounded-lg border border-border p-4 animate-pulse h-48" />
          ))}
        </div>
      ) : tab === 'catalog' ? (
        rewards.length === 0 ? (
          <div className="text-center py-16 text-text-muted">
            <Gift size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">Нет доступных наград</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map(reward => {
              const canAfford = (user?.rating_score ?? 0) >= reward.cost_points;
              const inStock = reward.stock > 0;

              return (
                <Card key={reward.id} hover={false} className="flex flex-col">
                  {reward.photo_url ? (
                    <img src={reward.photo_url} alt={reward.name} className="w-full h-40 object-cover rounded-lg mb-3" />
                  ) : (
                    <div className="w-full h-40 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-3 flex items-center justify-center">
                      <Gift size={48} className="text-text-muted" />
                    </div>
                  )}
                  <h3 className="font-semibold mb-1">{reward.name}</h3>
                  <p className="text-sm text-text-secondary flex-1">{reward.description}</p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                    <div>
                      <p className="text-lg font-bold font-accent text-primary">{reward.cost_points} б.</p>
                      <p className="text-xs text-text-muted">В наличии: {reward.stock}</p>
                    </div>
                    <Button
                      size="sm"
                      disabled={!canAfford || !inStock}
                      loading={requesting === reward.id}
                      onClick={() => handleRequest(reward.id)}
                    >
                      {!inStock ? 'Нет в наличии' : !canAfford ? 'Не хватает' : 'Обменять'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )
      ) : (
        myRequests.length === 0 ? (
          <div className="text-center py-16 text-text-muted">
            <ShoppingBag size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">Нет запросов на награды</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myRequests.map(req => {
              const reward = rewards.find(r => r.id === req.reward_id);
              const st = statusLabel(req.status);
              return (
                <Card key={req.id} hover={false} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{reward?.name || 'Награда'}</p>
                    <p className="text-xs text-text-muted">
                      {new Date(req.created_at).toLocaleDateString('ru-RU')} · {req.points_spent} баллов
                    </p>
                  </div>
                  <span className={`font-medium text-sm ${st.cls}`}>{st.text}</span>
                </Card>
              );
            })}
          </div>
        )
      )}
    </PageLayout>
  );
}
