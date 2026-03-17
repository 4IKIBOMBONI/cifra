import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { materialsApi } from '@/api';
import type { Material } from '@/types/api';
import { ExternalLink, Download, ArrowLeft } from 'lucide-react';

export function MaterialDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    materialsApi.get(id).then(res => { setMaterial(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <PageLayout><div className="max-w-3xl mx-auto space-y-4"><div className="skeleton h-8 w-64" /><div className="skeleton h-64" /></div></PageLayout>;
  }

  if (!material) {
    return <PageLayout><EmptyState title="Материал не найден" /></PageLayout>;
  }

  const typeLabel: Record<string, string> = { lecture: 'Лекция', instruction: 'Инструкция', video: 'Видео', link: 'Ссылка' };

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto">
        <Link to="/materials" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors mb-6">
          <ArrowLeft size={16} /> Все материалы
        </Link>

        <h1 className="text-2xl font-bold mb-3">{material.title}</h1>
        <div className="flex items-center gap-2 mb-6">
          <Badge variant="primary" size="md">{typeLabel[material.type] || material.type}</Badge>
        </div>

        {material.video_url && (
          <div className="mb-6 aspect-video rounded-xl overflow-hidden bg-bg-surface border border-border">
            <iframe src={material.video_url.replace('watch?v=', 'embed/')} className="w-full h-full" allowFullScreen title={material.title} />
          </div>
        )}

        <div className="flex flex-wrap gap-3 mb-6">
          {material.file_url && (
            <a href={material.file_url} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" icon={<Download size={16} />}>Скачать файл</Button>
            </a>
          )}
          {material.external_url && (
            <a href={material.external_url} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" icon={<ExternalLink size={16} />}>Открыть ссылку</Button>
            </a>
          )}
        </div>

        {material.content && (
          <Card hover={false} padding="lg">
            <div className="prose-content" dangerouslySetInnerHTML={{ __html: material.content }} />
          </Card>
        )}
      </div>
    </PageLayout>
  );
}
