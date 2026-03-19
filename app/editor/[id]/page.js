'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useResumeStore } from '../../../src/stores/useResumeStore';
import { useAuthStore } from '../../../src/stores/useAuthStore';
import { SECTION_TYPES } from '../../../src/data/templates';

export default function Editor() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    currentResume, 
    setCurrentResume, 
    resumes,
    updatePersonalDetails,
    updateSectionContent,
    addSection,
    toggleSectionVisibility,
    deleteResume,
  } = useResumeStore();

  const [activeSection, setActiveSection] = useState('personal');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

  const handlePersonalDetailChange = (field, value) => {
    updatePersonalDetails(field, value);
  };

  const handleSectionChange = (sectionId, content) => {
    updateSectionContent(sectionId, content);
  };

  const handleAddSection = (type) => {
    addSection(type, type.charAt(0).toUpperCase() + type.slice(1));
  };

  const renderPersonalDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <input
            type="text"
            value={currentResume.content.personalDetails.fullName}
            onChange={(e) => handlePersonalDetailChange('fullName', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
          <input
            type="text"
            value={currentResume.content.personalDetails.jobTitle}
            onChange={(e) => handlePersonalDetailChange('jobTitle', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Software Engineer"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            type="email"
            value={currentResume.content.personalDetails.email}
            onChange={(e) => handlePersonalDetailChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
          <input
            type="tel"
            value={currentResume.content.personalDetails.phone}
            onChange={(e) => handlePersonalDetailChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
        <input
          type="text"
          value={currentResume.content.personalDetails.location}
          onChange={(e) => handlePersonalDetailChange('location', e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="New York, NY"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Professional Summary</label>
        <textarea
          value={currentResume.content.personalDetails.summary || ''}
          onChange={(e) => handlePersonalDetailChange('summary', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write a brief professional summary..."
        />
      </div>
    </div>
  );

  const renderSection = (section) => {
    switch (section.type) {
      case SECTION_TYPES.PROFILE:
        return (
          <div key={section.id}>
            <label className="block text-sm font-medium text-slate-700 mb-1">{section.title}</label>
            <textarea
              value={section.content?.text || ''}
              onChange={(e) => handleSectionChange(section.id, { text: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write about yourself..."
            />
          </div>
        );
      case SECTION_TYPES.EMPLOYMENT:
        return (
          <div key={section.id} className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">{section.title}</label>
            {(section.content?.items || []).map((item, index) => (
              <div key={item.id} className="p-4 bg-slate-50 rounded-lg space-y-3">
                <input
                  type="text"
                  value={item.jobTitle}
                  onChange={(e) => {
                    const newItems = [...section.content.items];
                    newItems[index] = { ...item, jobTitle: e.target.value };
                    handleSectionChange(section.id, { items: newItems });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Job Title"
                />
                <input
                  type="text"
                  value={item.employer}
                  onChange={(e) => {
                    const newItems = [...section.content.items];
                    newItems[index] = { ...item, employer: e.target.value };
                    handleSectionChange(section.id, { items: newItems });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Company"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={item.startDate}
                    onChange={(e) => {
                      const newItems = [...section.content.items];
                      newItems[index] = { ...item, startDate: e.target.value };
                      handleSectionChange(section.id, { items: newItems });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Start Date"
                  />
                  <input
                    type="text"
                    value={item.endDate}
                    onChange={(e) => {
                      const newItems = [...section.content.items];
                      newItems[index] = { ...item, endDate: e.target.value };
                      handleSectionChange(section.id, { items: newItems });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="End Date"
                  />
                </div>
                <textarea
                  value={item.description}
                  onChange={(e) => {
                    const newItems = [...section.content.items];
                    newItems[index] = { ...item, description: e.target.value };
                    handleSectionChange(section.id, { items: newItems });
                  }}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Description"
                />
              </div>
            ))}
            <button
              onClick={() => {
                const newItems = [...(section.content?.items || []), {
                  id: `emp-${Date.now()}`,
                  jobTitle: '',
                  employer: '',
                  location: '',
                  startDate: '',
                  endDate: '',
                  isCurrentRole: false,
                  description: '',
                }];
                handleSectionChange(section.id, { items: newItems });
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              + Add Employment
            </button>
          </div>
        );
      case SECTION_TYPES.EDUCATION:
        return (
          <div key={section.id} className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">{section.title}</label>
            {(section.content?.items || []).map((item, index) => (
              <div key={item.id} className="p-4 bg-slate-50 rounded-lg space-y-3">
                <input
                  type="text"
                  value={item.degree}
                  onChange={(e) => {
                    const newItems = [...section.content.items];
                    newItems[index] = { ...item, degree: e.target.value };
                    handleSectionChange(section.id, { items: newItems });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Degree"
                />
                <input
                  type="text"
                  value={item.school}
                  onChange={(e) => {
                    const newItems = [...section.content.items];
                    newItems[index] = { ...item, school: e.target.value };
                    handleSectionChange(section.id, { items: newItems });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="School"
                />
              </div>
            ))}
            <button
              onClick={() => {
                const newItems = [...(section.content?.items || []), {
                  id: `edu-${Date.now()}`,
                  degree: '',
                  school: '',
                  location: '',
                  startDate: '',
                  endDate: '',
                }];
                handleSectionChange(section.id, { items: newItems });
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              + Add Education
            </button>
          </div>
        );
      case SECTION_TYPES.SKILLS:
        return (
          <div key={section.id}>
            <label className="block text-sm font-medium text-slate-700 mb-1">{section.title}</label>
            <textarea
              value={section.content?.skills?.join('\n') || ''}
              onChange={(e) => handleSectionChange(section.id, { skills: e.target.value.split('\n').filter(s => s.trim()) })}
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="JavaScript&#10;React&#10;Node.js"
            />
            <p className="text-xs text-slate-500 mt-1">Enter each skill on a new line</p>
          </div>
        );
      default:
        return (
          <div key={section.id}>
            <label className="block text-sm font-medium text-slate-700 mb-1">{section.title}</label>
            <textarea
              value={JSON.stringify(section.content || {})}
              onChange={(e) => {
                try {
                  handleSectionChange(section.id, JSON.parse(e.target.value));
                } catch {}
              }}
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-full mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <input
                type="text"
                value={currentResume.name}
                onChange={(e) => useResumeStore.getState().updateResumeName(e.target.value)}
                className="text-lg font-semibold text-slate-800 bg-transparent border-none focus:outline-none focus:ring-0"
              />
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/customize/${currentResume.id}`}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium"
              >
                Customize
              </Link>
              <button className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all">
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-white border-r border-slate-200 overflow-hidden transition-all duration-300`}>
          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveSection('personal')}
              className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors ${
                activeSection === 'personal'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Personal Details
            </button>
            {currentResume.content.sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-between ${
                  activeSection === section.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {section.title}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSectionVisibility(section.id);
                  }}
                  className={`p-1 rounded ${section.isVisible ? 'text-green-600' : 'text-slate-400'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {section.isVisible ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    )}
                  </svg>
                </button>
              </button>
            ))}
            <div className="pt-4 mt-4 border-t border-slate-200">
              <p className="px-4 text-xs font-medium text-slate-500 uppercase mb-2">Add Section</p>
              {Object.values(SECTION_TYPES).filter(t => t !== SECTION_TYPES.CUSTOM).map((type) => (
                <button
                  key={type}
                  onClick={() => handleAddSection(type)}
                  className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  + {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </nav>
        </aside>

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed left-0 top-1/2 -translate-y-1/2 p-2 bg-white border border-slate-200 rounded-r-lg shadow-md hover:bg-slate-50 transition-colors z-10"
        >
          <svg className={`w-4 h-4 text-slate-600 transition-transform ${isSidebarOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <main className="flex-1 p-8">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            {activeSection === 'personal' ? renderPersonalDetails() : 
              renderSection(currentResume.content.sections.find(s => s.id === activeSection))}
          </div>
        </main>
      </div>
    </div>
  );
}
