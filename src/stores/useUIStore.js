import { create } from 'zustand';

export const TABS = {
  OVERVIEW: 'overview',
  CONTENT: 'content',
  CUSTOMIZE: 'customize',
  AI_TOOLS: 'ai-tools',
};

export const useUIStore = create((set) => ({
  activeTab: TABS.CONTENT,
  sidebarOpen: true,
  activeModal: null,
  previewZoom: 100,
  isExportingPDF: false,
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),
  
  setPreviewZoom: (zoom) => set({ previewZoom: zoom }),
  
  setExportingPDF: (isExporting) => set({ isExportingPDF: isExporting }),
  
  resetUI: () => set({
    activeTab: TABS.CONTENT,
    sidebarOpen: true,
    activeModal: null,
    previewZoom: 100,
    isExportingPDF: false,
  }),
}));
