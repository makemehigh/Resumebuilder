'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Screen1MainView from './Screen1MainView';
import Screen2PersonalEdit from './Screen2PersonalEdit';
import Screen3SectionEdit from './Screen3SectionEdit';
import { createEmptyEntry, isEntryEmpty, getSectionConfig } from './sectionManager';

export const SCREENS = {
  MAIN: 'main',
  PERSONAL: 'personal',
  SECTION: 'section'
};

export default function ResumeEditorContent({
  content,
  sections,
  onPersonalDetailsChange,
  onSectionUpdate,
  onSectionVisibilityToggle,
  onAddCustomSection,
  onEditEntry,
  onDeleteEntry,
  onReorderEntries
}) {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.MAIN);
  const [expandedSections, setExpandedSections] = useState({});
  const [editingSection, setEditingSection] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [isNewEntry, setIsNewEntry] = useState(false);
  const [isSingleSection, setIsSingleSection] = useState(false);

  useEffect(() => {
    const initialExpanded = {};
    sections.forEach(s => {
      initialExpanded[s.id] = false;
    });
    setExpandedSections(initialExpanded);
  }, [sections]);

  const handleToggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handlePersonalEdit = () => {
    setCurrentScreen(SCREENS.PERSONAL);
  };

  const handlePersonalSave = (personalDetails) => {
    Object.entries(personalDetails).forEach(([field, value]) => {
      onPersonalDetailsChange(field, value);
    });
    setCurrentScreen(SCREENS.MAIN);
  };

  const handleSectionEdit = (sectionId, entryId = null) => {
    const config = getSectionConfig(sectionId);
    const section = sections.find(s => s.id === sectionId);
    setEditingSection(sectionId);
    
    if (entryId) {
      const entry = section?.content?.items?.find(i => i.id === entryId);
      setEditingEntry(entry || null);
      setIsNewEntry(false);
      setIsSingleSection(false);
    } else if (config?.type === 'list') {
      const newEntry = createEmptyEntry(sectionId);
      setEditingEntry(newEntry);
      setIsNewEntry(true);
      setIsSingleSection(false);
    } else {
      setEditingEntry(section?.content || { text: '' });
      setIsNewEntry(false);
      setIsSingleSection(true);
    }
    setCurrentScreen(SCREENS.SECTION);
  };

  const handleAddEntry = (sectionId) => {
    const newEntry = createEmptyEntry(sectionId);
    setEditingSection(sectionId);
    setEditingEntry(newEntry);
    setIsNewEntry(true);
    setIsSingleSection(false);
    setCurrentScreen(SCREENS.SECTION);
  };

  const handleEntrySave = (entryData) => {
    const section = sections.find(s => s.id === editingSection);
    if (!section) return;
    
    const currentItems = section?.content?.items || [];

    if (isSingleSection) {
      onSectionUpdate(editingSection, { ...(section.content || {}), ...entryData });
    } else {
      let newItems;
      if (isNewEntry) {
        if (!isEntryEmpty(editingSection, entryData)) {
          newItems = [...currentItems, entryData];
        } else {
          newItems = currentItems;
        }
      } else {
        if (isEntryEmpty(editingSection, entryData)) {
          newItems = currentItems.filter(item => item.id !== entryData.id);
        } else {
          newItems = currentItems.map(item => 
            item.id === entryData.id ? entryData : item
          );
        }
      }

      onSectionUpdate(editingSection, { ...(section.content || {}), items: newItems });
    }
    
    setCurrentScreen(SCREENS.MAIN);
    setEditingSection(null);
    setEditingEntry(null);
    setIsNewEntry(false);
    setIsSingleSection(false);
  };

  const handleDeleteEntry = (sectionId, entryId) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;
    
    const currentItems = section?.content?.items || [];
    const newItems = currentItems.filter(item => item.id !== entryId);

    onSectionUpdate(sectionId, { ...(section.content || {}), items: newItems });
  };

  const handleReorderEntries = (sectionId, newOrder) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;
    
    const currentItems = section?.content?.items || [];
    const reorderedItems = newOrder.map(id => currentItems.find(item => item.id === id)).filter(Boolean);

    onSectionUpdate(sectionId, { ...(section.content || {}), items: reorderedItems });
  };

  const handleEntryDelete = () => {
    if (isSingleSection) {
      onSectionUpdate(editingSection, { text: '' });
    } else {
      if (!editingEntry?.id) return;
      
      const section = sections.find(s => s.id === editingSection);
      if (!section) return;
      
      const currentItems = section?.content?.items || [];
      const newItems = currentItems.filter(item => item.id !== editingEntry.id);

      onSectionUpdate(editingSection, { ...(section.content || {}), items: newItems });
    }
    
    setCurrentScreen(SCREENS.MAIN);
    setEditingSection(null);
    setEditingEntry(null);
    setIsNewEntry(false);
    setIsSingleSection(false);
  };

  const handleBack = () => {
    setCurrentScreen(SCREENS.MAIN);
    setEditingSection(null);
    setEditingEntry(null);
    setIsNewEntry(false);
    setIsSingleSection(false);
  };

  const handleEntryVisibilityToggle = (isVisible) => {
    if (isSingleSection) {
      if (onSectionVisibilityToggle) {
        onSectionVisibilityToggle(editingSection);
      }
      return;
    }

    if (!editingEntry?.id) return;

    const section = sections.find(s => s.id === editingSection);
    if (!section) return;
    
    const currentItems = section?.content?.items || [];
    const newItems = currentItems.map(item => 
      item.id === editingEntry.id ? { ...item, isVisible } : item
    );

    onSectionUpdate(editingSection, { ...(section.content || {}), items: newItems });
    setEditingEntry(prev => ({ ...prev, isVisible }));
  };

  return (
    <div className="h-full overflow-hidden">
      <AnimatePresence mode="wait">
        {currentScreen === SCREENS.MAIN && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full overflow-y-auto p-4"
          >
            <Screen1MainView
              personalDetails={content.personalDetails}
              sections={sections}
              onPersonalEdit={handlePersonalEdit}
              onSectionEdit={(sectionId) => handleSectionEdit(sectionId)}
              onSectionToggle={handleToggleSection}
              onSectionVisibilityToggle={onSectionVisibilityToggle}
              onAddEntry={handleAddEntry}
              onEditEntry={(sectionId, entryId) => handleSectionEdit(sectionId, entryId)}
              onDeleteEntry={handleDeleteEntry}
              onReorderEntries={handleReorderEntries}
              expandedSections={expandedSections}
              onAddCustomSection={onAddCustomSection}
            />
          </motion.div>
        )}

        {currentScreen === SCREENS.PERSONAL && (
          <Screen2PersonalEdit
            key="personal"
            personalDetails={content.personalDetails}
            onSave={handlePersonalSave}
            onBack={handleBack}
          />
        )}

        {currentScreen === SCREENS.SECTION && (
          <Screen3SectionEdit
            key={`section-${editingSection}-${editingEntry?.id}`}
            sectionId={editingSection}
            entry={editingEntry}
            isNew={isNewEntry}
            isSingleSection={isSingleSection}
            onSave={handleEntrySave}
            onBack={handleBack}
            onDelete={handleEntryDelete}
            onToggleVisibility={handleEntryVisibilityToggle}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
