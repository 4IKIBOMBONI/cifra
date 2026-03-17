import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { materialsApi, directionsApi } from '@/api';
import type { Material, Direction } from '@/types/api';
import { BookOpen, FileText, Video, Link as LinkIcon, Search, Filter } from 'lucide-react';

export function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [directions, setDirections] = useState<Direction[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [dirFilter, setDirFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    directionsApi.list().then(res => setDirections(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: any = {};
    if (typeFilter) params.type = typeFilter;
    if (dirFilter) params.direction_id = dirFilter;
    if (search) params.search = search;
    materialsApi.list(params).then(res => {
      setMaterials(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [typeFilter, dirFilter, search]);

  const typeIcon = (type: string) => {
    const map: Record<string, React.ReactNode> = {
      lecture: <BookOpen size={20} className="text-primary" />,
      instruction: <FileText size={20} className="text-accent" />,
      video: <Video size={20} className="text-error" />,
      link: <LinkIcon size={20} className="text-secondary" />,
    };
    return map[type] || <FileText size={20} className="text-text-muted" />;
  };

  const typeLabel = (type: string) => {
    const map: Record<string, string> = { lecture: 'Лекция', instruction: 'Инструкция', video: 'Видео', link: 'Ссылка' };
    return map[type] || type;
  };

  return (
    <PageLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Материалы</h1>
        <p className="text-text-muted text-sm">Лекции, инструкции, видео и полезные ссылки</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" placeholder="Поиск материалов..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9 text-sm" />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="input-field w-auto text-sm appearance-none pr-8">
          <option value="">Все типы</option>
          <option value="lecture">Лекции</option>
          <option value="instruction">Инструкции</option>
          <option value="video">Видео</option>
          <option value="link">Ссылки</option>
        </select>
        <select value={dirFilter} onChange={(e) => setDirFilter(e.target.value)} className="input-field w-auto text-sm appearance-none pr-8">
          <option value="">Все направления</option>
          {directions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-24" />)}
        </div>
      ) : materials.length === 0 ? (
        <EmptyState icon={<BookOpen size={28} />} title="Материалы не найдены" description="Попробуйте изменить фильтры" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {materials.map(mat => (
            <Link key={mat.id} to={`/materials/${mat.id}`}>
              <Card className="flex items-start gap-4 h-full group">
                <div className="w-11 h-11 rounded-xl bg-bg-elevated flex items-center justify-center shrink-0">
                  {typeIcon(mat.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">{mat.title}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="neutral">{typeLabel(mat.type)}</Badge>
                    {mat.video_url && <Badge variant="error">Видео</Badge>}
                    {mat.file_url && <Badge variant="info">Файл</Badge>}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
