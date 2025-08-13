// Charts temporarily disabled for build stability
// import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStatistics } from '../../hooks/useDatabase';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'];

export default function ChartsSection() {
  const { data: stats, isLoading } = useStatistics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-96 animate-fade-in"></div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-96 animate-fade-in"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center col-span-2 p-12 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900">داده‌ای برای نمایش وجود ندارد</h3>
        <p className="text-gray-500 mt-1">پس از جمع‌آوری داده، نمودارها در این بخش نمایش داده خواهند شد.</p>
      </div>
    );
  }

  const categoryData = Object.entries(stats.categories).map(([name, value]) => ({
    name,
    value
  }));

  const domainData = Object.entries(stats.topDomains).slice(0, 8).map(([name, value]) => ({
    name: name.replace('www.', ''),
    value
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Categories Pie Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">توزیع دسته‌بندی‌ها</h3>
        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any, name: any) => [`${value} مورد`, name]}
                labelStyle={{ color: '#374151' }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            هنوز داده‌ای برای نمایش وجود ندارد
          </div>
        )}

        {/* Legend */}
        {categoryData.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {categoryData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-gray-600">{entry.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Domains Bar Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">برترین منابع</h3>
        {domainData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={domainData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
                stroke="#6B7280"
              />
              <YAxis stroke="#6B7280" />
              <Tooltip
                formatter={(value: any) => [`${value} مورد`, 'تعداد']}
                labelStyle={{ color: '#374151' }}
              />
              <Bar
                dataKey="value"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            هنوز داده‌ای برای نمایش وجود ندارد
          </div>
        )}
      </div>
    </div>
  );
}