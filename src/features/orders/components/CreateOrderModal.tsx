import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/shared/components/Modal';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { Select } from '@/shared/components/Select';
import { ordersApi } from '../api';
import { agentsApi } from '@/features/agents/api';
import { apiClient } from '@/lib/api-client';
import { useFormatters } from '@/shared/hooks/useFormatters';
import type { CreateOrderRequest, PaymentMethod, Product } from '@/lib/api-types';

interface Props { isOpen: boolean; onClose: () => void; }

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: 'COD',           label: 'الدفع عند الاستلام' },
  { value: 'PREPAID',       label: 'مدفوع مسبقًا' },
  { value: 'BANK_TRANSFER', label: 'تحويل بنكي' },
];

type Step = 1 | 2 | 3;

export function CreateOrderModal({ isOpen, onClose }: Props) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<Step>(1);
  const { formatCurrency } = useFormatters();

  const [customerName, setCustomerName]   = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [street, setStreet]               = useState('');
  const [city, setCity]                   = useState('');
  const [governorate, setGovernorate]     = useState('');
  const [addressNotes, setAddressNotes]   = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [selectedItems, setSelectedItems] = useState<Array<{ productId: string; quantity: number; name: string; price: number }>>([]);
  const [agentId, setAgentId]             = useState('');

  const { data: productsData } = useQuery({
    queryKey: ['products'],
    queryFn: () => apiClient.get<{ content: Product[] }>('/inventory/products', { params: { page: 0, size: 100 } }).then((r) => r.data),
    enabled: step === 2,
  });

  const { data: agentsData } = useQuery({
    queryKey: ['agents', 0],
    queryFn: () => agentsApi.list({ page: 0, size: 100 }),
    enabled: step === 3,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateOrderRequest) => ordersApi.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      handleClose();
    },
  });

  const handleClose = () => {
    setStep(1); setCustomerName(''); setCustomerPhone(''); setStreet(''); setCity('');
    setGovernorate(''); setAddressNotes(''); setSelectedItems([]); setAgentId('');
    onClose();
  };

  const totalAmount = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = () => {
    createMutation.mutate({
      customerName, customerPhone,
      deliveryAddress: { street, city, governorate, notes: addressNotes || undefined },
      items: selectedItems.map(({ productId, quantity }) => ({ productId, quantity })),
      paymentMethod,
    });
  };

  const addItem = (productId: string) => {
    const product = productsData?.content.find((p) => p.id === productId);
    if (!product) return;
    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) return prev.map((i) => i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { productId, quantity: 1, name: product.name, price: product.unitPrice }];
    });
  };

  const stepTitles: Record<Step, string> = {
    1: t('orders.stepCustomer'),
    2: t('orders.stepItems'),
    3: t('orders.stepAssign'),
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`${t('orders.createOrder')} — ${stepTitles[step]}`} size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-1.5">
            {([1,2,3] as Step[]).map((s) => (
              <div key={s} className={`h-2 rounded-full transition-all ${s === step ? 'w-8 bg-primary-600' : s < step ? 'w-2 bg-primary-300' : 'w-2 bg-surface-200'}`} />
            ))}
          </div>
          <div className="flex gap-3">
            {step > 1 && <Button variant="secondary" onClick={() => setStep((s) => (s - 1) as Step)}>{t('common.back')}</Button>}
            {step < 3 && <Button onClick={() => setStep((s) => (s + 1) as Step)}>{t('common.next')}</Button>}
            {step === 3 && <Button onClick={handleSubmit} loading={createMutation.isPending}>{t('common.submit')}</Button>}
          </div>
        </div>
      }
    >
      {step === 1 && (
        <div className="space-y-4">
          <Input id="co-cname" label={t('orders.customerName')} value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
          <Input id="co-cphone" label={t('orders.customerPhone')} value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} type="tel" required />
          <Input id="co-street" label={t('orders.street')} value={street} onChange={(e) => setStreet(e.target.value)} required />
          <div className="grid grid-cols-2 gap-4">
            <Input id="co-city" label={t('orders.city')} value={city} onChange={(e) => setCity(e.target.value)} required />
            <Input id="co-gov" label={t('orders.governorate')} value={governorate} onChange={(e) => setGovernorate(e.target.value)} required />
          </div>
          <Input id="co-anotes" label={t('orders.addressNotes')} value={addressNotes} onChange={(e) => setAddressNotes(e.target.value)} />
          <Select
            id="co-payment"
            label={t('orders.paymentMethod')}
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            options={PAYMENT_OPTIONS}
          />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <Select
            id="co-product"
            label={t('orders.selectProduct')}
            value=""
            onChange={(e) => addItem(e.target.value)}
            options={productsData?.content.map((p) => ({ value: p.id, label: `${formatCurrency(p.unitPrice)}` })) ?? []}
            placeholder={t('orders.selectProduct')}
          />
          {selectedItems.length > 0 && (
            <div className="border border-surface-200 rounded-xl divide-y divide-surface-100">
              {selectedItems.map((item) => (
                <div key={item.productId} className="flex items-center gap-3 px-4 py-3">
                  <span className="flex-1 text-sm font-medium">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setSelectedItems((p) => p.map((i) => i.productId === item.productId ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i))} className="w-7 h-7 rounded-lg border border-surface-200 flex items-center justify-center hover:bg-surface-100 text-lg">−</button>
                    <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                    <button onClick={() => setSelectedItems((p) => p.map((i) => i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i))} className="w-7 h-7 rounded-lg border border-surface-200 flex items-center justify-center hover:bg-surface-100 text-lg">+</button>
                  </div>
                  <span className="text-sm font-semibold w-24 text-end">{formatCurrency(item.price * item.quantity)}</span>
                  <button onClick={() => setSelectedItems((p) => p.filter((i) => i.productId !== item.productId))} className="text-danger-500 hover:text-danger-700 text-sm">��✕</button>
                </div>
              ))}
              <div className="flex items-center justify-between px-4 py-3 bg-surface-50">
                <span className="font-bold text-surface-700">{t('common.total')}</span>
                <span className="font-extrabold text-surface-900">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <p className="text-sm text-surface-500">تعيين مندوب (اختياري — يمكن التعيين لاحقًا)</p>
          <div className="grid grid-cols-2 gap-3">
            {agentsData?.content.filter((a) => a.status === 'ACTIVE').map((agent) => (
              <button
                key={agent.id}
                onClick={() => setAgentId(agentId === agent.id ? '' : agent.id)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 text-start transition-all ${agentId === agent.id ? 'border-primary-500 bg-primary-50' : 'border-surface-200 hover:border-surface-300'}`}
              >
                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold flex-shrink-0">{agent.name.charAt(0)}</div>
                <div>
                  <p className="font-semibold text-sm">{agent.name}</p>
                  <p className="text-xs text-surface-500">{agent.zone}</p>
                </div>
              </button>
            ))}
          </div>
          {/* Order summary */}
          <div className="bg-surface-50 rounded-xl p-4 space-y-2 text-sm mt-4">
            <p><span className="text-surface-500">العميل:</span> <strong>{customerName}</strong></p>
            <p><span className="text-surface-500">العنوان:</span> <strong>{street}، {city}، {governorate}</strong></p>
            <p><span className="text-surface-500">إجمالي المبلغ:</span> <strong>{formatCurrency(totalAmount)}</strong></p>
            <p><span className="text-surface-500">طريقة الدفع:</span> <strong>{PAYMENT_OPTIONS.find((p) => p.value === paymentMethod)?.label}</strong></p>
          </div>
        </div>
      )}
    </Modal>
  );
}