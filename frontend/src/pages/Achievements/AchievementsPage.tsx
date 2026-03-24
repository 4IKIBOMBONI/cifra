import { useState, useEffect, useCallback } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/store/authStore';
import { useI18n } from '@/store/i18nStore';
import {
  Trophy, Target, Users, Flame, Gamepad2, Zap, Star, Medal,
  Calendar, BookOpen, Award, Shield, Crown, Rocket, Heart,
  CheckCircle2, Lock
} from 'lucide-react';

interface Achievement {
  id: string;
  icon: React.ReactNode;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  category: 'activity' | 'social' | 'mastery' | 'special';
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xp: number;
}

const rarityConfig = {
  common: { label: 'Обычное', labelEn: 'Common', color: 'text-text-secondary', border: 'border-border', bg: 'bg-bg-elevated', glow: '' },
  rare: { label: 'Редкое', labelEn: 'Rare', color: 'text-blue-400', border: 'border-blue-400/30', bg: 'bg-blue-500/5', glow: 'shadow-[0_0_15px_rgba(96,165,250,0.15)]' },
  epic: { label: 'Эпическое', labelEn: 'Epic', color: 'text-purple-400', border: 'border-purple-400/30', bg: 'bg-purple-500/5', glow: 'shadow-[0_0_20px_rgba(168,85,247,0.2)]' },
  legendary: { label: 'Легендарное', labelEn: 'Legendary', color: 'text-amber-400', border: 'border-amber-400/30', bg: 'bg-amber-500/5', glow: 'shadow-[0_0_25px_rgba(251,191,36,0.2)]' },
};

const categoryConfig = {
  activity: { label: 'Активность', labelEn: 'Activity', color: 'primary' },
  social: { label: 'Социальное', labelEn: 'Social', color: 'accent' },
  mastery: { label: 'Мастерство', labelEn: 'Mastery', color: 'success' },
  special: { label: 'Особое', labelEn: 'Special', color: 'warning' },
};

function generateAchievements(ratingScore: number): Achievement[] {
  const score = ratingScore ?? 0;

  return [
    {
      id: 'first_visit',
      icon: <Rocket size={24} />,
      title: 'Первый визит',
      titleEn: 'First Visit',
      description: 'Посети своё первое занятие',
      descriptionEn: 'Attend your first session',
      category: 'activity',
      progress: score > 0 ? 1 : 0,
      maxProgress: 1,
      unlocked: score > 0,
      unlockedAt: score > 0 ? '2025-09-15' : undefined,
      rarity: 'common',
      xp: 10,
    },
    {
      id: 'regular',
      icon: <Calendar size={24} />,
      title: 'Завсегдатай',
      titleEn: 'Regular',
      description: 'Посети 10 занятий',
      descriptionEn: 'Attend 10 sessions',
      category: 'activity',
      progress: Math.min(10, Math.floor(score / 10)),
      maxProgress: 10,
      unlocked: score >= 100,
      unlockedAt: score >= 100 ? '2025-11-20' : undefined,
      rarity: 'rare',
      xp: 50,
    },
    {
      id: 'streak_5',
      icon: <Flame size={24} />,
      title: 'Горящий стрик',
      titleEn: 'On Fire',
      description: '5 посещений подряд без пропусков',
      descriptionEn: '5 consecutive visits without missing',
      category: 'activity',
      progress: Math.min(5, Math.floor(score / 14)),
      maxProgress: 5,
      unlocked: score >= 70,
      unlockedAt: score >= 70 ? '2025-10-28' : undefined,
      rarity: 'rare',
      xp: 30,
    },
    {
      id: 'team_player',
      icon: <Users size={24} />,
      title: 'Командный игрок',
      titleEn: 'Team Player',
      description: 'Создай свою первую команду',
      descriptionEn: 'Create your first team',
      category: 'social',
      progress: 1,
      maxProgress: 1,
      unlocked: true,
      unlockedAt: '2025-10-05',
      rarity: 'common',
      xp: 15,
    },
    {
      id: 'multisport',
      icon: <Gamepad2 size={24} />,
      title: 'Мультиспортсмен',
      titleEn: 'Multi-sport',
      description: 'Посети занятия по 3+ направлениям',
      descriptionEn: 'Attend sessions in 3+ directions',
      category: 'mastery',
      progress: 2,
      maxProgress: 3,
      unlocked: false,
      rarity: 'epic',
      xp: 50,
    },
    {
      id: 'champion',
      icon: <Trophy size={24} />,
      title: 'Чемпион',
      titleEn: 'Champion',
      description: 'Займи 1 место в турнире',
      descriptionEn: 'Win 1st place in a tournament',
      category: 'mastery',
      progress: 0,
      maxProgress: 1,
      unlocked: false,
      rarity: 'legendary',
      xp: 100,
    },
    {
      id: 'top10',
      icon: <Crown size={24} />,
      title: 'Элита',
      titleEn: 'Elite',
      description: 'Войди в топ-10 рейтинга',
      descriptionEn: 'Reach top-10 in the leaderboard',
      category: 'mastery',
      progress: score >= 70 ? 1 : 0,
      maxProgress: 1,
      unlocked: score >= 70,
      unlockedAt: score >= 70 ? '2025-11-15' : undefined,
      rarity: 'epic',
      xp: 50,
    },
    {
      id: 'scholar',
      icon: <BookOpen size={24} />,
      title: 'Учёный',
      titleEn: 'Scholar',
      description: 'Изучи 5 обучающих материалов',
      descriptionEn: 'Study 5 learning materials',
      category: 'activity',
      progress: 3,
      maxProgress: 5,
      unlocked: false,
      rarity: 'rare',
      xp: 25,
    },
    {
      id: 'helper',
      icon: <Heart size={24} />,
      title: 'Наставник',
      titleEn: 'Mentor',
      description: 'Заполни анкету ДКШ',
      descriptionEn: 'Fill out the DKSh profile',
      category: 'social',
      progress: 1,
      maxProgress: 1,
      unlocked: true,
      unlockedAt: '2025-10-10',
      rarity: 'rare',
      xp: 20,
    },
    {
      id: 'collector',
      icon: <Star size={24} />,
      title: 'Коллекционер',
      titleEn: 'Collector',
      description: 'Получи 3 награды из магазина',
      descriptionEn: 'Redeem 3 rewards from the shop',
      category: 'special',
      progress: 1,
      maxProgress: 3,
      unlocked: false,
      rarity: 'epic',
      xp: 40,
    },
    {
      id: 'perfect_week',
      icon: <Zap size={24} />,
      title: 'Идеальная неделя',
      titleEn: 'Perfect Week',
      description: 'Используй все 5 слотов за неделю',
      descriptionEn: 'Use all 5 weekly booking slots',
      category: 'activity',
      progress: 3,
      maxProgress: 5,
      unlocked: false,
      rarity: 'rare',
      xp: 35,
    },
    {
      id: 'legend',
      icon: <Shield size={24} />,
      title: 'Легенда CIFRA',
      titleEn: 'CIFRA Legend',
      description: 'Набери 200+ баллов рейтинга',
      descriptionEn: 'Reach 200+ rating points',
      category: 'special',
      progress: Math.min(200, score),
      maxProgress: 200,
      unlocked: score >= 200,
      rarity: 'legendary',
      xp: 150,
    },
  ];
}

function ConfettiEffect({ active }: { active: boolean }) {
  if (!active) return null;

  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1 + Math.random() * 1.5,
    size: 4 + Math.random() * 8,
    color: ['#A855F7', '#EC4899', '#22D3EE', '#FBBF24', '#34D399', '#818CF8'][Math.floor(Math.random() * 6)],
    rotation: Math.random() * 360,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute animate-confetti"
          style={{
            left: `${p.x}%`,
            top: '-10px',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}

function AchievementCard({ achievement, isRu, onClick }: {
  achievement: Achievement;
  isRu: boolean;
  onClick: () => void;
}) {
  const rarity = rarityConfig[achievement.rarity];
  const progressPct = (achievement.progress / achievement.maxProgress) * 100;

  return (
    <div onClick={onClick} className="cursor-pointer">
      <Card
        hover={false}
        className={`relative overflow-hidden transition-all duration-300 ${
          achievement.unlocked
            ? `${rarity.border} ${rarity.glow} border hover:scale-[1.02]`
            : 'opacity-60 grayscale hover:opacity-80 hover:grayscale-[50%]'
        }`}
      >
        {/* Rarity stripe */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 ${
            achievement.rarity === 'legendary' ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 animate-shimmer' :
            achievement.rarity === 'epic' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
            achievement.rarity === 'rare' ? 'bg-gradient-to-r from-blue-400 to-cyan-400' :
            'bg-border'
          }`}
        />

        <div className="flex items-start gap-4 pt-1">
          {/* Icon */}
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
            achievement.unlocked ? rarity.bg : 'bg-bg-elevated'
          } ${achievement.unlocked ? rarity.color : 'text-text-muted'}`}>
            {achievement.unlocked ? achievement.icon : <Lock size={24} />}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm truncate">
                {isRu ? achievement.title : achievement.titleEn}
              </h3>
              {achievement.unlocked && (
                <CheckCircle2 size={14} className="text-success shrink-0" />
              )}
            </div>
            <p className="text-xs text-text-muted line-clamp-1 mb-2">
              {isRu ? achievement.description : achievement.descriptionEn}
            </p>

            {/* Progress bar */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    achievement.unlocked
                      ? 'bg-gradient-to-r from-primary to-secondary'
                      : 'bg-text-muted/30'
                  }`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-[10px] text-text-muted font-mono shrink-0">
                {achievement.progress}/{achievement.maxProgress}
              </span>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-2">
              <span className={`text-[10px] font-medium ${rarity.color}`}>
                {isRu ? rarity.label : rarity.labelEn}
              </span>
              <span className="text-[10px] text-text-muted">
                +{achievement.xp} XP
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function AchievementsPage() {
  const { user } = useAuthStore();
  const { locale } = useI18n();
  const isRu = locale === 'ru';

  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const achievements = generateAchievements(user?.rating_score ?? 0);

  const filtered = achievements.filter(a => {
    if (filter === 'unlocked' && !a.unlocked) return false;
    if (filter === 'locked' && a.unlocked) return false;
    if (categoryFilter && a.category !== categoryFilter) return false;
    return true;
  });

  const totalXP = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.xp, 0);
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  const handleAchievementClick = useCallback((a: Achievement) => {
    setSelectedAchievement(a);
    if (a.unlocked) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2500);
    }
  }, []);

  return (
    <PageLayout>
      <ConfettiEffect active={showConfetti} />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">
          {isRu ? 'Достижения' : 'Achievements'}
        </h1>
        <p className="text-text-muted text-sm">
          {isRu ? 'Выполняй задания, получай бейджи и XP' : 'Complete challenges, earn badges and XP'}
        </p>
      </div>

      {/* Stats bar */}
      <Card hover={false} className="mb-6 neon-border">
        <div className="flex flex-wrap items-center gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold font-accent gradient-text">{unlockedCount}</p>
            <p className="text-xs text-text-muted">{isRu ? 'Открыто' : 'Unlocked'}</p>
          </div>
          <div className="w-px h-10 bg-border hidden sm:block" />
          <div className="text-center">
            <p className="text-3xl font-bold font-accent text-primary">{totalXP}</p>
            <p className="text-xs text-text-muted">XP</p>
          </div>
          <div className="w-px h-10 bg-border hidden sm:block" />
          <div className="flex-1">
            <div className="flex justify-between text-xs text-text-muted mb-1">
              <span>{isRu ? 'Прогресс' : 'Progress'}</span>
              <span>{unlockedCount}/{achievements.length}</span>
            </div>
            <div className="h-3 bg-bg-elevated rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-1000"
                style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { key: 'all' as const, label: isRu ? 'Все' : 'All' },
          { key: 'unlocked' as const, label: isRu ? 'Открытые' : 'Unlocked' },
          { key: 'locked' as const, label: isRu ? 'Закрытые' : 'Locked' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === f.key
                ? 'bg-primary text-white shadow-glow-sm'
                : 'bg-bg-surface border border-border text-text-secondary hover:text-text-primary'
            }`}
          >
            {f.label}
          </button>
        ))}
        <div className="w-px h-6 bg-border self-center mx-1" />
        {Object.entries(categoryConfig).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setCategoryFilter(categoryFilter === key ? '' : key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              categoryFilter === key
                ? `bg-${cfg.color}/15 text-${cfg.color} border border-${cfg.color}/30`
                : 'bg-bg-surface border border-border text-text-secondary hover:text-text-primary'
            }`}
          >
            {isRu ? cfg.label : cfg.labelEn}
          </button>
        ))}
      </div>

      {/* Achievement grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map(a => (
          <AchievementCard
            key={a.id}
            achievement={a}
            isRu={isRu}
            onClick={() => handleAchievementClick(a)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-text-muted">
          <Medal size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">{isRu ? 'Нет достижений по фильтру' : 'No achievements match filter'}</p>
        </div>
      )}

      {/* Achievement detail modal */}
      {selectedAchievement && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedAchievement(null)}
        >
          <div
            className={`bg-bg-surface border rounded-2xl p-6 max-w-sm w-full animate-slideUp ${
              rarityConfig[selectedAchievement.rarity].border
            } ${rarityConfig[selectedAchievement.rarity].glow}`}
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center">
              <div className={`w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                rarityConfig[selectedAchievement.rarity].bg
              } ${selectedAchievement.unlocked ? rarityConfig[selectedAchievement.rarity].color : 'text-text-muted'}`}>
                {selectedAchievement.unlocked ? selectedAchievement.icon : <Lock size={32} />}
              </div>
              <h3 className="text-lg font-bold mb-1">
                {isRu ? selectedAchievement.title : selectedAchievement.titleEn}
              </h3>
              <p className="text-sm text-text-muted mb-4">
                {isRu ? selectedAchievement.description : selectedAchievement.descriptionEn}
              </p>

              <div className="flex justify-center gap-3 mb-4">
                <Badge variant={selectedAchievement.unlocked ? 'success' : 'neutral'}>
                  {selectedAchievement.unlocked ? (isRu ? 'Открыто' : 'Unlocked') : (isRu ? 'Закрыто' : 'Locked')}
                </Badge>
                <Badge variant="primary">+{selectedAchievement.xp} XP</Badge>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="h-2.5 bg-bg-elevated rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-700"
                    style={{ width: `${(selectedAchievement.progress / selectedAchievement.maxProgress) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-text-muted mt-1">
                  {selectedAchievement.progress} / {selectedAchievement.maxProgress}
                </p>
              </div>

              {selectedAchievement.unlockedAt && (
                <p className="text-xs text-text-muted">
                  {isRu ? 'Получено' : 'Earned'}: {new Date(selectedAchievement.unlockedAt).toLocaleDateString(isRu ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              )}

              <button
                onClick={() => setSelectedAchievement(null)}
                className="mt-4 w-full py-2.5 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary-dark transition-colors"
              >
                {isRu ? 'Закрыть' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
