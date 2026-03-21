'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  faGripVertical,
  faPen,
  faTrashAlt,
  faCheck,
  faTimes,
  faEye,
  faEyeSlash,
  faChevronDown,
  faPlus
} from '@fortawesome/free-solid-svg-icons';

function SortableItem({ item, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-center justify-between p-3 bg-slate-50 rounded-lg text-sm hover:bg-slate-100 transition-colors"
    >
      <div 
        {...attributes}
        {...listeners}
        className="flex items-center gap-2 cursor-grab active:cursor-grabbing"
      >
        <FontAwesomeIcon icon={faGripVertical} className="w-4 h-4 text-slate-400" />
        <span 
          className="text-slate-700 flex-1 cursor-pointer"
          onClick={() => onEdit?.(item.id)}
        >
          {item.title || item.preview}
        </span>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit?.(item.id)}
          className="p-1.5 rounded text-blue-600 hover:bg-blue-100"
          title="Edit"
        >
          <FontAwesomeIcon icon={faPen} className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete?.(item.id)}
          className="p-1.5 rounded text-red-500 hover:bg-red-100"
          title="Delete"
        >
          <FontAwesomeIcon icon={faTrashAlt} className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function CollapsibleSection({
  title,
  icon: Icon,
  emoji,
  isExpanded,
  onToggle,
  onTitleChange,
  isVisible = true,
  onVisibilityToggle,
  onDeleteSection,
  itemCount = 0,
  previewItems = [],
  entryItems = [],
  onEditEntry,
  onDeleteEntry,
  onReorderEntries,
  children,
  addButtonLabel = 'Add Entry',
  onAdd,
  canAdd = true,
  className = ''
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  
  useEffect(() => {
    setEditedTitle(title);
  }, [title]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleEditClick = () => {
    setIsEditingTitle(true);
    if (!isExpanded && onToggle) {
      onToggle();
    }
  };

  const handleSaveTitle = () => {
    if (onTitleChange && editedTitle.trim()) {
      onTitleChange(editedTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleCancelEdit = () => {
    setEditedTitle(title);
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id && onReorderEntries) {
      const oldIndex = entryItems.findIndex(item => item.id === active.id);
      const newIndex = entryItems.findIndex(item => item.id === over.id);
      const newOrder = arrayMove(entryItems, oldIndex, newIndex).map(item => item.id);
      onReorderEntries(newOrder);
    }
  };

  return (
    <div className={`border border-slate-200 rounded-xl overflow-hidden bg-white ${className}`}>
      <div 
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          {Icon && (
            <FontAwesomeIcon icon={Icon} className="w-5 h-5 text-slate-500" />
          )}
          {isEditingTitle ? (
            <div className="flex items-center gap-2 flex-1" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                onClick={handleSaveTitle}
                className="p-1 rounded text-green-600 hover:bg-green-50"
                title="Save"
              >
                <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancelEdit}
                className="p-1 rounded text-red-500 hover:bg-red-50"
                title="Cancel"
              >
                <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <span className="font-medium text-slate-800">{title}</span>
          )}
          {!isEditingTitle && itemCount > 0 && (
            <span className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded-full">
              {itemCount}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {onVisibilityToggle && (
            <button
              onClick={onVisibilityToggle}
              className={`p-1.5 rounded-full transition-colors ${
                isVisible ? 'text-green-600 hover:bg-green-50' : 'text-slate-400 hover:bg-slate-100'
              }`}
              title={isVisible ? 'Hide section' : 'Show section'}
            >
              <FontAwesomeIcon icon={isVisible ? faEye : faEyeSlash} className="w-4 h-4" />
            </button>
          )}
          
          {onTitleChange && !isEditingTitle && (
            <button
              onClick={handleEditClick}
              className="p-1.5 rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
              title="Edit section name"
            >
              <FontAwesomeIcon icon={faPen} className="w-4 h-4" />
            </button>
          )}
          
          {onDeleteSection && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Are you sure you want to delete the "${title}" section?`)) {
                  onDeleteSection();
                }
              }}
              className="p-1.5 rounded-full text-red-500 hover:bg-red-50 transition-colors"
              title="Delete section"
            >
              <FontAwesomeIcon icon={faTrashAlt} className="w-4 h-4" />
            </button>
          )}
          
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <FontAwesomeIcon icon={faChevronDown} className="w-5 h-5 text-slate-400 cursor-pointer" onClick={onToggle} />
          </motion.div>
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-slate-100">
              {entryItems.length > 0 && (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={entryItems.map(item => item.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="mt-3 space-y-2">
                      {entryItems.map((item) => (
                        <SortableItem
                          key={item.id}
                          item={item}
                          onEdit={onEditEntry}
                          onDelete={onDeleteEntry}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
              
              {previewItems.length > 0 && entryItems.length === 0 && (
                <div className="mt-3 space-y-2">
                  {previewItems.map((item, index) => (
                    <div 
                      key={index} 
                      className="p-2 bg-slate-50 rounded-lg text-sm text-slate-700"
                    >
                      {item}
                    </div>
                  ))}
                  {itemCount > previewItems.length && (
                    <p className="text-xs text-slate-400">
                      +{itemCount - previewItems.length} more...
                    </p>
                  )}
                </div>
              )}
              
              {children}
              
              {canAdd && onAdd && (
                <button
                  onClick={onAdd}
                  className="mt-3 w-full py-2 text-sm text-blue-600 border border-dashed border-blue-300 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                  {addButtonLabel}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DraggableSectionItem({
  children,
  onDelete,
  onEdit,
  onVisibilityToggle,
  isVisible = true,
  dragHandleProps = {}
}) {
  return (
    <div className={`group flex items-start gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100 ${
      isVisible ? '' : 'opacity-50'
    }`}>
      <div 
        {...dragHandleProps}
        className="mt-1 cursor-grab text-slate-400 hover:text-slate-600"
      >
        <FontAwesomeIcon icon={faGripVertical} className="w-4 h-4" />
      </div>
      
      <div className="flex-1">
        {children}
      </div>
      
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onVisibilityToggle && (
          <button
            onClick={onVisibilityToggle}
            className={`p-1.5 rounded hover:bg-slate-200 ${
              isVisible ? 'text-green-600' : 'text-slate-400'
            }`}
            title={isVisible ? 'Hide' : 'Show'}
          >
            <FontAwesomeIcon icon={isVisible ? faEye : faEyeSlash} className="w-3.5 h-3.5" />
          </button>
        )}
        
        {onEdit && (
          <button
            onClick={onEdit}
            className="p-1.5 rounded text-blue-600 hover:bg-blue-100"
            title="Edit"
          >
            <FontAwesomeIcon icon={faPen} className="w-3.5 h-3.5" />
          </button>
        )}
        
        {onDelete && (
          <button
            onClick={onDelete}
            className="p-1.5 rounded text-red-500 hover:bg-red-50"
            title="Delete"
          >
            <FontAwesomeIcon icon={faTrashAlt} className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
