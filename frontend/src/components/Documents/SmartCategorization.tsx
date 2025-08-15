import React, { useEffect, useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';

export interface SmartCategorizationProps {
  documentId: string;
  fetchSuggestions: (documentId: string) => Promise<string[]>;
  applyCategory: (documentId: string, category: string) => Promise<void>;
  onApplied?: (category: string) => void;
}

const SmartCategorization: React.FC<SmartCategorizationProps> = ({ documentId, fetchSuggestions, applyCategory, onApplied }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const s = await fetchSuggestions(documentId);
        if (mounted) setSuggestions(s);
      } catch (e: any) {
        if (mounted) setError(e?.message || 'خطا در دریافت پیشنهادها');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [documentId, fetchSuggestions]);

  const handleApply = async (category: string) => {
    setApplying(category);
    try {
      await applyCategory(documentId, category);
      onApplied?.(category);
    } finally {
      setApplying(null);
    }
  };

  return (
    <Card variant="bordered" padding="sm">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-neutral-800">پیشنهاد دسته‌بندی هوشمند</h4>
        <Button size="sm" variant="ghost" onClick={() => window.location.reload()}>
          بروزرسانی
        </Button>
      </div>
      {loading && <div className="text-sm text-neutral-500">در حال دریافت پیشنهادها...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
      {!loading && !error && suggestions.length === 0 && (
        <div className="text-sm text-neutral-500">پیشنهادی یافت نشد</div>
      )}
      <div className="flex flex-wrap gap-2">
        {suggestions.map((cat) => (
          <Button key={cat} size="sm" variant="outline" onClick={() => handleApply(cat)} disabled={!!applying}>
            {applying === cat ? 'در حال اعمال...' : cat}
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default SmartCategorization;