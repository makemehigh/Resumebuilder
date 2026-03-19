'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Upload, GripVertical, X } from 'lucide-react';
import { getSectionConfig } from './sectionManager';

export default function Screen2PersonalEdit({
  personalDetails,
  onSave,
  onBack
}) {
  const [formData, setFormData] = useState(personalDetails || {});
  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(personalDetails?.photo || '');

  const config = getSectionConfig('personal');
  const fields = config?.fields || [];

  const handleChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: null }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoPreview('');
    setFormData(prev => ({ ...prev, photo: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
      if (field.type === 'email' && formData[field.name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.name])) {
          newErrors[field.name] = 'Please enter a valid email';
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleReorder = (fieldName, direction) => {
    const currentIndex = fields.findIndex(f => f.name === fieldName);
    const currentField = fields[currentIndex];
    
    if (!currentField.reorderable) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= fields.length) return;
    
    const newFields = [...fields];
    [newFields[currentIndex], newFields[newIndex]] = [newFields[newIndex], newFields[currentIndex]];
  };

  const renderField = (field) => {
    const error = errors[field.name];
    
    switch (field.type) {
      case 'image':
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex items-center gap-4">
              <div className="relative">
                {photoPreview ? (
                  <div className="relative">
                    <img 
                      src={photoPreview} 
                      alt="Profile" 
                      className="w-20 h-20 rounded-full object-cover border-2 border-slate-200"
                    />
                    <button
                      onClick={removePhoto}
                      className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-slate-400" />
                  </div>
                )}
              </div>
              <label className="cursor-pointer">
                <span className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors inline-block">
                  Upload Photo
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        );
      
      case 'email':
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex items-center gap-2">
              <input
                type={field.type}
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className={`flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  error ? 'border-red-500' : 'border-slate-200'
                }`}
              />
              {field.reorderable && (
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => handleReorder(field.name, 'up')}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReorder(field.name, 'down')}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
        );
      
      default:
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex items-center gap-2">
              <input
                type={field.type === 'text' ? 'text' : field.type}
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className={`flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  error ? 'border-red-500' : 'border-slate-200'
                }`}
              />
              {field.reorderable && (
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => handleReorder(field.name, 'up')}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReorder(field.name, 'down')}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
        );
    }
  };

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
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Check className="w-4 h-4" />
          <span className="text-sm font-medium">Done</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Edit Personal Details</h2>
        
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          {fields.map(field => renderField(field))}
          
          <p className="text-xs text-slate-400 mt-4">
            <span className="text-red-500">*</span> Required fields
          </p>
        </div>
      </div>
    </motion.div>
  );
}
