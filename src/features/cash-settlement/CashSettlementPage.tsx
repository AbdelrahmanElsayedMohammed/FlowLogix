import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { apiClient } from '@/lib/api-client';
import { Table, Thead, Tbody, Tr, Th, Td, TableSkeleton, TableEmpty } from '@/shared/components/Table';
import { Button } from '@/shared/components/Button';
import { Badge } from '@/shared/components/Badge';
import { Input } from '@/shared/components/Input';
import { useFormatters } from '@/shared/hooks/useFormatters';
import { cn } from '@/shared/utils/cn';
import type { AgentSettlement } from '@/lib/api-types';

function useCashSettlements(date: string) {
  return useQuery({
    queryKey: ['settlements', date],
    queryFn: () => apiClient.get<AgentSettlement[]>('/settlements', { params: date ? { date } : {} }).then((r) => r.data),
  });
}

export function CashSettlementPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { formatCurrency, formatNumber } = useFormatters();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0] ?? '');

  const { data: settlements, isLoading } = useCashSettlements(date);

  const settleMutation = useMutation({
    mutationFn: (agentId: string) =>
      apiClient.post<AgentSettlement>(`/settlements/${agentId}/settle`).then((r) => r.data),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['settlements'] }),
  });

  const totals = settlements
    ? {
        expected:   settlements.reduce((s, r) => s + r.expectedAmount, 0),
        collected:  settlements.reduce((s, r) => s + r.collectedAmount, 0),
        difference: settlements.reduce((s, r) => s + r.difference, 0),
      }
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-extrabold text-surface-900 dark:text-white">{t('cashSettlement.title')}</h1>
        <Input
          id="settlement-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          containerClassName="w-48"
        />
      </div>

      {/* Summary cards */}
      {totals && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-surface-100 dark:border-slate-800 shadow-card p-5 text-center">
            <p className="text-xs font-bold text-surface-500 dark:text-slate-400 uppercase tracking-wide mb-2">{t('cashSettlement.expectedAmount')}</p>
            <p className="text-2xl font-extrabold text-surface-900 dark:text-white">{formatCurrency(totals.expected)}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-surface-100 dark:border-slate-800 shadow-card p-5 text-center">
            <p className="text-xs font-bold text-surface-500 dark:text-slate-400 uppercase tracking-wide mb-2">{t('cashSettlement.collectedAmount')}</p>
            <p className="text-2xl font-extrabold text-success-700 dark:text-success-400">{formatCurrency(totals.collected)}</p>
          </div>
          <div className={cn('rounded-2xl border shadow-card p-5 text-center', totals.difference < 0 ? 'bg-danger-50 border-danger-200' : totals.difference > 0 ? 'bg-warning-50 border-warning-200' : 'bg-success-50 border-success-200')}>
            <p className="text-xs font-bold text-surface-500 uppercase tracking-wide mb-2">{t('cashSettlement.difference')}</p>
            <p className={cn('text-2xl font-extrabold', totals.difference < 0 ? 'text-danger-700' : totals.difference > 0 ? 'text-warning-700' : 'text-success-700')}>
              {totals.difference === 0 ? '✓ مطابق' : (totals.difference > 0 ? '+' : '') + formatCurrency(totals.difference)}
            </p>
          </div>
        </div>
      )}

      <Table>
        <Thead>
          <Tr>
            <Th>{t('cashSettlement.agentName')}</Th>
            <Th>{t('cashSettlement.expectedAmount')}</Th>
            <Th>{t('cashSettlement.collectedAmount')}</Th>
            <Th>{t('cashSettlement.difference')}</Th>
            <Th>{t('cashSettlement.deliveredOrders')}</Th>
            <Th>{t('cashSettlement.failedOrders')}</Th>
            <Th>{t('common.status')}</Th>
            <Th>{t('common.actions')}</Th>
          </Tr>
        </Thead>
        {isLoading ? (
          <TableSkeleton cols={8} />
        ) : !settlements?.length ? (
          <TableEmpty cols={8} message={t('cashSettlement.noSettlements')} />
        ) : (
          <Tbody>
            {settlements.map((row) => {
              const hasMismatch = row.difference !== 0;
              return (
                <Tr key={row.agentId} className={hasMismatch && !row.settled ? 'bg-danger-50/50' : ''}>
                  <Td className="font-semibold">{row.agentName}</Td>
                  <Td>{formatCurrency(row.expectedAmount)}</Td>
                  <Td>{formatCurrency(row.collectedAmount)}</Td>
                  <Td>
                    <span className={cn('font-bold', row.difference < 0 ? 'text-danger-600' : row.difference > 0 ? 'text-warning-600' : 'text-success-600')}>
                      {row.difference === 0 ? '✓' : (row.difference > 0 ? '+' : '') + formatCurrency(row.difference)}
                    </span>
                  </Td>
                  <Td>{formatNumber(row.deliveredOrders)}</Td>
                  <Td>{formatNumber(row.failedOrders)}</Td>
                  <Td>
                    {row.settled
                      ? <Badge variant="success" dot>{t('cashSettlement.settled')}</Badge>
                      : <Badge variant="warning" dot>{t('cashSettlement.notSettled')}</Badge>
                    }
                  </Td>
                  <Td>
                    {!row.settled && (
                      <Button
                        variant="secondary"
                        size="sm"
                        loading={settleMutation.isPending}
                        onClick={() => settleMutation.mutate(row.agentId)}
                      >
                        {t('cashSettlement.markSettled')}
                      </Button>
                    )}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        )}
      </Table>
    </div>
  );
}
