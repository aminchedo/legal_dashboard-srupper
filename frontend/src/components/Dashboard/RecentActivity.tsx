import { LinkOutlined, CalendarOutlined, TagOutlined, StarOutlined } from '@ant-design/icons';
import { ExternalLink, Calendar, Star, Tag } from '../../utils/iconRegistry';
import { useScrapedItems } from '../../hooks/useDatabase';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';

export default function RecentActivity() {
  const { data: items, isLoading } = useScrapedItems(10);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">آخرین فعالیت‌ها</h3>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse border-b border-gray-100 pb-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">آخرین فعالیت‌ها</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">هنوز آیتمی جمع‌آوری نشده است.</p>
          <p className="text-sm text-gray-400 mt-2">از بخش وب اسکرپینگ استفاده کنید.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">آخرین فعالیت‌ها</h3>
      
      <div className="space-y-4">
        {items.slice(0, 5).map((item, index) => (
          <div key={item.id} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate mb-1">
                  {item.title}
                </h4>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                  <div className="flex items-center gap-1">
                    <ExternalLink size={14} />
                    <span className="truncate max-w-32">{item.domain}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{format(new Date(item.createdAt), 'yyyy/MM/dd', { locale: faIR })}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Star size={14} />
                    <span>{(item.ratingScore * 100).toFixed(0)}%</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`
                    inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                    bg-blue-50 text-blue-700 border border-blue-200
                  `}>
                    <Tag size={12} />
                    {item.category}
                  </span>
                  
                  <span className="text-xs text-gray-500">
                    {item.wordCount.toLocaleString('fa-IR')} کلمه
                  </span>
                </div>
              </div>
              
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="مشاهده اصل"
              >
                <LinkOutlined />
              </a>
            </div>
          </div>
        ))}
      </div>
      
      {items.length > 5 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            مشاهده همه ({items.length.toLocaleString('fa-IR')} مورد)
          </button>
        </div>
      )}
    </div>
  );
}