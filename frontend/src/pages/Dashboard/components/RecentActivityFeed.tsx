import { LinkOutlined, CalendarOutlined, TagOutlined, StarOutlined } from '@ant-design/icons';
import { useScrapedItems } from '../../../hooks/useDatabase';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';

export default function RecentActivityFeed() {
  const { data: items, isLoading } = useScrapedItems(10);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">فعالیت‌های اخیر</h2>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">فعالیت‌های اخیر</h2>
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📄</div>
          <p>هنوز فعالیتی ثبت نشده است</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">فعالیت‌های اخیر</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <LinkOutlined className="text-white text-sm" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {item.title || 'بدون عنوان'}
                </h3>
                <span className="text-xs text-gray-500 flex items-center">
                  <CalendarOutlined className="ml-1" />
                  {format(new Date(item.createdAt), 'dd MMM', { locale: faIR })}
                </span>
              </div>
              
              <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
                <span className="flex items-center">
                  <TagOutlined className="ml-1" />
                  {item.category}
                </span>
                <span className="flex items-center">
                  <StarOutlined className="ml-1" />
                  {item.ratingScore}/5
                </span>
                <span className="truncate">
                  {item.domain}
                </span>
              </div>
              
              {item.content && (
                <p className="mt-2 text-xs text-gray-600 line-clamp-2">
                  {item.content.length > 100 
                    ? `${item.content.substring(0, 100)}...` 
                    : item.content
                  }
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          مشاهده همه فعالیت‌ها
        </button>
      </div>
    </div>
  );
}