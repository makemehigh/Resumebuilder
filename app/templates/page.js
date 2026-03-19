'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useResumeStore } from '../../src/stores/useResumeStore';
import { TEMPLATES, TEMPLATE_CATEGORIES } from '../../src/data/templates';

export default function Templates() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { createNewResume } = useResumeStore();
  const router = useRouter();

  const filteredTemplates = selectedCategory === 'all'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === selectedCategory);

  const handleSelectTemplate = (templateId) => {
    const resume = createNewResume(templateId);
    router.push(`/editor/${resume.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-slate-800">Resume Builder</span>
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-slate-600 hover:text-slate-800 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-800 mb-3">Choose a Template</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Select from our professionally designed templates to create your perfect resume
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {TEMPLATE_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-slate-800 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleSelectTemplate(template.id)}
              className="group bg-white rounded-2xl border-2 border-slate-200 overflow-hidden hover:border-blue-500 hover:shadow-xl transition-all duration-300 text-left"
            >
              <div className="aspect-[3/4] bg-white relative p-4">
                <div
                  className="w-full h-full rounded-lg shadow-md overflow-hidden"
                  style={{
                    background: template.styles.primaryColor === '#000000' ? '#fff' : 
                      `linear-gradient(135deg, ${template.styles.primaryColor}10, ${template.styles.accentColor}10)`
                  }}
                >
                  <div className="p-3">
                    <div
                      className="h-6 w-2/3 rounded mb-2"
                      style={{ backgroundColor: template.styles.primaryColor }}
                    ></div>
                    <div className="h-2 w-1/2 bg-slate-200 rounded mb-4"></div>
                    <div className="space-y-1.5">
                      <div className="h-2 w-full bg-slate-100 rounded"></div>
                      <div className="h-2 w-5/6 bg-slate-100 rounded"></div>
                      <div className="h-2 w-4/6 bg-slate-100 rounded"></div>
                      {template.layout.columns === 2 && (
                        <>
                          <div className="h-2 w-full bg-slate-100 rounded mt-3"></div>
                          <div className="h-2 w-3/4 bg-slate-100 rounded"></div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {template.default && (
                  <span className="absolute top-4 left-4 px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                    Recommended
                  </span>
                )}
              </div>
              <div className="p-4 border-t border-slate-100">
                <h3 className="font-semibold text-slate-800">{template.name}</h3>
                <p className="text-sm text-slate-500 mt-1 capitalize">{template.category}</p>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
