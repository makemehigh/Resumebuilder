'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Eye, EyeOff, Pencil, GripVertical, Trash2, Plus } from 'lucide-react';
import { useState } from 'react';

export default function CollapsibleSection({
  title,
  icon: Icon,
  emoji,
  isExpanded,
  onToggle,
  onEdit,
  isVisible = true,
  onVisibilityToggle,
  itemCount = 0,
  previewItems = [],
  entryItems = [],
  onEditEntry,
  onDeleteEntry,
  children,
  addButtonLabel = 'Add Entry',
  onAdd,
  canAdd = true,
  className = ''
}) {
  return (
    <div className={`border border-slate-200 rounded-xl overflow-hidden bg-white ${className}`}>
      <div 
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          {emoji ? (
            <span className="text-lg">{emoji}</span>
          ) : Icon ? (
            <Icon className="w-5 h-5 text-slate-500" />
          ) : null}
          <span className="font-medium text-slate-800">{title}</span>
          {itemCount > 0 && (
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
              {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          )}
          
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-1.5 rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
              title="Edit section"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
          
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-slate-400" />
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
                <div className="mt-3 space-y-2">
                  {entryItems.map((item, index) => (
                    <div 
                      key={item.id || index} 
                      className="group flex items-center justify-between p-3 bg-slate-50 rounded-lg text-sm hover:bg-slate-100 transition-colors cursor-pointer"
                      onClick={() => onEditEntry?.(item.id)}
                    >
                      <span className="text-slate-700 flex-1">{item.title || item.preview}</span>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditEntry?.(item.id);
                          }}
                          className="p-1.5 rounded text-blue-600 hover:bg-blue-100"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteEntry?.(item.id);
                          }}
                          className="p-1.5 rounded text-red-500 hover:bg-red-100"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
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
                  <Plus className="w-4 h-4" />
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
        <GripVertical className="w-4 h-4" />
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
            {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
        )}
        
        {onEdit && (
          <button
            onClick={onEdit}
            className="p-1.5 rounded text-blue-600 hover:bg-blue-100"
            title="Edit"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        )}
        
        {onDelete && (
          <button
            onClick={onDelete}
            className="p-1.5 rounded text-red-500 hover:bg-red-50"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
