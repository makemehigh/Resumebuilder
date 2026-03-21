'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Trash2, Eye, EyeOff, Star, Link2 } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import { DateRangePicker } from './DatePicker';
import { getSectionConfig, SECTION_ICONS, formatEntryTitle } from './sectionManager';
import { SECTION_CONFIG } from '../../../src/data/templates';

export default function Screen3SectionEdit({
  sectionId,
  entry,
  isNew,
  isSingleSection,
  onSave,
  onBack,
  onDelete,
  onToggleVisibility
}) {
  const [formData, setFormData] = useState(entry || {});
  const [errors, setErrors] = useState({});
  const [isVisible, setIsVisible] = useState(entry?.isVisible !== false);

  const config = getSectionConfig(sectionId);
  const fields = config?.fields || [];
  const isCustomSection = !config;
  const sectionTitle = SECTION_CONFIG[sectionId]?.title || config?.title || sectionId;
  const emoji = SECTION_CONFIG[sectionId]?.emoji || config?.emoji || '📋';

  useEffect(() => {
    if (entry) {
      setFormData(entry);
      setIsVisible(entry.isVisible !== false);
    }
  }, [entry]);

  const handleChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: null }));
    }
  };

  const handleDateChange = (fieldName, value) => {
    handleChange(fieldName, value);
    if (value) {
      const date = new Date(value);
      const textFieldName = `${fieldName}Text`;
      const formatted = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      setFormData(prev => ({ ...prev, [textFieldName]: formatted }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    fields.forEach(field => {
      if (field.required) {
        const value = formData[field.name];
        if (!value || (typeof value === 'string' && !value.trim())) {
          newErrors[field.name] = `${field.label} is required`;
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (fields.length === 0 || validateForm()) {
      if (isSingleSection) {
        onSave(formData);
      } else {
        onSave({ ...formData, isVisible });
      }
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      onDelete();
    }
  };

  const handleVisibilityToggle = () => {
    setIsVisible(prev => !prev);
    if (onToggleVisibility) {
      onToggleVisibility(!isVisible);
    }
  };

  const renderField = (field) => {
    const error = errors[field.name];
    const Icon = SECTION_ICONS[sectionId];

    switch (field.type) {
      case 'text':
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className={`flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  error ? 'border-red-500' : 'border-slate-200'
                }`}
              />
              {field.hasLink && (
                <button
                  type="button"
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                  title="Add link"
                >
                  <Link2 className="w-4 h-4" />
                </button>
              )}
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
        );

      case 'email':
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="email"
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? 'border-red-500' : 'border-slate-200'
              }`}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
        );

      case 'tel':
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="tel"
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? 'border-red-500' : 'border-slate-200'
              }`}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
        );

      case 'date':
        const dateFieldName = field.name;
        const textFieldName = `${dateFieldName}Text`;
        
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {field.label}
            </label>
            <input
              type="text"
              value={formData[textFieldName] || ''}
              onChange={(e) => handleChange(textFieldName, e.target.value)}
              placeholder={field.endDate ? 'Present' : 'MMM YYYY'}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );

      case 'richtext':
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <RichTextEditor
              value={formData[field.name] || ''}
              onChange={(value) => handleChange(field.name, value)}
              placeholder={field.placeholder}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
        );

      case 'rating':
        const levels = [
          { value: 1, label: 'Beginner' },
          { value: 2, label: 'Amateur' },
          { value: 3, label: 'Competent' },
          { value: 4, label: 'Proficient' },
          { value: 5, label: 'Expert' }
        ];
        
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {field.label}
            </label>
            <div className="flex items-center gap-3">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleChange(field.name, level)}
                  className={`p-1 transition-transform ${
                    (formData[field.name] || 0) >= level
                      ? 'text-yellow-500 scale-110'
                      : 'text-slate-300 hover:text-yellow-400'
                  }`}
                >
                  <Star className="w-6 h-6" fill={(formData[field.name] || 0) >= level ? 'currentColor' : 'none'} />
                </button>
              ))}
              <span className="ml-2 text-sm text-slate-500">
                {levels.find(l => l.value === formData[field.name])?.label || 'Not set'}
              </span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isDateRangeField = (field) => field.type === 'date';

  const groupedFields = fields.reduce((acc, field) => {
    if (isDateRangeField(field)) {
      if (field.endDate) {
        acc.dates.push(field);
      } else {
        acc.dates.unshift(field);
      }
    } else {
      acc.others.push(field);
    }
    return acc;
  }, { dates: [], others: [] });

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'tween', duration: 0.3 }}
      className="h-full flex flex-col bg-slate-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>
        
        <div className="flex items-center gap-2">
          {!isSingleSection && !isNew && (
            <>
              <button
                onClick={handleVisibilityToggle}
                className={`p-2 rounded-lg transition-colors ${
                  isVisible
                    ? 'text-green-600 hover:bg-green-50'
                    : 'text-slate-400 hover:bg-slate-100'
                }`}
                title={isVisible ? 'Hide entry' : 'Show entry'}
              >
                {isVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                title="Delete entry"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </>
          )}
          {isSingleSection && (
            <button
              onClick={handleVisibilityToggle}
              className={`p-2 rounded-lg transition-colors ${
                isVisible
                  ? 'text-green-600 hover:bg-green-50'
                  : 'text-slate-400 hover:bg-slate-100'
              }`}
              title={isVisible ? 'Hide section' : 'Show section'}
            >
              {isVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">Done</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center gap-2 mb-4">
          {emoji ? (
            <span className="text-xl">{emoji}</span>
          ) : config?.icon ? (
            <config.icon className="w-5 h-5 text-slate-500" />
          ) : null}
          <h2 className="text-lg font-semibold text-slate-800">
            {isNew ? `Add ${sectionTitle}` : isSingleSection ? sectionTitle : formatEntryTitle(sectionId, formData) || 'Edit Entry'}
          </h2>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          {/* For custom sections, show default fields */}
          {isCustomSection && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g., Employee of the Month"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle || ''}
                  onChange={(e) => handleChange('subtitle', e.target.value)}
                  placeholder="e.g., Company Name, Year"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Date Range</label>
                <DateRangePicker
                  startDate={formData.startDate || ''}
                  endDate={formData.endDate || ''}
                  onStartDateChange={(value) => handleChange('startDate', value)}
                  onEndDateChange={(value) => handleChange('endDate', value)}
                  startPlaceholder="Start Date"
                  endPlaceholder="End / Present"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <RichTextEditor
                  value={formData.description || ''}
                  onChange={(value) => handleChange('description', value)}
                  placeholder="Describe this entry..."
                />
              </div>
            </>
          )}
          
          {/* For single sections (like Profile), show simple form */}
          {!isCustomSection && fields.length === 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <RichTextEditor
                value={formData.text || formData.description || ''}
                onChange={(value) => handleChange('text', value)}
                placeholder="Write your professional summary..."
              />
            </div>
          )}
          
          {/* Regular fields */}
          {groupedFields.others.map(field => renderField(field))}

          {/* Date range fields */}
          {groupedFields.dates.length > 0 && (
            <DateRangePicker
              startDate={formData[groupedFields.dates[0]?.name] || ''}
              endDate={formData[groupedFields.dates[1]?.name] || ''}
              onStartDateChange={(value) => handleDateChange(groupedFields.dates[0]?.name, value)}
              onEndDateChange={(value) => handleDateChange(groupedFields.dates[1]?.name, value)}
              startPlaceholder={groupedFields.dates[0]?.label}
              endPlaceholder={groupedFields.dates[1]?.label || 'Present'}
            />
          )}
          
          <p className="text-xs text-slate-400 mt-4">
            <span className="text-red-500">*</span> Required fields
          </p>
        </div>
      </div>
    </motion.div>
  );
}
