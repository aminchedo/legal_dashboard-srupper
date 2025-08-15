import React, { useState } from 'react';
import { Star } from 'lucide-react';

export interface SmartRatingProps {
  documentId: string;
  initialScore?: number; // 0..1
  onRated?: (newScore: number) => void;
  submitRating: (documentId: string, score: number) => Promise<void>;
}

const StarButton: React.FC<{ filled: boolean; onClick: () => void; onMouseEnter: () => void; onMouseLeave: () => void }> = ({ filled, onClick, onMouseEnter, onMouseLeave }) => (
  <button
    type="button"
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    className={`p-1 transition-colors ${filled ? 'text-yellow-500' : 'text-neutral-300 hover:text-yellow-400'}`}
    aria-label={filled ? 'امتیاز' : 'ثبت امتیاز'}
  >
    <Star className="w-5 h-5" />
  </button>
);

const SmartRating: React.FC<SmartRatingProps> = ({ documentId, initialScore = 0, onRated, submitRating }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [score, setScore] = useState<number>(initialScore);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStars = hoverIndex !== null ? hoverIndex + 1 : Math.round((score || 0) * 5);

  const handleRate = async (index: number) => {
    const newScore = (index + 1) / 5;
    setScore(newScore);
    setIsSubmitting(true);
    try {
      await submitRating(documentId, newScore);
      onRated?.(newScore);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="inline-flex items-center gap-1" dir="rtl">
      {[0,1,2,3,4].map((i) => (
        <StarButton
          key={i}
          filled={i < currentStars}
          onClick={() => handleRate(i)}
          onMouseEnter={() => setHoverIndex(i)}
          onMouseLeave={() => setHoverIndex(null)}
        />
      ))}
      <span className="text-xs text-neutral-500 mr-1">{Math.round((score || 0) * 100)}%</span>
      {isSubmitting && <span className="text-xs text-blue-600 mr-2">در حال ثبت...</span>}
    </div>
  );
};

export default SmartRating;