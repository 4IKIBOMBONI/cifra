import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Trophy, ArrowRight, Zap, BookOpen, Map as MapIcon, Star, TrendingUp, Clock } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useI18n } from '@/store/i18nStore';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useStaggeredAnimation } from '@/hooks/useAnimateOnScroll';
import { newsApi, slotsApi, ratingApi, directionsApi } from '@/api';
import type { NewsPost, Slot, LeaderboardEntry, Direction } from '@/types/api';

export function HomePage() {
  const { user } = useAuthStore();
  const { t } = useI18n();
  const [news, setNews] = useState<NewsPost[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [directions, setDirections] = useState<Direction[]>([]);

  const directionsAnim = useStaggeredAnimation(5);
  const quickLinksAnim = useStaggeredAnimation(4);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    Promise.all([
      newsApi.list().catch(() => ({ data: [] })),
      slotsApi.list({ slot_date: today, status: 'available' }).catch(() => ({ data: [] })),
      ratingApi.leaderboard(5).catch(() => ({ data: [] })),
      directionsApi.list().catch(() => ({ data: [] })),
    ]).then(([nRes, sRes, lRes, dRes]) => {
      setNews((nRes.data as NewsPost[]).slice(0, 3));
      setSlots((sRes.data as Slot[]).slice(0, 5));
      setLeaderboard(lRes.data as LeaderboardEntry[]);
      setDirections(dRes.data as Direction[]);
    });
  }, []);

  const dirName = (id: string) => directions.find(d => d.id === id)?.name || '';

  const ratingScore = user?.rating_score ?? 0;
  const ratingLevel =
    ratingScore >= 100 ? { color: 'text-primary', label: t.ratingLevels.elite } :
    ratingScore >= 70 ? { color: 'text-success', label: t.ratingLevels.advanced } :
    ratingScore >= 30 ? { color: 'text-accent', label: t.ratingLevels.active } :
    { color: 'text-error', label: t.ratingLevels.beginner };

  const newsTypeLabel = (type: string) =>
    type === 'news' ? t.newsTypes.news : type === 'announcement' ? t.newsTypes.announcement : t.newsTypes.result;

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-hero border border-border p-8 md:p-12 mb-8">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="primary" size="md">{t.home.platformBadge}</Badge>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 font-accent leading-tight">
            {t.home.welcome}{' '}
            <span className="gradient-text">CIFRA</span>
          </h1>
          <p className="text-base md:text-lg text-text-secondary mb-8 max-w-2xl leading-relaxed">
            {t.home.subtitle}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/schedule">
              <Button size="lg" icon={<Calendar size={18} />}>
                {t.home.bookSession}
              </Button>
            </Link>
            <Link to="/directions">
              <Button variant="secondary" size="lg">
                {t.home.allDirections} <ArrowRight size={18} className="ml-1" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-primary/8 blur-[100px]" aria-hidden="true" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-secondary/8 blur-[100px]" aria-hidden="true" />
      </section>

      {/* Quick stats */}
      {user && (
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8" aria-label={t.home.myRating}>
          <Card hover={false} className="relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-text-muted text-sm mb-1">{t.home.myRating}</p>
                <p className={`text-3xl font-bold font-accent ${ratingLevel.color}`}>
                  {ratingScore}
                </p>
                <p className="text-xs text-text-muted mt-1">{ratingLevel.label}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp size={20} className="text-primary" />
              </div>
            </div>
          </Card>
          <Link to="/profile/bookings">
            <Card className="h-full card-interactive">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-text-muted text-sm mb-1">{t.home.bookings}</p>
                  <p className="text-sm text-text-primary font-medium mt-2">{t.home.viewSchedule}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Calendar size={20} className="text-secondary" />
                </div>
              </div>
            </Card>
          </Link>
          <Link to="/teams">
            <Card className="h-full card-interactive">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-text-muted text-sm mb-1">{t.home.myTeams}</p>
                  <p className="text-sm text-text-primary font-medium mt-2">{t.home.manageTeams}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Trophy size={20} className="text-accent" />
                </div>
              </div>
            </Card>
          </Link>
        </section>
      )}

      {/* Directions with staggered animation */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="section-title">{t.nav.directions}</h2>
          <Link to="/directions" className="text-sm text-primary hover:text-primary-light font-medium transition-colors">
            {t.home.allDirections} →
          </Link>
        </div>
        <div ref={directionsAnim.ref} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {(directions.length > 0 ? directions : [
            { name: t.directionsFallback.cybersport, icon: '🎮', slug: 'cybersport', color: '#2563EB' },
            { name: t.directionsFallback.lasertag, icon: '🔫', slug: 'lasertag', color: '#EF4444' },
            { name: t.directionsFallback.drones, icon: '🛸', slug: 'drones', color: '#10B981' },
            { name: t.directionsFallback.playstation, icon: '🕹️', slug: 'playstation', color: '#8B5CF6' },
            { name: t.directionsFallback.computers, icon: '💻', slug: 'computers', color: '#06B6D4' },
          ] as any[]).map((dir, i) => (
            <Link key={dir.slug} to={`/directions/${dir.slug}`}>
              <Card
                className="text-center py-6 group card-interactive"
                style={directionsAnim.getItemStyle(i)}
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{dir.icon}</div>
                <p className="text-sm font-semibold text-text-primary">{dir.name}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Upcoming slots */}
      {slots.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">{t.home.nearestSlots}</h2>
            <Link to="/schedule" className="text-sm text-primary hover:text-primary-light font-medium transition-colors">
              {t.home.schedule} →
            </Link>
          </div>
          <div className="space-y-2">
            {slots.map(slot => (
              <Card key={slot.id} hover={false} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{dirName(slot.direction_id) || t.home.session}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-sm text-text-secondary font-mono">{slot.start_time.slice(0, 5)} — {slot.end_time.slice(0, 5)}</span>
                      <span className="text-xs text-text-muted">{slot.current_count}/{slot.capacity} {t.home.seats}</span>
                    </div>
                  </div>
                </div>
                <Link to="/schedule">
                  <Button size="sm">{t.home.signUp}</Button>
                </Link>
              </Card>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* News */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">{t.nav.news}</h2>
            <Link to="/news" className="text-sm text-primary hover:text-primary-light font-medium transition-colors">{t.common.all} →</Link>
          </div>
          {news.length === 0 ? (
            <Card hover={false}>
              <p className="text-text-muted text-center py-6">{t.home.noNews}</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {news.map(post => (
                <Link key={post.id} to={`/news/${post.slug}`}>
                  <Card className="group card-interactive">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={post.type === 'news' ? 'primary' : post.type === 'announcement' ? 'warning' : 'success'}>
                        {newsTypeLabel(post.type)}
                      </Badge>
                      {post.published_at && (
                        <span className="text-xs text-text-muted">
                          {new Date(post.published_at).toLocaleDateString('ru-RU')}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{post.title}</h3>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Leaderboard */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">{t.home.top5}</h2>
            <Link to="/rating" className="text-sm text-primary hover:text-primary-light font-medium transition-colors">{t.home.leaderboard} →</Link>
          </div>
          {leaderboard.length === 0 ? (
            <Card hover={false}>
              <p className="text-text-muted text-center py-6">{t.common.noData}</p>
            </Card>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((entry, i) => (
                <Card
                  key={entry.user_id}
                  hover={false}
                  className={`flex items-center gap-3 ${entry.user_id === user?.id ? 'border-primary/30 bg-primary/5' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold font-accent text-sm ${
                    i === 0 ? 'bg-accent/15 text-accent' :
                    i === 1 ? 'bg-text-secondary/15 text-text-secondary' :
                    i === 2 ? 'bg-warning/15 text-warning' :
                    'bg-bg-elevated text-text-muted'
                  }`}>
                    {entry.rank}
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-white">
                      {entry.first_name[0]}{entry.last_name[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{entry.first_name} {entry.last_name}</p>
                  </div>
                  <span className="font-bold font-accent text-primary">{entry.rating_score}</span>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Partner section — DKSh */}
      <section className="mt-8 mb-8">
        <Card hover={false} className="relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-green-500/20 flex items-center justify-center shrink-0">
              <span className="text-3xl">🎓</span>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                <h3 className="text-lg font-bold">{t.home.dkshTitle}</h3>
                <Badge variant="success" size="sm">{t.home.dkshPartner}</Badge>
              </div>
              <p className="text-text-secondary text-sm mb-3">
                {t.home.dkshDescription}
              </p>
              <a
                href="https://vk.com/digitalschool"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium text-sm hover:bg-primary/20 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.576-1.496c.588-.19 1.341 1.26 2.14 1.818.605.422 1.064.33 1.064.33l2.137-.03s1.117-.07.588-.964c-.043-.073-.308-.661-1.588-1.87-1.34-1.264-1.16-1.059.453-3.246.983-1.332 1.376-2.145 1.253-2.493-.117-.332-.84-.244-.84-.244l-2.406.015s-.178-.025-.31.056c-.13.079-.212.263-.212.263s-.382 1.03-.89 1.907c-1.07 1.85-1.499 1.948-1.674 1.834-.407-.267-.305-1.075-.305-1.648 0-1.793.267-2.54-.521-2.733-.262-.064-.454-.106-1.123-.113-.858-.009-1.585.003-1.996.208-.274.136-.485.44-.356.457.159.022.519.099.71.363.246.341.237 1.107.237 1.107s.142 2.11-.33 2.371c-.325.18-.77-.187-1.725-1.865-.489-.859-.859-1.81-.859-1.81s-.07-.178-.198-.273c-.155-.116-.372-.152-.372-.152l-2.286.015s-.343.01-.47.162c-.112.135-.009.414-.009.414s1.794 4.258 3.825 6.406c1.862 1.968 3.978 1.838 3.978 1.838h.959z"/>
                </svg>
                {t.home.dkshLink}
              </a>
            </div>
          </div>
        </Card>
      </section>

      {/* Quick links with staggered animation */}
      <section ref={quickLinksAnim.ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {[
          { to: '/materials', icon: <BookOpen size={22} />, color: 'primary', title: t.home.quickMaterials, desc: t.home.quickMaterialsDesc },
          { to: '/map', icon: <MapIcon size={22} />, color: 'secondary', title: t.home.quickMap, desc: t.home.quickMapDesc },
          { to: '/rewards', icon: <Star size={22} />, color: 'accent', title: t.home.quickRewards, desc: t.home.quickRewardsDesc },
          { to: '/schedule', icon: <Zap size={22} />, color: 'success', title: t.home.quickSchedule, desc: t.home.quickScheduleDesc },
        ].map((link, i) => (
          <Link key={link.to} to={link.to}>
            <Card
              className="group card-interactive"
              style={quickLinksAnim.getItemStyle(i)}
            >
              <div className={`w-11 h-11 rounded-xl bg-${link.color}/10 flex items-center justify-center mb-3 text-${link.color} group-hover:scale-110 transition-transform`}>
                {link.icon}
              </div>
              <h3 className="font-semibold text-sm mb-0.5">{link.title}</h3>
              <p className="text-xs text-text-muted">{link.desc}</p>
            </Card>
          </Link>
        ))}
      </section>
    </PageLayout>
  );
}
