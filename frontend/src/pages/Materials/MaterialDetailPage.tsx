import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { materialsApi } from '@/api';
import type { Material } from '@/types/api';
import { ExternalLink, Download } from 'lucide-react';

export function MaterialDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    materialsApi.get(id).then(res => {
      setMaterial(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <PageLayout>
        <div className="space-y-4">
          <div className="h-8 w-64 bg-bg-surface rounded animate-pulse" />
          <div className="h-64 bg-bg-surface rounded-lg animate-pulse" />
        </div>
      </PageLayout>
    );
  }

  if (!material) {
    return (
      <PageLayout>
        <div className="text-center py-16 text-text-muted">
          <p className="text-lg">Материал не найден</p>
          <Link to="/materials" className="text-primary mt-2 inline-block">Все материалы</Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Link to="/materials" className="text-sm text-text-muted hover:text-primary mb-4 inline-block">
        ← Все материалы
      </Link>

      <h1 className="text-2xl font-bold mb-2">{material.title}</h1>

      <div className="flex items-center gap-2 mb-6">
        <span className="badge bg-primary/10 text-primary">{material.type}</span>
      </div>

      {/* Video embed */}
      {material.video_url && (
        <div className="mb-6 aspect-video rounded-xl overflow-hidden bg-bg-surface">
          <iframe
            src={material.video_url.replace('watch?v=', 'embed/')}
            className="w-full h-full"
            allowFullScreen
            title={material.title}
          />
        </div>
      )}

      {/* File download */}
      {material.file_url && (
        <div className="mb-6">
          <a href={material.file_url} target="_blank" rel="noopener noreferrer">
            <Button variant="secondary">
              <Download size={16} className="mr-2" />
              Скачать файл
            </Button>
          </a>
        </div>
      )}

      {/* External link */}
      {material.external_url && (
        <div className="mb-6">
          <a href={material.external_url} target="_blank" rel="noopener noreferrer">
            <Button variant="secondary">
              <ExternalLink size={16} className="mr-2" />
              Открыть ссылку
            </Button>
          </a>
        </div>
      )}

      {/* Content */}
      {material.content && (
        <Card hover={false}>
          <div
            className="prose prose-invert max-w-none text-text-primary
              [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3
              [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2
              [&_p]:mb-3 [&_p]:text-text-secondary [&_p]:leading-relaxed
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3
              [&_li]:mb-1 [&_li]:text-text-secondary
              [&_strong]:text-white [&_strong]:font-semibold"
            dangerouslySetInnerHTML={{ __html: material.content }}
          />
        </Card>
      )}
    </PageLayout>
  );
}
