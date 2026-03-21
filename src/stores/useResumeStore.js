import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createEmptyResume, getEmptySectionContent } from '../data/resumeContent';
import { getDefaultCustomization } from '../data/customization';

const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000;

const withExpiry = (storage) => {
  return {
    getItem: (name) => {
      const str = storage.getItem(name);
      if (!str) return null;
      
      try {
        const item = JSON.parse(str);
        
        if (item.expiry && Date.now() > item.expiry) {
          storage.removeItem(name);
          return null;
        }
        
        return str;
      } catch {
        return str;
      }
    },
    setItem: (name, value) => {
      storage.setItem(name, value);
    },
    removeItem: (name) => {
      storage.removeItem(name);
    },
  };
};

export const useResumeStore = create(
  persist(
    (set, get) => ({
      resumes: [],
      currentResume: null,
      isLoading: false,
      isSaving: false,
      lastSaved: null,
      hasUnsavedChanges: false,
      
      setResumes: (resumes) => set({ resumes }),
      
      setCurrentResume: (resume) => set({ 
        currentResume: resume,
        hasUnsavedChanges: false,
      }),
      
      createNewResume: (templateId = 'atlanic-blue') => {
        const newResume = {
          id: `resume-${Date.now()}`,
          name: 'New Resume',
          templateId,
          createdAt: new Date().toISOString(),
          lastEdited: new Date().toISOString(),
          content: createEmptyResume(templateId),
          customization: getDefaultCustomization(templateId),
        };
        
        set((state) => ({
          resumes: [...state.resumes, newResume],
          currentResume: newResume,
          hasUnsavedChanges: true,
        }));
        
        return newResume;
      },
      
      updateResumeName: (name) => set((state) => ({
        currentResume: state.currentResume 
          ? { ...state.currentResume, name, lastEdited: new Date().toISOString() }
          : null,
        hasUnsavedChanges: true,
      })),
      
      updatePersonalDetails: (field, value) => set((state) => {
        if (!state.currentResume) return state;
        
        const content = { ...state.currentResume.content };
        const personalDetails = { ...content.personalDetails, [field]: value };
        
        return {
          currentResume: {
            ...state.currentResume,
            content: { ...content, personalDetails },
            lastEdited: new Date().toISOString(),
          },
          hasUnsavedChanges: true,
        };
      }),
      
      updateSectionContent: (sectionId, content) => set((state) => {
        if (!state.currentResume) return state;
        
        const sections = state.currentResume.content.sections.map(s =>
          s.id === sectionId ? { ...s, content } : s
        );
        
        return {
          currentResume: {
            ...state.currentResume,
            content: { ...state.currentResume.content, sections },
            lastEdited: new Date().toISOString(),
          },
          hasUnsavedChanges: true,
        };
      }),
      
      updateSectionTitle: (sectionId, title) => set((state) => {
        if (!state.currentResume) return state;
        
        const sections = state.currentResume.content.sections.map(s =>
          s.id === sectionId ? { ...s, title } : s
        );
        
        return {
          currentResume: {
            ...state.currentResume,
            content: { ...state.currentResume.content, sections },
            lastEdited: new Date().toISOString(),
          },
          hasUnsavedChanges: true,
        };
      }),
      
      reorderSections: (fromIndex, toIndex) => set((state) => {
        if (!state.currentResume) return state;
        
        const sections = [...state.currentResume.content.sections];
        const [removed] = sections.splice(fromIndex, 1);
        sections.splice(toIndex, 0, removed);
        
        const reorderedSections = sections.map((s, i) => ({ ...s, order: i }));
        
        return {
          currentResume: {
            ...state.currentResume,
            content: { ...state.currentResume.content, sections: reorderedSections },
            lastEdited: new Date().toISOString(),
          },
          hasUnsavedChanges: true,
        };
      }),
      
      addSection: (type, title) => {
        const newSection = {
          id: `${type}-${Date.now()}`,
          type,
          title: title || type.charAt(0).toUpperCase() + type.slice(1),
          order: 0,
          isVisible: true,
          content: getEmptySectionContent(type),
        };
        
        set((state) => {
          if (!state.currentResume) return state;
          
          const sections = [...state.currentResume.content.sections, newSection];
          newSection.order = sections.length - 1;
          
          return {
            currentResume: {
              ...state.currentResume,
              content: {
                ...state.currentResume.content,
                sections,
              },
              lastEdited: new Date().toISOString(),
            },
            hasUnsavedChanges: true,
          };
        });
        
        return newSection;
      },
      
      removeSection: (sectionId) => set((state) => {
        if (!state.currentResume) return state;
        
        const sections = state.currentResume.content.sections.filter(s => s.id !== sectionId);
        
        return {
          currentResume: {
            ...state.currentResume,
            content: { ...state.currentResume.content, sections },
            lastEdited: new Date().toISOString(),
          },
          hasUnsavedChanges: true,
        };
      }),
      
      toggleSectionVisibility: (sectionId) => set((state) => {
        if (!state.currentResume) return state;
        
        const sections = state.currentResume.content.sections.map(s =>
          s.id === sectionId ? { ...s, isVisible: !s.isVisible } : s
        );
        
        return {
          currentResume: {
            ...state.currentResume,
            content: { ...state.currentResume.content, sections },
            lastEdited: new Date().toISOString(),
          },
          hasUnsavedChanges: true,
        };
      }),
      
      updateCustomization: (path, value) => set((state) => {
        if (!state.currentResume) return state;
        
        const keys = path.split('.');
        const customization = JSON.parse(JSON.stringify(state.currentResume.customization));
        
        let current = customization;
        for (let i = 0; i < keys.length - 1; i++) {
          current[keys[i]] = { ...current[keys[i]] };
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        
        return {
          currentResume: {
            ...state.currentResume,
            customization,
            lastEdited: new Date().toISOString(),
          },
          hasUnsavedChanges: true,
        };
      }),
      
      applyTemplate: (templateId) => set((state) => {
        if (!state.currentResume) return state;
        
        return {
          currentResume: {
            ...state.currentResume,
            templateId,
            customization: getDefaultCustomization(templateId),
            lastEdited: new Date().toISOString(),
          },
          hasUnsavedChanges: true,
        };
      }),
      
      deleteResume: (resumeId) => set((state) => ({
        resumes: state.resumes.filter(r => r.id !== resumeId),
        currentResume: state.currentResume?.id === resumeId ? null : state.currentResume,
        hasUnsavedChanges: true,
      })),
      
      duplicateResume: (resumeId) => set((state) => {
        const original = state.resumes.find(r => r.id === resumeId);
        if (!original) return state;
        
        const duplicate = {
          ...original,
          id: `resume-${Date.now()}`,
          name: `${original.name} (Copy)`,
          createdAt: new Date().toISOString(),
          lastEdited: new Date().toISOString(),
        };
        
        return {
          resumes: [...state.resumes, duplicate],
          hasUnsavedChanges: true,
        };
      }),
      
      setLoading: (isLoading) => set({ isLoading }),
      setSaving: (isSaving) => set({ isSaving }),
      setLastSaved: (lastSaved) => set({ lastSaved }),
      
      markSaved: () => set({ hasUnsavedChanges: false, lastSaved: new Date().toISOString() }),
      
      clearCurrentResume: () => set({ currentResume: null, hasUnsavedChanges: false }),
    }),
    {
      name: 'resume-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
