'use client';

import { User, Mail, Phone, MapPin, Plus } from 'lucide-react';
import CollapsibleSection from './CollapsibleSection';
import { sectionManager, SECTION_ICONS, formatEntryTitle, getEntryPreview, isEntryEmpty } from './sectionManager';
import { SECTION_CONFIG } from '../../../src/data/templates';

export default function Screen1MainView({
  personalDetails,
  sections,
  onPersonalEdit,
  onSectionEdit,
  onSectionToggle,
  onSectionVisibilityToggle,
  onAddEntry,
  onEditEntry,
  onDeleteEntry,
  onReorderEntries,
  expandedSections,
  onAddCustomSection
}) {
  const getSectionItems = (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    const items = section?.content?.items || [];
    return items.filter(item => !isEntryEmpty(sectionId, item));
  };

  const getSectionPreview = (sectionId) => {
    const items = getSectionItems(sectionId);
    return items.slice(0, 3).map(item => {
      const preview = getEntryPreview(sectionId, item);
      return preview.join(' • ') || formatEntryTitle(sectionId, item);
    });
  };

  const getEntryItemsForSection = (sectionId) => {
    const items = getSectionItems(sectionId);
    return items.map(item => ({
      id: item.id,
      title: formatEntryTitle(sectionId, item),
      preview: getEntryPreview(sectionId, item).join(' • ') || formatEntryTitle(sectionId, item)
    }));
  };

  const getSectionVisibility = (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    return section?.isVisible ?? true;
  };

  const handleSectionVisibilityToggle = (sectionId) => {
    if (onSectionVisibilityToggle) {
      onSectionVisibilityToggle(sectionId);
    }
  };

  return (
    <div className="space-y-3">
      {/* Personal Information - Fixed at top */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
        <div 
          className="flex items-center justify-between px-4 py-3 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
          onClick={onPersonalEdit}
        >
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-slate-500" />
            <span className="font-medium text-slate-800">Personal Information</span>
          </div>
          <button
            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onPersonalEdit();
            }}
          >
            Edit
          </button>
        </div>
        
        <div className="px-4 py-3 border-t border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-1">
            {personalDetails?.fullName || 'Your Name'}
          </h2>
          <p className="text-sm text-blue-600 font-medium mb-3">
            {personalDetails?.jobTitle || 'Professional Title'}
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            {personalDetails?.email && (
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{personalDetails.email}</span>
              </div>
            )}
            {personalDetails?.phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{personalDetails.phone}</span>
              </div>
            )}
            {personalDetails?.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{personalDetails.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Collapsible Sections - use sections from resume content */}
      {sections
        .filter(section => {
          if (section.type === 'custom') return true;
          if (section.type === 'fixed') return false;
          if (section.type === 'profile') return false;
          
          return true;
        })
        .map(section => {
          const config = sectionManager.sections.find(s => 
            s.id === section.id || s.id === section.type
          );
          const isCustom = section.type === 'custom';
          const items = getSectionItems(section.id);
          const Icon = isCustom ? null : (SECTION_ICONS[section.id] || SECTION_ICONS[section.type]);
          const emoji = isCustom ? '📋' : (SECTION_CONFIG[section.id]?.emoji || SECTION_CONFIG[section.type]?.emoji || config?.emoji);
          
          return (
            <CollapsibleSection
              key={section.id}
              title={section.title || config?.title || section.id}
              icon={Icon}
              emoji={emoji}
              isExpanded={expandedSections[section.id] || false}
              onToggle={() => onSectionToggle(section.id)}
              onEdit={() => onSectionEdit(section.id)}
              isVisible={section.isVisible !== false}
              onVisibilityToggle={() => handleSectionVisibilityToggle(section.id)}
              itemCount={items.length}
              previewItems={getSectionPreview(section.id)}
              entryItems={getEntryItemsForSection(section.id)}
              onEditEntry={(entryId) => onEditEntry?.(section.id, entryId)}
              onDeleteEntry={(entryId) => onDeleteEntry?.(section.id, entryId)}
              onReorderEntries={(newOrder) => onReorderEntries?.(section.id, newOrder)}
              addButtonLabel={isCustom ? 'Add Entry' : `Add ${(section.title || config?.title || section.id).replace(/s$/, '')}`}
              onAdd={() => onAddEntry(section.id)}
              canAdd={!isCustom && config?.type === 'list'}
            />
          );
        })}
      
      {/* Add Custom Section Button */}
      <button
        onClick={onAddCustomSection}
        className="w-full py-3 px-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        <span className="font-medium">Add Custom Section</span>
      </button>
    </div>
  );
}
