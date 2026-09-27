import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { agentsApi } from './api';
import { Table, Thead, Tbody, Tr, Th, Td, TableSkeleton, TableEmpty, Pagination } from '@/shared/components/Table';
import { Button } from '@/shared/components/Button';
import { Badge } from '@/shared/components/Badge';
import { Modal } from '@/shared/components/Modal';
import { Input } from '@/shared/components/Input';
import { Select } from '@/shared/components/Select';
import type { Agent, CreateAgentRequest, AgentStatus, VehicleType } from '@/lib/api-types';

const statusVariant: Record<AgentStatus, 'success' | 'neutral' | 'warning'> = {
  ACTIVE:   'success',
  INACTIVE: 'neutral',
  ON_LEAVE: 'warning',
};

const VEHICLE_OPTIONS: { value: VehicleType; label: string }[] = [
  { value: 'MOTORCYCLE', label: 'دراجة نارية' },
  { value: 'CAR',        label: 'سيارة' },
  { value: 'VAN',        label: 'فان' },
  { value: 'TRUCK',      label: 'شاحنة' },
];

const EMPTY_FORM: CreateAgentRequest = {
  name: '', phone: '', zone: '', vehicleType: 'MOTORCYCLE', vehiclePlate: '', nationalId: '',
};

export function AgentsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editAgent, setEditAgent] = useState<Agent | null>(null);
  const [form, setForm] = useState<CreateAgentRequest>(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<Agent | null>(null);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['agents', page],
    queryFn: () => agentsApi.list({ page, size: 10 }),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (!data) return;
    const nextPage = page + 1;
    if (nextPage >= data.totalPages) return;
    void queryClient.prefetchQuery({
      queryKey: ['agents', nextPage],
      queryFn: () => agentsApi.list({ page: nextPage, size: 10 }),
    });
  }, [data, page, queryClient]);

  const createMutation = useMutation({
    mutationFn: agentsApi.create,
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ['agents'] }); closeModal(); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateAgentRequest }) => agentsApi.update(id, data),
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ['agents'] }); closeModal(); },
  });

  const deleteMutation = useMutation({
    mutationFn: agentsApi.remove,
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ['agents'] }); setDeleteConfirm(null); },
  });

  const openAdd = () => { setEditAgent(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (agent: Agent) => {
    setEditAgent(agent);
    setForm({ name: agent.name, phone: agent.phone, zone: agent.zone, vehicleType: agent.vehicleType, vehiclePlate: agent.vehiclePlate ?? '', nationalId: agent.nationalId ?? '' });
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditAgent(null); };

  const handleSubmit = () => {
    if (editAgent) {
      updateMutation.mutate({ id: editAgent.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const set = (field: keyof CreateAgentRequest) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-surface-900 dark:text-white">{t('agents.title')}</h1>
        <Button onClick={openAdd} leftIcon={<span aria-hidden>+</span>} id="add-agent-btn">
          {t('agents.addAgent')}
        </Button>
      </div>

      <div>
        <Table>
          <Thead>
            <Tr>
              <Th>{t('common.name')}</Th>
              <Th>{t('common.phone')}</Th>
              <Th>{t('agents.zone')}</Th>
              <Th>{t('agents.vehicleType')}</Th>
              <Th>{t('common.status')}</Th>
              <Th>{t('common.actions')}</Th>
            </Tr>
          </Thead>
          {isLoading ? (
            <TableSkeleton cols={6} />
          ) : data?.content.length === 0 ? (
            <TableEmpty cols={6} message={t('agents.noAgents')} />
          ) : (
            <Tbody>
              {data?.content.map((agent) => (
                <Tr key={agent.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {agent.name.charAt(0)}
                      </div>
                      <span className="font-medium">{agent.name}</span>
                    </div>
                  </Td>
                  <Td className="font-mono text-sm">{agent.phone}</Td>
                  <Td>{agent.zone}</Td>
                  <Td>{t(`agents.${agent.vehicleType}`)}</Td>
                  <Td>
                    <Badge variant={statusVariant[agent.status]} dot>
                      {t(`agents.${agent.status}`)}
                    </Badge>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <Button variant="secondary" size="sm" onClick={() => openEdit(agent)}>{t('common.edit')}</Button>
                      <Button variant="danger" size="sm" onClick={() => setDeleteConfirm(agent)}>{t('common.delete')}</Button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          )}
        </Table>
        {data && data.totalPages > 1 && (
          <Pagination page={page} totalPages={data.totalPages} totalElements={data.totalElements} size={10} onPageChange={setPage} isLoading={isLoading || isFetching} />
        )}
      </div>

      {/* Add/Edit modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editAgent ? t('agents.editAgent') : t('agents.addAgent')}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>{t('common.cancel')}</Button>
            <Button onClick={handleSubmit} loading={isSaving}>{t('common.save')}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input id="agent-name" label={t('agents.agentName')} value={form.name} onChange={set('name')} required />
          <Input id="agent-phone" label={t('common.phone')} value={form.phone} onChange={set('phone')} type="tel" required />
          <Input id="agent-zone" label={t('agents.zone')} value={form.zone} onChange={set('zone')} required />
          <Select
            id="agent-vehicle"
            label={t('agents.vehicleType')}
            value={form.vehicleType}
            onChange={set('vehicleType') as (e: React.ChangeEvent<HTMLSelectElement>) => void}
            options={VEHICLE_OPTIONS}
            required
          />
          <Input id="agent-plate" label={t('agents.vehiclePlate')} value={form.vehiclePlate ?? ''} onChange={set('vehiclePlate')} />
          <Input id="agent-nid" label={t('agents.nationalId')} value={form.nationalId ?? ''} onChange={set('nationalId')} />
        </div>
      </Modal>

      {/* Delete confirm modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title={t('agents.deleteConfirm')}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>{t('common.cancel')}</Button>
            <Button variant="danger" loading={deleteMutation.isPending} onClick={() => deleteConfirm && deleteMutation.mutate(deleteConfirm.id)}>
              {t('common.delete')}
            </Button>
          </>
        }
      >
        <p className="text-surface-600">هل أنت متأكد من حذف المندوب <strong>{deleteConfirm?.name}</strong>؟ لا يمكن التراجع عن هذا الإجراء.</p>
      </Modal>
    </div>
  );
}
