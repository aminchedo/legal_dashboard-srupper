import { ScrapedItem } from '../types';

export class ContentCategorizer {
  private readonly legalKeywords = {
    'قانون': ['قانون', 'ماده', 'تبصره', 'بند', 'فصل', 'باب', 'اصل', 'موازین'],
    'قرارداد': ['قرارداد', 'عقد', 'طرفین', 'متعاهدین', 'تعهد', 'حق', 'الزام'],
    'دادگاه': ['دادگاه', 'حکم', 'رای', 'قاضی', 'دادرس', 'محکمه', 'دادسرا'],
    'اداری': ['اداره', 'سازمان', 'وزارت', 'دولت', 'مقام', 'مسئول', 'اجرایی'],
    'مالی': ['مالیات', 'عوارض', 'بودجه', 'هزینه', 'درآمد', 'پول', 'پرداخت'],
    'املاک': ['ملک', 'خانه', 'زمین', 'ساختمان', 'اجاره', 'خرید', 'فروش'],
    'جزایی': ['جرم', 'مجازات', 'زندان', 'جریمه', 'حبس', 'تعزیر', 'حد'],
    'خانواده': ['ازدواج', 'طلاق', 'کودک', 'نفقه', 'حضانت', 'نکاح', 'مهر'],
    'تجاری': ['تجارت', 'شرکت', 'بازرگانی', 'صنعت', 'کسب', 'حرفه', 'اقتصاد'],
    'کار': ['کار', 'کارگر', 'کارمند', 'استخدام', 'حقوق', 'مزد', 'بیمه']
  };

  private readonly domainCategories = {
    'dadgostary.gov.ir': 'دادگستری',
    'qavanin.ir': 'قانون',
    'adliran.ir': 'عدالت اداری',
    'iranbar.org': 'وکالت',
    'dastour.ir': 'منابع حقوقی',
    'rc.majlis.ir': 'پژوهش',
    'hoquqdan.com': 'آموزش'
  };

  categorizeContent(title: string, content: string, domain: string): [string, number] {
    // Domain-based categorization first
    for (const [domainKey, category] of Object.entries(this.domainCategories)) {
      if (domain.includes(domainKey)) {
        return [category, 0.9];
      }
    }

    // Text-based categorization
    const text = `${title} ${content}`.toLowerCase();
    const categoryScores: Record<string, number> = {};

    for (const [category, keywords] of Object.entries(this.legalKeywords)) {
      const score = keywords.reduce((acc, keyword) => {
        const matches = (text.match(new RegExp(keyword, 'g')) || []).length;
        return acc + matches;
      }, 0);

      if (score > 0) {
        categoryScores[category] = score;
      }
    }

    if (Object.keys(categoryScores).length > 0) {
      const bestCategory = Object.keys(categoryScores).reduce((a, b) =>
        (categoryScores[a] ?? 0) > (categoryScores[b] ?? 0) ? a : b
      );
      const maxScore = categoryScores[bestCategory] ?? 0;
      const confidence = Math.min(maxScore / 10, 1); // Normalize to 0-1
      return [bestCategory, confidence];
    }

    return ['عمومی', 0.5];
  }

  calculateContentRating(title: string, content: string, domain: string): number {
    let score = 0;

    // Length score
    const wordCount = content.split(/\s+/).length;
    if (wordCount >= 50 && wordCount <= 5000) {
      score += 0.3;
    } else if (wordCount >= 20 && wordCount < 50) {
      score += 0.1;
    }

    // Legal keyword density
    const text = `${title} ${content}`.toLowerCase();
    const allKeywords = Object.values(this.legalKeywords).flat();
    const legalTerms = allKeywords.reduce((count, keyword) => {
      return count + (text.match(new RegExp(keyword, 'g')) || []).length;
    }, 0);

    if (legalTerms >= 5) {
      score += 0.4;
    } else if (legalTerms >= 2) {
      score += 0.2;
    }

    // Title quality
    if (title && title.split(/\s+/).length >= 3) {
      score += 0.1;
    }

    // Domain reputation
    const reputableDomains = ['gov.ir', 'qavanin.ir', 'iranbar.org', 'dastour.ir'];
    if (reputableDomains.some(repDomain => domain.includes(repDomain))) {
      score += 0.2;
    }

    return Math.min(score, 1);
  }
}

export const contentCategorizer = new ContentCategorizer();