import { useMemo, useState } from 'react';
import { CheckCircleOutlined, SafetyCertificateOutlined, ClockCircleOutlined, GlobalOutlined, EnvironmentOutlined, ClusterOutlined, EditOutlined, FieldTimeOutlined, WarningOutlined, CloseCircleOutlined } from '../../../icons/antd-stub';
import { ProxyRecord, ProxyType } from '../../../types';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Skeleton } from '../../../components/ui/LoadingSpinner';
import Card from '../../../components/ui/Card';
import { Search, Filter, Edit3, Trash2, TestTube, Globe } from 'lucide-react';

interface Props {
    isLoading: boolean;
    items: ProxyRecord[];
    selected: string[];
    onSelectedChange: (ids: string[]) => void;
    onEdit: (record: ProxyRecord) => void;
    onDelete?: (record: ProxyRecord) => void;
    onTest?: (record: ProxyRecord) => void;
    onFiltersChange: (filters: { status: ProxyRecord['status'][]; types: ProxyType[]; countries: string[] }) => void;
    allCountries: string[];
}

/**
 * Professional ProxiesTable with enhanced filtering and actions
 */
export default function ProxyTable({ 
    isLoading, 
    items, 
    selected, 
    onSelectedChange, 
    onEdit, 
    onDelete,
    onTest,
    onFiltersChange, 
    allCountries 
}: Props) {
    const [status, setStatus] = useState<ProxyRecord['status'][]>([]);
    const [types, setTypes] = useState<ProxyType[]>([]);
    const [countries, setCountries] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const toggleSelect = (id: string) => {
        onSelectedChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
    };

    const toggleAll = () => {
        if (selected.length === filtered.length && filtered.length > 0) {
            onSelectedChange([]);
        } else {
            onSelectedChange(filtered.map(i => i.id));
        }
    };

    const filtered = useMemo(() => {
        return items.filter(item => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const searchable = `${item.ip} ${item.port} ${item.country} ${item.labels?.join(' ')}`.toLowerCase();
                if (!searchable.includes(query)) return false;
            }
            
            // Status filter
            if (status.length > 0 && !status.includes(item.status)) return false;
            
            // Type filter
            if (types.length > 0 && !types.includes(item.type)) return false;
            
            // Country filter
            if (countries.length > 0 && (!item.country || !countries.includes(item.country))) return false;
            
            return true;
        });
    }, [items, searchQuery, status, types, countries]);

    const emitFilters = (next: { status?: ProxyRecord['status'][]; types?: ProxyType[]; countries?: string[] }) => {
        const ns = next.status ?? status;
        const nt = next.types ?? types;
        const nc = next.countries ?? countries;
        setStatus(ns);
        setTypes(nt);
        setCountries(nc);
        onFiltersChange({ status: ns, types: nt, countries: nc });
    };

    const getStatusBadge = (status: ProxyRecord['status']) => {
        const variants = {
            online: 'bg-green-100 text-green-800 border-green-200',
            offline: 'bg-red-100 text-red-800 border-red-200',
            testing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            unknown: 'bg-gray-100 text-gray-800 border-gray-200',
        };
        
        const icons = {
            online: <CheckCircleOutlined />,
            offline: <CloseCircleOutlined />,
            testing: <ClockCircleOutlined />,
            unknown: <WarningOutlined />,
        };

        const labels = {
            online: 'آنلاین',
            offline: 'آفلاین', 
            testing: 'تست',
            unknown: 'نامشخص',
        };

        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${variants[status]}`}>
                {icons[status]} {labels[status]}
            </span>
        );
    };

    const renderFilterChips = () => {
        const activeFilters: string[] = [];
        if (status.length > 0) activeFilters.push(`Status: ${status.length}`);
        if (types.length > 0) activeFilters.push(`Types: ${types.length}`);
        if (countries.length > 0) activeFilters.push(`Countries: ${countries.length}`);
        
        return activeFilters.length > 0 ? (
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Active filters:</span>
                {activeFilters.map((filter, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs">
                        {filter}
                    </span>
                ))}
            </div>
        ) : null;
    };

    return (
        <Card variant="default" padding="none" className="overflow-hidden">
            {/* Enhanced Header with Search and Filters */}
            <div className="p-6 border-b border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Proxy List ({filtered.length} of {items.length})
                    </h3>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Filter size={16} />}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            Filters
                        </Button>
                        {selected.length > 0 && (
                            <div className="text-sm text-gray-600">
                                {selected.length} selected
                            </div>
                        )}
                    </div>
                </div>

                {/* Search */}
                <div className="flex items-center gap-4">
                    <div className="flex-1 max-w-md">
                        <Input
                            placeholder="Search by IP, port, country, or labels..."
                            leftIcon={<Search size={16} />}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            size="md"
                        />
                    </div>
                    {renderFilterChips()}
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                    <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <div className="flex flex-wrap gap-2">
                                {(['online', 'offline', 'testing', 'unknown'] as const).map(s => (
                                    <Button
                                        key={s}
                                        variant={status.includes(s) ? 'primary' : 'outline'}
                                        size="sm"
                                        onClick={() => emitFilters({ 
                                            status: status.includes(s) ? status.filter(x => x !== s) : [...status, s] 
                                        })}
                                    >
                                        {s === 'online' ? 'Online' : s === 'offline' ? 'Offline' : s === 'testing' ? 'Testing' : 'Unknown'}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Type Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Protocol Type</label>
                            <div className="flex flex-wrap gap-2">
                                {(['HTTP', 'HTTPS', 'SOCKS4', 'SOCKS5'] as const).map(t => (
                                    <Button
                                        key={t}
                                        variant={types.includes(t) ? 'primary' : 'outline'}
                                        size="sm"
                                        onClick={() => emitFilters({ 
                                            types: types.includes(t) ? types.filter(x => x !== t) : [...types, t] 
                                        })}
                                    >
                                        {t}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Country Filter */}
                        {allCountries.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                                    {allCountries.map(c => (
                                        <Button
                                            key={c}
                                            variant={countries.includes(c) ? 'primary' : 'outline'}
                                            size="sm"
                                            leftIcon={<Globe size={12} />}
                                            onClick={() => emitFilters({ 
                                                countries: countries.includes(c) ? countries.filter(x => x !== c) : [...countries, c] 
                                            })}
                                        >
                                            {c}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Enhanced Table */}
            <div className="overflow-x-auto">
                {isLoading ? (
                    <div className="p-6 space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <Skeleton width="20px" height="20px" />
                                <Skeleton width="120px" height="20px" />
                                <Skeleton width="60px" height="20px" />
                                <Skeleton width="80px" height="20px" />
                                <Skeleton width="100px" height="20px" />
                                <Skeleton width="80px" height="20px" />
                                <Skeleton width="120px" height="20px" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50/50">
                                <th className="p-4 text-left">
                                    <input 
                                        type="checkbox" 
                                        checked={selected.length === filtered.length && filtered.length > 0} 
                                        onChange={toggleAll}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </th>
                                <th className="p-4 text-left font-medium text-gray-900">Proxy</th>
                                <th className="p-4 text-left font-medium text-gray-900">Type</th>
                                <th className="p-4 text-left font-medium text-gray-900">Status</th>
                                <th className="p-4 text-left font-medium text-gray-900">Performance</th>
                                <th className="p-4 text-left font-medium text-gray-900">Location</th>
                                <th className="p-4 text-left font-medium text-gray-900">Labels</th>
                                <th className="p-4 text-left font-medium text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-12 text-center text-gray-500">
                                        <Globe size={48} className="mx-auto mb-4 text-gray-300" />
                                        <div className="text-lg font-medium mb-2">No proxies found</div>
                                        <div className="text-sm">Try adjusting your search or filters</div>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(proxy => (
                                    <tr key={proxy.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4">
                                            <input 
                                                type="checkbox" 
                                                checked={selected.includes(proxy.id)} 
                                                onChange={() => toggleSelect(proxy.id)}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="p-4">
                                            <div className="font-mono text-sm font-medium text-gray-900">
                                                {proxy.ip}:{proxy.port}
                                            </div>
                                            {proxy.username && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Auth: {proxy.username}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                                                {proxy.type}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {getStatusBadge(proxy.status)}
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm">
                                                {proxy.lastLatencyMs ? (
                                                    <div className="font-medium text-gray-900">
                                                        {proxy.lastLatencyMs}ms
                                                    </div>
                                                ) : (
                                                    <div className="text-gray-500">-</div>
                                                )}
                                                {proxy.lastTestedAt && (
                                                    <div className="text-xs text-gray-500">
                                                        {new Date(proxy.lastTestedAt).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm">
                                                {proxy.country ? (
                                                    <>
                                                        <div className="font-medium text-gray-900">{proxy.country}</div>
                                                        {proxy.region && (
                                                            <div className="text-xs text-gray-500">{proxy.region}</div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <div className="text-gray-500">-</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-wrap gap-1">
                                                {(proxy.labels || []).slice(0, 2).map(label => (
                                                    <span key={label} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md">
                                                        {label}
                                                    </span>
                                                ))}
                                                {(proxy.labels || []).length > 2 && (
                                                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
                                                        +{(proxy.labels || []).length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    leftIcon={<Edit3 size={14} />}
                                                    onClick={() => onEdit(proxy)}
                                                >
                                                    Edit
                                                </Button>
                                                {onTest && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        leftIcon={<TestTube size={14} />}
                                                        onClick={() => onTest(proxy)}
                                                    >
                                                        Test
                                                    </Button>
                                                )}
                                                {onDelete && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        leftIcon={<Trash2 size={14} />}
                                                        onClick={() => onDelete(proxy)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        Delete
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </Card>
    );
}


