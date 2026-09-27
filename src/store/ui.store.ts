/**
 * ui.store.ts
 * Zustand store for pure UI state: sidebar, modals, drawer.
 * Never holds server data.
 */
import { create } from 'zustand';

interface UiState {
  sidebarOpen: boolean;
  activeModalId: string | null;
  settingsOpen: boolean;

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openModal: (id: string) => void;
  closeModal: () => void;
  openSettings: () => void;
  closeSettings: () => void;
  toggleSettings: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: true,
  activeModalId: null,
  settingsOpen: false,

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  openModal: (id) => set({ activeModalId: id }),
  closeModal: () => set({ activeModalId: null }),
  openSettings: () => set({ settingsOpen: true }),
  closeSettings: () => set({ settingsOpen: false }),
  toggleSettings: () => set((s) => ({ settingsOpen: !s.settingsOpen })),
}));
