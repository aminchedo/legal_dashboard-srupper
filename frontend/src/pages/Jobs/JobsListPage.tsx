import React from 'react';
import { Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, StatusBadge } from '../../components/ui';

const JobsListPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          مدیریت پروژه‌ها
        </h1>
        <p className="text-neutral-600 mt-1">
          پردازش و مدیریت پروژه‌های استخراج اطلاعات
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>فهرست پروژه‌ها</CardTitle>
          <CardDescription>
            ۱۲ پروژه فعال در حال پردازش
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              صفحه در حال توسعه
            </h3>
            <p className="text-neutral-600 mb-4">
              این بخش در نسخه‌های آتی تکمیل خواهد شد
            </p>
            <StatusBadge variant="warning">
              در حال توسعه
            </StatusBadge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobsListPage;