import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { apiClient } from '@/lib/api-client';
import { Table, Thead, Tbody, Tr, Th, Td, TableSkeleton, TableEmpty, Pagination } from '@/shared/components/Table';
import { Button } from '@/shared/components/Button';
import { Badge } from '@/shared/components/Badge';
import { Modal } from '@/shared/components/Modal';
import { Input } from '@/shared/components/Input';
import { useFormatters } from '@/shared/hooks/useFormatters';
import type { Product, PaginatedResponse, StockAdjustment } from '@/lib/api-types';

export function InventoryPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { formatCurrency, formatNumber } = useFormatters();
  const [page, setPage] = useState(0);
  const [adjustProduct, setAdjustProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState('');
  const [reason, setReason] = useState('');

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['products', page],
    queryFn: () => apiClient.get<PaginatedResponse<Product>>('/inventory/products', { params: { page, size: 10 } }).then((r) => r.data),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (!data) return;
    const nextPage = page + 1;
    if (nextPage >= data.totalPages) return;
    void queryClient.prefetchQuery({
      queryKey: ['products', nextPage],
      queryFn: () =>
        apiClient
          .get<PaginatedResponse<Product>>('/inventory/products', { params: { page: nextPage, size: 10 } })
          .then((r) => r.data),
    });
  }, [data, page, queryClient]);

  const adjustMutation = useMutation({
    mutationFn: ({ productId, ...rest }: StockAdjustment) =>
      apiClient.post<Product>(`/inventory/products/${productId}/adjust`, rest).then((r) => r.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['products'] });
      setAdjustProduct(null); setQty(''); setReason('');
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-surface-900 dark:text-white">{t('inventory.title')}</h1>

      <Table>
        <Thead>
          <Tr>
            <Th>{t('inventory.sku')}</Th>
            <Th>{t('inventory.productName')}</Th>
            <Th>{t('inventory.category')}</Th>
            <Th>{t('inventory.currentStock')}</Th>
            <Th>{t('inventory.unitPrice')}</Th>
            <Th>{t('inventory.stockLevel')}</Th>
            <Th>{t('common.actions')}</Th>
          </Tr>
        </Thead>
        {isLoading ? (
          <TableSkeleton cols={7} />
        ) : !data?.content.length ? (
          <TableEmpty cols={7} message={t('inventory.noProducts')} />
        ) : (
          <Tbody>
            {data.content.map((product) => {
              const isLow  = product.currentStock > 0 && product.currentStock <= product.lowStockThreshold;
              const isOut  = product.currentStock === 0;
              return (
                <Tr key={product.id}>
                  <Td className="font-mono text-xs text-surface-500">{product.sku}</Td>
                  <Td className="font-semibold">{product.name}</Td>
                  <Td>{product.category}</Td>
                  <Td>
                    <span className={`font-bold text-lg ${isOut ? 'text-danger-600' : isLow ? 'text-warning-600' : 'text-success-700'}`}>
                      {formatNumber(product.currentStock)}
                    </span>
                    <span className="text-xs text-surface-400 ms-1">{product.unit}</span>
                  </Td>
                  <Td className="font-semibold">{formatCurrency(product.unitPrice)}</Td>
                  <Td>
                    {isOut  ? <Badge variant="danger">نفد المخزون</Badge>
                    : isLow ? <Badge variant="warning" dot>مخزون منخفض</Badge>
                    : <Badge variant="success" dot>متوفر</Badge>}
                  </Td>
                  <Td>
                    <Button variant="secondary" size="sm" onClick={() => setAdjustProduct(product)}>
                      {t('inventory.adjustStock')}
                    </Button>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        )}
      </Table>
      {data && data.totalPages > 1 && (
        <Pagination page={page} totalPages={data.totalPages} totalElements={data.totalElements} size={10} onPageChange={setPage} isLoading={isLoading || isFetching} />
      )}

      <Modal
        isOpen={!!adjustProduct}
        onClose={() => setAdjustProduct(null)}
        title={t('inventory.adjustStock')}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAdjustProduct(null)}>{t('common.cancel')}</Button>
            <Button
              onClick={() => adjustMutation.mutate({ productId: adjustProduct!.id, quantity: parseInt(qty) || 0, reason })}
              loading={adjustMutation.isPending}
            >
              {t('common.save')}
            </Button>
          </>
        }
      >
        {adjustProduct && (
          <div className="space-y-4">
            <p className="text-sm text-surface-600">تعديل مخزون: <strong>{adjustProduct.name}</strong></p>
            <p className="text-sm text-surface-500">المخزون الحالي: <strong>{formatNumber(adjustProduct.currentStock)} {adjustProduct.unit}</strong></p>
            <Input
              id="adj-qty"
              label={t('inventory.adjustmentQuantity')}
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              helperText="أدخل رقمًا موجبًا للإضافة أو سالبًا للخصم"
              inputMode="numeric"
            />
            <Input
              id="adj-reason"
              label={t('inventory.adjustmentReason')}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="مثال: استلام شحنة جديدة"
              required
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
