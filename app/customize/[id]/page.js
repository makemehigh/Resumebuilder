'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useResumeStore } from '../../../src/stores/useResumeStore';
import { useAuthStore } from '../../../src/stores/useAuthStore';
import { TEMPLATES, COLOR_PRESETS, AVAILABLE_FONTS } from '../../../src/data/templates';
import { CUSTOMIZATION_OPTIONS } from '../../../src/data/customization';

export default function Customize() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { currentResume, setCurrentResume, resumes, updateCustomization, applyTemplate } = useResumeStore();
  const [activeTab, setActiveTab] = useState('colors');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const resume = resumes.find(r => r.id === params.id);
    if (resume) {
      setCurrentResume(resume);
    } else {
      router.push('/dashboard');
    }
  }, [params.id, resumes, user, router, setCurrentResume]);

  if (!currentResume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const handleCustomizationChange = (path, value) => {
    updateCustomization(path, value);
  };

  const handleTemplateChange = (templateId) => {
    applyTemplate(templateId);
  };

  const tabs = [
    { id: 'colors', label: 'Colors', icon: '🎨' },
    { id: 'fonts', label: 'Fonts', icon: '🔤' },
    { id: 'layout', label: 'Layout', icon: '📐' },
    { id: 'templates', label: 'Templates', icon: '📄' },
  ];

  const renderColors = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">Primary Color</label>
        <div className="flex flex-wrap gap-3">
          {COLOR_PRESETS.map((color) => (
            <button
              key={color}
              onClick={() => handleCustomizationChange('colors.primaryColor', color)}
              className={`w-10 h-10 rounded-lg transition-all ${
                currentResume.customization.colors.primaryColor === color
                  ? 'ring-2 ring-offset-2 ring-blue-500 scale-110'
                  : 'hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <input
          type="color"
          value={currentResume.customization.colors.primaryColor}
          onChange={(e) => handleCustomizationChange('colors.primaryColor', e.target.value)}
          className="mt-3 w-full h-10 rounded-lg cursor-pointer"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">Accent Color</label>
        <input
          type="color"
          value={currentResume.customization.colors.accentColor}
          onChange={(e) => handleCustomizationChange('colors.accentColor', e.target.value)}
          className="w-full h-10 rounded-lg cursor-pointer"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">Apply Colors To</label>
        <div className="space-y-2">
          {Object.entries(currentResume.customization.colors.applyTo).map(([key, value]) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleCustomizationChange(`colors.applyTo.${key}`, e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFonts = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">Heading Font</label>
        <select
          value={currentResume.customization.fonts.headingFont}
          onChange={(e) => handleCustomizationChange('fonts.headingFont', e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {AVAILABLE_FONTS.heading.map((font) => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">Body Font</label>
        <select
          value={currentResume.customization.fonts.bodyFont}
          onChange={(e) => handleCustomizationChange('fonts.bodyFont', e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {AVAILABLE_FONTS.body.map((font) => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">Font Sizes</label>
        <div className="space-y-3">
          {Object.entries(currentResume.customization.fonts.fontSizes).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="8"
                  max="32"
                  value={value}
                  onChange={(e) => handleCustomizationChange(`fonts.fontSizes.${key}`, parseInt(e.target.value))}
                  className="w-24"
                />
                <span className="text-sm text-slate-800 w-8">{value}px</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLayout = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">Columns</label>
        <div className="flex gap-2">
          {CUSTOMIZATION_OPTIONS.columns.map((col) => (
            <button
              key={col}
              onClick={() => handleCustomizationChange('layout.columns', col)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                currentResume.customization.layout.columns === col
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {col} Column{col > 1 ? 's' : ''}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">Header Position</label>
        <div className="flex gap-2">
          {CUSTOMIZATION_OPTIONS.headerPosition.map((pos) => (
            <button
              key={pos}
              onClick={() => handleCustomizationChange('layout.headerPosition', pos)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium capitalize transition-colors ${
                currentResume.customization.layout.headerPosition === pos
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">Column Width (%)</label>
        <input
          type="range"
          min="20"
          max="50"
          value={currentResume.customization.layout.columnWidth}
          onChange={(e) => handleCustomizationChange('layout.columnWidth', parseInt(e.target.value))}
          className="w-full"
        />
        <div className="text-sm text-slate-600 mt-1">{currentResume.customization.layout.columnWidth}%</div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">Spacing</label>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Page Margin</span>
            <input
              type="range"
              min="5"
              max="30"
              value={currentResume.customization.spacing.pageMargin}
              onChange={(e) => handleCustomizationChange('spacing.pageMargin', parseInt(e.target.value))}
              className="w-24"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Line Height</span>
            <input
              type="range"
              min="1"
              max="2"
              step="0.1"
              value={currentResume.customization.spacing.lineHeight}
              onChange={(e) => handleCustomizationChange('spacing.lineHeight', parseFloat(e.target.value))}
              className="w-24"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Section Spacing</span>
            <input
              type="range"
              min="8"
              max="32"
              value={currentResume.customization.spacing.sectionSpacing}
              onChange={(e) => handleCustomizationChange('spacing.sectionSpacing', parseInt(e.target.value))}
              className="w-24"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-4">
      <p className="text-sm text-slate-600 mb-4">Switch to a different template. This will reset some customization options.</p>
      <div className="grid grid-cols-2 gap-4">
        {TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => handleTemplateChange(template.id)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              currentResume.templateId === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div
              className="h-16 rounded-lg mb-2"
              style={{
                background: `linear-gradient(135deg, ${template.styles.primaryColor}20, ${template.styles.accentColor}20)`
              }}
            />
            <p className="font-medium text-slate-800">{template.name}</p>
            <p className="text-xs text-slate-500 capitalize">{template.category}</p>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-full mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link
                href={`/editor/${currentResume.id}`}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <span className="text-lg font-semibold text-slate-800">
                Customize: {currentResume.name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/editor/${currentResume.id}`}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium"
              >
                Back to Editor
              </Link>
              <button className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all">
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-200">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 px-4 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-600 hover:text-slate-800 hover:border-slate-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="p-6">
            {activeTab === 'colors' && renderColors()}
            {activeTab === 'fonts' && renderFonts()}
            {activeTab === 'layout' && renderLayout()}
            {activeTab === 'templates' && renderTemplates()}
          </div>
        </div>

        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Preview</h3>
          <div 
            className="aspect-[3/4] max-w-sm mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
            style={{
              fontFamily: currentResume.customization.fonts.bodyFont,
            }}
          >
            <div 
              className="p-4"
              style={{
                background: `linear-gradient(135deg, ${currentResume.customization.colors.primaryColor}10, ${currentResume.customization.colors.accentColor}10)`
              }}
            >
              <h1 
                className="font-bold"
                style={{
                  fontSize: `${currentResume.customization.fonts.fontSizes.name}px`,
                  color: currentResume.customization.colors.applyTo.name ? currentResume.customization.colors.primaryColor : 'inherit'
                }}
              >
                {currentResume.content.personalDetails.fullName || 'Your Name'}
              </h1>
              <p 
                className="text-sm"
                style={{
                  fontSize: `${currentResume.customization.fonts.fontSizes.jobTitle}px`,
                  color: currentResume.customization.colors.applyTo.jobTitle ? currentResume.customization.colors.accentColor : 'inherit'
                }}
              >
                {currentResume.content.personalDetails.jobTitle || 'Job Title'}
              </p>
            </div>
            <div className="p-4 space-y-3">
              <div className="h-2 bg-slate-100 rounded w-3/4"></div>
              <div className="h-2 bg-slate-100 rounded w-1/2"></div>
              <div className="h-2 bg-slate-100 rounded w-full"></div>
              <div className="h-2 bg-slate-100 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
