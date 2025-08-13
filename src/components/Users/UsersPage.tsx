import React, { useState } from 'react';
import { Card, Button, Input, Badge } from '../../../components/ui/atoms';
import { DataTable, ActionCard } from '../../../components/ui/molecules';
import { formatPersianDate } from '../../../lib/formatters';

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showAddUser, setShowAddUser] = useState(false);

  const users = [
    {
      id: '1',
      name: 'علی احمدی',
      email: 'ali@example.com',
      role: 'admin',
      status: 'active',
      lastLogin: new Date('2024-11-06T10:30:00'),
      joinDate: new Date('2024-01-15'),
      permissions: ['read', 'write', 'delete', 'admin']
    },
    {
      id: '2',
      name: 'فاطمه حسینی',
      email: 'fateme@example.com',
      role: 'analyst',
      status: 'active',
      lastLogin: new Date('2024-11-06T09:15:00'),
      joinDate: new Date('2024-03-20'),
      permissions: ['read', 'write']
    },
    {
      id: '3',
      name: 'محمد رضایی',
      email: 'mohammad@example.com',
      role: 'operator',
      status: 'inactive',
      lastLogin: new Date('2024-11-01T14:20:00'),
      joinDate: new Date('2024-02-10'),
      permissions: ['read']
    },
    {
      id: '4',
      name: 'زهرا کریمی',
      email: 'zahra@example.com',
      role: 'analyst',
      status: 'active',
      lastLogin: new Date('2024-11-06T11:45:00'),
      joinDate: new Date('2024-04-05'),
      permissions: ['read', 'write']
    },
    {
      id: '5',
      name: 'حسن ملکی',
      email: 'hasan@example.com',
      role: 'operator',
      status: 'suspended',
      lastLogin: new Date('2024-10-28T16:30:00'),
      joinDate: new Date('2024-05-12'),
      permissions: ['read']
    }
  ];

  const roles = [
    { id: 'admin', name: 'مدیر سیستم', color: 'error' },
    { id: 'analyst', name: 'تحلیلگر', color: 'info' },
    { id: 'operator', name: 'اپراتور', color: 'success' },
    { id: 'viewer', name: 'مشاهده‌گر', color: 'neutral' }
  ];

  const getRoleName = (roleId: string) => {
    return roles.find(r => r.id === roleId)?.name || roleId;
  };

  const getRoleColor = (roleId: string) => {
    return roles.find(r => r.id === roleId)?.color || 'neutral';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'neutral';
      case 'suspended': return 'error';
      default: return 'neutral';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'فعال';
      case 'inactive': return 'غیرفعال';
      case 'suspended': return 'محروم';
      default: return status;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleEditUser = (userId: string) => {
    alert(`ویرایش کاربر ${userId}`);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('آیا از حذف این کاربر مطمئن هستید؟')) {
      alert(`کاربر ${userId} حذف شد`);
    }
  };

  const handleToggleStatus = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    alert(`وضعیت کاربر ${userId} به ${getStatusText(newStatus)} تغییر یافت`);
  };

  const handleResetPassword = (userId: string) => {
    if (confirm('آیا از ریست کردن رمز عبور این کاربر مطمئن هستید؟')) {
      alert(`رمز عبور کاربر ${userId} ریست شد`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">مدیریت کاربران</h1>
          <p className="text-gray-600">مدیریت دسترسی‌ها و حساب‌های کاربری</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddUser(true)}>
          افزودن کاربر جدید
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {users.length}
            </div>
            <div className="text-sm text-gray-600">کل کاربران</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">کاربران فعال</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {users.filter(u => u.status === 'suspended').length}
            </div>
            <div className="text-sm text-gray-600">کاربران محروم</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {users.filter(u => u.role === 'admin').length}
            </div>
            <div className="text-sm text-gray-600">مدیران سیستم</div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="جستجو بر اساس نام یا ایمیل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="all">همه نقش‌ها</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">فهرست کاربران</h2>
        <DataTable
          headers={['نام', 'ایمیل', 'نقش', 'وضعیت', 'آخرین ورود', 'تاریخ عضویت', 'عملیات']}
          rows={filteredUsers.map(user => [
            user.name,
            user.email,
            <Badge key={user.id} status={getRoleColor(user.role) as any}>
              {getRoleName(user.role)}
            </Badge>,
            <Badge key={user.id} status={getStatusColor(user.status) as any}>
              {getStatusText(user.status)}
            </Badge>,
            formatPersianDate(user.lastLogin),
            formatPersianDate(user.joinDate),
            <div key={user.id} className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEditUser(user.id)}
              >
                ویرایش
              </Button>
              <Button
                size="sm"
                variant={user.status === 'active' ? 'secondary' : 'primary'}
                onClick={() => handleToggleStatus(user.id, user.status)}
              >
                {user.status === 'active' ? 'غیرفعال' : 'فعال'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleResetPassword(user.id)}
              >
                ریست
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleDeleteUser(user.id)}
              >
                حذف
              </Button>
            </div>
          ])}
        />
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ActionCard
          title="دعوت گروهی"
          description="دعوت چندین کاربر به صورت همزمان از طریق فایل CSV"
          actions={[
            { label: 'دانلود نمونه', onClick: () => alert('دانلود فایل نمونه'), variant: 'outline' },
            { label: 'آپلود فایل', onClick: () => alert('آپلود فایل CSV'), variant: 'primary' }
          ]}
        />

        <ActionCard
          title="تنظیمات نقش‌ها"
          description="مدیریت نقش‌ها و مجوزهای دسترسی کاربران"
          actions={[
            { label: 'مدیریت نقش‌ها', onClick: () => alert('مدیریت نقش‌ها'), variant: 'primary' }
          ]}
        />

        <ActionCard
          title="گزارش فعالیت"
          description="مشاهده گزارش فعالیت‌های کاربران در سیستم"
          actions={[
            { label: 'مشاهده گزارش', onClick: () => alert('مشاهده گزارش فعالیت'), variant: 'outline' },
            { label: 'تولید گزارش', onClick: () => alert('تولید گزارش جدید'), variant: 'secondary' }
          ]}
        />
      </div>

      {/* Recent Activities */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">فعالیت‌های اخیر</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border-r-4 border-blue-500">
            <div>
              <p className="text-sm font-medium">علی احمدی وارد سیستم شد</p>
              <p className="text-xs text-gray-600">10:30 صبح - امروز</p>
            </div>
            <Badge status="info">ورود</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-r-4 border-green-500">
            <div>
              <p className="text-sm font-medium">کاربر جدید "سارا موسوی" اضافه شد</p>
              <p className="text-xs text-gray-600">9:15 صبح - امروز</p>
            </div>
            <Badge status="success">ثبت نام</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border-r-4 border-yellow-500">
            <div>
              <p className="text-sm font-medium">نقش "حسن ملکی" تغییر یافت</p>
              <p className="text-xs text-gray-600">8:45 صبح - امروز</p>
            </div>
            <Badge status="warning">تغییر نقش</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border-r-4 border-red-500">
            <div>
              <p className="text-sm font-medium">کاربر "احمد نوری" محروم شد</p>
              <p className="text-xs text-gray-600">دیروز - 16:20</p>
            </div>
            <Badge status="error">محرومیت</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}