import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, Tooltip,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend,
} from 'recharts';
import { apiClient } from '@/lib/api-client';
import { Spinner } from '@/shared/components/Spinner';
import { useFormatters } from '@/shared/hooks/useFormatters';
import type { ReportsSummary } from '@/lib/api-types';

const COLORS = ['#6366f1', '#22c55e', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'];

const statusAr: Record<string, string> = {
  DELIVERED: 'تم التسليم', PENDING: 'معلّق', IN_TRANSIT: 'في الطريق',
  FAILED: 'فشل', RETURNED: 'مُعاد', CANCELLED: 'ملغي',
};

export function ReportsPage() {
  const { t } = useTranslation();
  const { formatCurrency, formatNumber } = useFormatters();

  const { data, isLoading } = useQuery({
    queryKey: ['reports', 'summary'],
    queryFn: () => apiClient.get<ReportsSummary>('/reports/summary').then((r) => r.data),
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!data) return <p className="text-center text-surface-400 py-20">{t('reports.noData')}</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-extrabold text-surface-900 dark:text-white">{t('reports.title')}</h1>

      {/* Order trend — line chart */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-surface-100 dark:border-slate-800 shadow-card p-6">
        <h2 className="font-bold text-surface-800 dark:text-slate-200 mb-6">{t('reports.orderTrend')}</h2>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data.orderTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v: string) => v.slice(5)} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <Tooltip
              formatter={(value: number, name: string) => [value, name === 'total' ? 'الإجمالي' : name === 'delivered' ? 'تم التسليم' : 'فشل']}
              labelFormatter={(label: string) => `التاريخ: ${label}`}
              contentStyle={{ fontFamily: 'Cairo, sans-serif', borderRadius: '12px', border: '1px solid #e2e8f0' }}
            />
            <Legend formatter={(v) => v === 'total' ? 'الإجمالي' : v === 'delivered' ? 'تم التسليم' : 'فشل'} />
            <Line type="monotone" dataKey="total"     stroke="#6366f1" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="delivered" stroke="#22c55e" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="failed"    stroke="#ef4444" strokeWidth={2}   dot={false} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Cash by agent — bar chart */}
        <div className="bg-white rounded-2xl border border-surface-100 shadow-card p-6">
          <h2 className="font-bold text-surface-800 mb-6">{t('reports.cashByAgent')}</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.agentCash} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v: number) => `${formatNumber(Math.round(v / 1000))}k`} />
              <YAxis type="category" dataKey="agentName" tick={{ fontSize: 11, fill: '#94a3b8' }} width={80} />
              <Tooltip
                formatter={(value: number, name: string) => [formatCurrency(value), name === 'collected' ? 'المحصّل' : 'المتوقع']}
                contentStyle={{ fontFamily: 'Cairo, sans-serif', borderRadius: '12px', border: '1px solid #e2e8f0' }}
              />
              <Legend formatter={(v) => v === 'collected' ? 'المحصّل' : 'المتوقع'} />
              <Bar dataKey="expected"  fill="#c7d2fe" radius={[0, 4, 4, 0]} />
              <Bar dataKey="collected" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status breakdown — pie chart */}
        <div className="bg-white rounded-2xl border border-surface-100 shadow-card p-6">
          <h2 className="font-bold text-surface-800 mb-6">{t('reports.orderStatusBreakdown')}</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data.statusBreakdown}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={50}
                paddingAngle={3}
              >
                {data.statusBreakdown.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [formatNumber(value), statusAr[name] ?? name]}
                contentStyle={{ fontFamily: 'Cairo, sans-serif', borderRadius: '12px', border: '1px solid #e2e8f0' }}
              />
              <Legend formatter={(v: string) => statusAr[v] ?? v} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
