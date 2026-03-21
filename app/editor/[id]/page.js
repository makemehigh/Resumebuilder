'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useResumeStore } from '../../../src/stores/useResumeStore';
import { useAuthStore } from '../../../src/stores/useAuthStore';
import { SECTION_TYPES, TEMPLATES, COLOR_PRESETS, AVAILABLE_FONTS, SECTION_CONFIG } from '../../../src/data/templates';
import { SECTION_ICONS } from '../../../src/components/editor/sectionManager';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, User } from 'lucide-react';
import { generatePDF } from '../../../src/lib/pdfGenerator';
import ResumeEditorContent from '../../../src/components/editor/ResumeEditorContent';

export default function ResumeEditor() {
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
    removeSection,
    toggleSectionVisibility,
    updateCustomization,
    applyTemplate,
    updateResumeName,
  } = useResumeStore();

  const [activeTab, setActiveTab] = useState('editor');
  const [activeSection, setActiveSection] = useState('personal');
  const [expandedSections, setExpandedSections] = useState({});
  const [isDownloading, setIsDownloading] = useState(false);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [customizeTab, setCustomizeTab] = useState('colors');
  const [showCustomSectionModal, setShowCustomSectionModal] = useState(false);
  const [customSectionTitle, setCustomSectionTitle] = useState('');
  const [editingEntry, setEditingEntry] = useState(null);
  const [editingSectionId, setEditingSectionId] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const resume = resumes.find(r => r.id === params.id);
    if (resume) {
      if (!currentResume || currentResume.id !== resume.id) {
        setCurrentResume(resume);
      }
      if (Object.keys(expandedSections).length === 0) {
        const expanded = {};
        resume.content.sections.forEach(s => { expanded[s.id] = false; });
        setExpandedSections(expanded);
      }
    } else {
      router.push('/dashboard');
    }
  }, [params.id, resumes, user, router, setCurrentResume]);

  const toggleExpand = (sectionId) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const handlePersonalDetailChange = (field, value) => {
    updatePersonalDetails(field, value);
  };

  const handleSectionChange = (sectionId, content) => {
    updateSectionContent(sectionId, content);
  };

  const handleAddSection = (type) => {
    const newSection = addSection(type, type.charAt(0).toUpperCase() + type.slice(1));
    setActiveSection(newSection.id);
    setExpandedSections(prev => ({ ...prev, [newSection.id]: true }));
  };

  const handleAddCustomSection = () => {
    if (!customSectionTitle.trim()) return;
    const newSection = addSection('custom', customSectionTitle.trim());
    setActiveSection(newSection.id);
    setExpandedSections(prev => ({ ...prev, [newSection.id]: true }));
    setCustomSectionTitle('');
    setShowCustomSectionModal(false);
  };

  const handleCustomizationChange = (path, value) => {
    updateCustomization(path, value);
  };

  const handleTemplateChange = (templateId) => {
    applyTemplate(templateId);
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      await generatePDF('resume-preview', `${currentResume?.name || 'resume'}.pdf`);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!currentResume) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const toggleSectionItem = (sectionId, itemId, field) => {
    const section = currentResume.content.sections.find(s => s.id === sectionId);
    const items = section?.content?.items || [];
    const newItems = items.map(item => 
      item.id === itemId ? { ...item, [field]: !item[field] } : item
    );
    handleSectionChange(sectionId, { ...section.content, items: newItems });
  };

  const handleEditEntry = (sectionId, entryId) => {
    setActiveSection(sectionId);
    const section = currentResume.content.sections.find(s => s.id === sectionId);
    const entry = section?.content?.items?.find(i => i.id === entryId);
    if (entry) {
      setEditingEntry(entry);
      setEditingSectionId(sectionId);
    }
  };

  const handleDeleteEntry = (sectionId, entryId) => {
    const section = currentResume.content.sections.find(s => s.id === sectionId);
    if (!section) return;
    
    const currentItems = section?.content?.items || [];
    const newItems = currentItems.filter(item => item.id !== entryId);
    handleSectionChange(sectionId, { ...section.content, items: newItems });
  };

  const updateSectionItem = (sectionId, itemId, field, value) => {
    const section = currentResume.content.sections.find(s => s.id === sectionId);
    const items = section?.content?.items || [];
    const newItems = items.map(item => 
      item.id === itemId ? { ...item, [field]: value } : item
    );
    handleSectionChange(sectionId, { ...section.content, items: newItems });
  };

  const removeSectionItem = (sectionId, itemId) => {
    const section = currentResume.content.sections.find(s => s.id === sectionId);
    const items = section?.content?.items || [];
    handleSectionChange(sectionId, { ...section.content, items: items.filter(i => i.id !== itemId) });
  };

  const addSectionItem = (sectionId, defaultItem) => {
    const section = currentResume.content.sections.find(s => s.id === sectionId);
    const items = [...(section?.content?.items || []), { ...defaultItem, id: `${sectionId}-${Date.now()}` }];
    handleSectionChange(sectionId, { ...section.content, items });
  };

  const renderInput = (sectionId, item, field, label, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      {type === 'textarea' ? (
        <textarea
          value={item[field] || ''}
          onChange={(e) => updateSectionItem(sectionId, item.id, field, e.target.value)}
          rows={2}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={placeholder}
        />
      ) : type === 'checkbox' ? (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={item[field] || false}
            onChange={() => toggleSectionItem(sectionId, item.id, field)}
            className="w-4 h-4 rounded border-slate-300 text-blue-600"
          />
          <span className="text-sm text-slate-600">{label}</span>
        </label>
      ) : (
        <input
          type={type}
          value={item[field] || ''}
          onChange={(e) => updateSectionItem(sectionId, item.id, field, e.target.value)}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={placeholder}
        />
      )}
    </div>
  );

  const renderPersonalDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Full Name</label>
          <input
            type="text"
            value={currentResume.content.personalDetails.fullName}
            onChange={(e) => handlePersonalDetailChange('fullName', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Job Title</label>
          <input
            type="text"
            value={currentResume.content.personalDetails.jobTitle}
            onChange={(e) => handlePersonalDetailChange('jobTitle', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Software Engineer"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
          <input
            type="email"
            value={currentResume.content.personalDetails.email}
            onChange={(e) => handlePersonalDetailChange('email', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Phone</label>
          <input
            type="tel"
            value={currentResume.content.personalDetails.phone}
            onChange={(e) => handlePersonalDetailChange('phone', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+1 555 123-4567"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Location</label>
        <input
          type="text"
          value={currentResume.content.personalDetails.location}
          onChange={(e) => handlePersonalDetailChange('location', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="New York, NY"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Professional Summary</label>
        <textarea
          value={currentResume.content.personalDetails.summary || ''}
          onChange={(e) => handlePersonalDetailChange('summary', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Brief professional summary..."
        />
      </div>
    </div>
  );

  const renderEmploymentSection = (section) => (
    <div className="space-y-3">
      {(section.content?.items || []).map((item) => (
        <div key={item.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium text-slate-700">{item.jobTitle || 'New Position'}</span>
            <button
              onClick={() => removeSectionItem(section.id, item.id)}
              className="text-red-500 hover:text-red-700 text-xs"
            >
              Remove
            </button>
          </div>
          <div className="space-y-2">
            {renderInput(section.id, item, 'jobTitle', 'Job Title', 'text', 'Software Developer')}
            {renderInput(section.id, item, 'employer', 'Company', 'text', 'Tech Corp')}
            {renderInput(section.id, item, 'location', 'Location', 'text', 'San Francisco, CA')}
            <div className="grid grid-cols-2 gap-2">
              {renderInput(section.id, item, 'startDate', 'Start Date', 'text', 'Jan 2020')}
              {renderInput(section.id, item, 'endDate', 'End Date', 'text', 'Present')}
            </div>
            {renderInput(section.id, item, 'isCurrentRole', 'Currently working here')}
            {renderInput(section.id, item, 'description', 'Description', 'textarea', 'Describe your role...')}
          </div>
        </div>
      ))}
      <button
        onClick={() => addSectionItem(section.id, {
          jobTitle: '', employer: '', location: '', startDate: '', endDate: '',
          isCurrentRole: false, description: ''
        })}
        className="w-full py-2 text-sm text-blue-600 border border-dashed border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
      >
        + Add Position
      </button>
    </div>
  );

  const renderEducationSection = (section) => (
    <div className="space-y-3">
      {(section.content?.items || []).map((item) => (
        <div key={item.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium text-slate-700">{item.degree || 'New Education'}</span>
            <button
              onClick={() => removeSectionItem(section.id, item.id)}
              className="text-red-500 hover:text-red-700 text-xs"
            >
              Remove
            </button>
          </div>
          <div className="space-y-2">
            {renderInput(section.id, item, 'degree', 'Degree', 'text', 'Bachelor of Science')}
            {renderInput(section.id, item, 'school', 'School/University', 'text', 'MIT')}
            {renderInput(section.id, item, 'location', 'Location', 'text', 'Cambridge, MA')}
            <div className="grid grid-cols-2 gap-2">
              {renderInput(section.id, item, 'startDate', 'Start Date', 'text', '2016')}
              {renderInput(section.id, item, 'endDate', 'End Date', 'text', '2020')}
            </div>
            {renderInput(section.id, item, 'isCurrentlyStudying', 'Currently studying here')}
            {renderInput(section.id, item, 'description', 'Description', 'textarea', 'GPA, honors, coursework...')}
          </div>
        </div>
      ))}
      <button
        onClick={() => addSectionItem(section.id, {
          degree: '', school: '', location: '', startDate: '', endDate: '',
          isCurrentlyStudying: false, description: ''
        })}
        className="w-full py-2 text-sm text-blue-600 border border-dashed border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
      >
        + Add Education
      </button>
    </div>
  );

  const renderSkillsSection = (section) => {
    const categories = section.content?.categories || [];
    const updateCategory = (catId, field, value) => {
      const newCategories = categories.map(c => c.id === catId ? { ...c, [field]: value } : c);
      handleSectionChange(section.id, { ...section.content, categories: newCategories });
    };
    const removeCategory = (catId) => {
      handleSectionChange(section.id, { ...section.content, categories: categories.filter(c => c.id !== catId) });
    };
    const addCategory = () => {
      const newCat = { id: `cat-${Date.now()}`, name: '', skills: [] };
      handleSectionChange(section.id, { ...section.content, categories: [...categories, newCat] });
    };
    const updateSkill = (catId, index, value) => {
      const cat = categories.find(c => c.id === catId);
      const skills = [...(cat?.skills || [])];
      skills[index] = value;
      updateCategory(catId, 'skills', skills);
    };
    const removeSkill = (catId, index) => {
      const cat = categories.find(c => c.id === catId);
      const skills = (cat?.skills || []).filter((_, i) => i !== index);
      updateCategory(catId, 'skills', skills);
    };
    const addSkill = (catId) => {
      const cat = categories.find(c => c.id === catId);
      const skills = [...(cat?.skills || []), ''];
      updateCategory(catId, 'skills', skills);
    };

    return (
      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={cat.name}
                onChange={(e) => updateCategory(cat.id, 'name', e.target.value)}
                className="flex-1 px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Category name (e.g., Technical)"
              />
              <button
                onClick={() => removeCategory(cat.id)}
                className="text-red-500 hover:text-red-700 px-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-1">
              {(cat.skills || []).map((skill, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => updateSkill(cat.id, i, e.target.value)}
                    className="flex-1 px-3 py-1 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Skill name"
                  />
                  <button
                    onClick={() => removeSkill(cat.id, i)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                onClick={() => addSkill(cat.id)}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                + Add Skill
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={addCategory}
          className="w-full py-2 text-sm text-blue-600 border border-dashed border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
        >
          + Add Category
        </button>
      </div>
    );
  };

  const renderStrengthsSection = (section) => (
    <div className="space-y-3">
      <p className="text-xs text-slate-500 mb-2">Add your key strengths with proficiency levels (1-5)</p>
      {(section.content?.items || []).map((item) => (
        <div key={item.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={item.name}
              onChange={(e) => updateSectionItem(section.id, item.id, 'name', e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Strength name"
            />
            <select
              value={item.level || 3}
              onChange={(e) => updateSectionItem(section.id, item.id, 'level', parseInt(e.target.value))}
              className="px-2 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[1, 2, 3, 4, 5].map(l => (
                <option key={l} value={l}>{l}/5</option>
              ))}
            </select>
            <button
              onClick={() => removeSectionItem(section.id, item.id)}
              className="text-red-500 hover:text-red-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={() => addSectionItem(section.id, { name: '', level: 3 })}
        className="w-full py-2 text-sm text-blue-600 border border-dashed border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
      >
        + Add Strength
      </button>
    </div>
  );

  const renderInterestsSection = (section) => (
    <div className="space-y-3">
      <p className="text-xs text-slate-500 mb-2">Add your interests and hobbies</p>
      <div className="flex flex-wrap gap-2">
        {(section.content?.items || []).map((item, index) => (
          <div key={item.id || index} className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 rounded-full">
            <input
              type="text"
              value={item.name || item}
              onChange={(e) => {
                const newItems = [...section.content.items];
                newItems[index] = { ...newItems[index], name: e.target.value };
                handleSectionChange(section.id, { ...section.content, items: newItems });
              }}
              className="bg-transparent border-none text-sm focus:outline-none w-24"
              placeholder="Interest"
            />
            <button
              onClick={() => {
                const newItems = section.content.items.filter((_, i) => i !== index);
                handleSectionChange(section.id, { ...section.content, items: newItems });
              }}
              className="text-slate-400 hover:text-red-500"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
        <button
          onClick={() => {
            const newItems = [...(section.content?.items || []), { name: '', id: `int-${Date.now()}` }];
            handleSectionChange(section.id, { ...section.content, items: newItems });
          }}
          className="px-3 py-1.5 text-sm text-blue-600 border border-dashed border-blue-300 rounded-full hover:bg-blue-50"
        >
          + Add
        </button>
      </div>
    </div>
  );

  const renderCertificatesSection = (section) => (
    <div className="space-y-3">
      {(section.content?.items || []).map((item) => (
        <div key={item.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium text-slate-700">{item.name || 'New Certificate'}</span>
            <button
              onClick={() => removeSectionItem(section.id, item.id)}
              className="text-red-500 hover:text-red-700 text-xs"
            >
              Remove
            </button>
          </div>
          <div className="space-y-2">
            {renderInput(section.id, item, 'name', 'Certificate Name', 'text', 'AWS Solutions Architect')}
            {renderInput(section.id, item, 'issuer', 'Issuing Organization', 'text', 'Amazon Web Services')}
            {renderInput(section.id, item, 'date', 'Date', 'text', 'Jan 2024')}
            {renderInput(section.id, item, 'credentialId', 'Credential ID', 'text', 'ABC123XYZ')}
            {renderInput(section.id, item, 'url', 'Credential URL', 'text', 'https://...')}
          </div>
        </div>
      ))}
      <button
        onClick={() => addSectionItem(section.id, {
          name: '', issuer: '', date: '', credentialId: '', url: ''
        })}
        className="w-full py-2 text-sm text-blue-600 border border-dashed border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
      >
        + Add Certificate
      </button>
    </div>
  );

  const renderProjectsSection = (section) => (
    <div className="space-y-3">
      {(section.content?.items || []).map((item) => (
        <div key={item.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium text-slate-700">{item.name || 'New Project'}</span>
            <button
              onClick={() => removeSectionItem(section.id, item.id)}
              className="text-red-500 hover:text-red-700 text-xs"
            >
              Remove
            </button>
          </div>
          <div className="space-y-2">
            {renderInput(section.id, item, 'name', 'Project Name', 'text', 'Resume Builder')}
            {renderInput(section.id, item, 'description', 'Description', 'textarea', 'Brief description...')}
            {renderInput(section.id, item, 'url', 'Project URL', 'text', 'https://github.com/...')}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Technologies</label>
              <input
                type="text"
                value={(item.technologies || []).join(', ')}
                onChange={(e) => updateSectionItem(section.id, item.id, 'technologies', 
                  e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="React, Node.js, MongoDB"
              />
              <p className="text-xs text-slate-400 mt-1">Separate with commas</p>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={() => addSectionItem(section.id, {
          name: '', description: '', technologies: [], url: '', highlights: []
        })}
        className="w-full py-2 text-sm text-blue-600 border border-dashed border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
      >
        + Add Project
      </button>
    </div>
  );

  const renderProfileSection = (section) => (
    <div>
      <textarea
        value={section.content?.text || ''}
        onChange={(e) => handleSectionChange(section.id, { text: e.target.value })}
        rows={6}
        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Write about yourself, your goals, and what makes you unique..."
      />
    </div>
  );

  const renderSectionContent = (section) => {
    switch (section.type) {
      case SECTION_TYPES.PROFILE:
        return renderProfileSection(section);
      case SECTION_TYPES.EMPLOYMENT:
        return renderEmploymentSection(section);
      case SECTION_TYPES.EDUCATION:
        return renderEducationSection(section);
      case SECTION_TYPES.SKILLS:
        return renderSkillsSection(section);
      case SECTION_TYPES.STRENGTHS:
        return renderStrengthsSection(section);
      case SECTION_TYPES.INTERESTS:
        return renderInterestsSection(section);
      case SECTION_TYPES.CERTIFICATES:
        return renderCertificatesSection(section);
      case SECTION_TYPES.PROJECTS:
        return renderProjectsSection(section);
      case SECTION_TYPES.CUSTOM:
        return renderCustomSection(section);
      default:
        return (
          <div className="text-sm text-slate-500">
            This section type is not yet supported.
          </div>
        );
    }
  };

  const renderCustomSection = (section) => {
    const items = section.content?.items || [];
    
    const updateItem = (itemId, field, value) => {
      const newItems = items.map(item => 
        item.id === itemId ? { ...item, [field]: value } : item
      );
      handleSectionChange(section.id, { ...section.content, items: newItems });
    };
    
    const removeItem = (itemId) => {
      handleSectionChange(section.id, { ...section.content, items: items.filter(i => i.id !== itemId) });
    };
    
    const addItem = () => {
      const newItems = [...items, { id: `custom-${Date.now()}`, title: '', subtitle: '', startDate: '', endDate: '', description: '' }];
      handleSectionChange(section.id, { ...section.content, items: newItems });
    };
    
    return (
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-slate-700">{item.title || 'New Entry'}</span>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700 text-xs"
              >
                Remove
              </button>
            </div>
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Title</label>
                <input
                  type="text"
                  value={item.title || ''}
                  onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Employee of the Month"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={item.subtitle || ''}
                  onChange={(e) => updateItem(item.id, 'subtitle', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Company Name, Year"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Start Date</label>
                  <input
                    type="text"
                    value={item.startDate || ''}
                    onChange={(e) => updateItem(item.id, 'startDate', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Jan 2020"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">End Date</label>
                  <input
                    type="text"
                    value={item.endDate || ''}
                    onChange={(e) => updateItem(item.id, 'endDate', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Present"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                <textarea
                  value={item.description || ''}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe this achievement or entry..."
                />
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={addItem}
          className="w-full py-2 text-sm text-blue-600 border border-dashed border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
        >
          + Add Entry
        </button>
      </div>
    );
  };

  const renderEditorPanel = () => (
    <div className="space-y-1">
      <button
        onClick={() => { setActiveSection('personal'); }}
        className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
          activeSection === 'personal' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-slate-700 hover:bg-slate-50 border border-transparent'
        }`}
      >
        Personal Details
      </button>

      {currentResume.content.sections.map((section) => (
        <div key={section.id}>
          <div className="flex items-center">
            <button
              onClick={() => {
                const prevActive = activeSection;
                setActiveSection(section.id);
                setExpandedSections(prev => {
                  const newState = {};
                  Object.keys(prev).forEach(key => { newState[key] = false; });
                  newState[section.id] = true;
                  return newState;
                });
              }}
              className={`flex-1 text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                activeSection === section.id ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-slate-700 hover:bg-slate-50 border border-transparent'
              }`}
            >
              {section.title}
            </button>
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={() => toggleSectionVisibility(section.id)}
                className={`p-1.5 rounded ${section.isVisible ? 'text-green-600' : 'text-slate-400'}`}
                title={section.isVisible ? 'Visible' : 'Hidden'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {section.isVisible ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  )}
                </svg>
              </button>
              <button
                onClick={() => {
                  setActiveSection(section.id);
                  setExpandedSections(prev => ({ ...prev, [section.id]: !prev[section.id] }));
                }}
                className="p-1.5 rounded hover:bg-slate-100 text-slate-500"
              >
                <svg 
                  className={`w-4 h-4 transition-transform ${expandedSections[section.id] ? 'rotate-180' : ''}`} 
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
          
          {activeSection === section.id && expandedSections[section.id] && (
            <div className="ml-4 mt-1 animate-in slide-in-from-top-2">
              {renderSectionContent(section)}
            </div>
          )}
        </div>
      ))}

      <div className="mt-4 pt-4 border-t border-slate-200">
        <p className="text-xs font-medium text-slate-500 uppercase mb-2 px-4">Add Section</p>
        <div className="flex flex-wrap gap-2 px-4">
          {Object.values(SECTION_TYPES).filter(t => t !== SECTION_TYPES.CUSTOM).map((type) => (
            <button
              key={type}
              onClick={() => handleAddSection(type)}
              className="px-3 py-1.5 text-xs rounded-full transition-colors bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
            >
              + {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
          <button
            onClick={() => setShowCustomSectionModal(true)}
            className="px-3 py-1.5 text-xs rounded-full transition-colors bg-purple-50 text-purple-600 hover:bg-purple-100 hover:text-purple-700 border border-dashed border-purple-300"
          >
            + Custom Section
          </button>
        </div>
      </div>
    </div>
  );

  const renderCustomizePanel = () => {
    const { customization } = currentResume;
    const { primaryColor = '#1e40af', accentColor = '#3b82f6', applyTo = {} } = customization?.colors || {};
    const { fonts = {}, fontSizes = {} } = customization?.fonts || {};
    const { headingFont = 'Inter', bodyFont = 'Open Sans' } = fonts;

    return (
      <div>
        <div className="flex border-b border-slate-200 mb-4">
          {[
            { id: 'colors', label: 'Colors', icon: (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            )},
            { id: 'fonts', label: 'Fonts', icon: (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            )},
            { id: 'layout', label: 'Layout', icon: (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            )},
            { id: 'templates', label: 'Templates', icon: (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
              </svg>
            )},
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCustomizeTab(tab.id)}
              className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium transition-colors border-b-2 ${
                customizeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {customizeTab === 'colors' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Primary Color</label>
              <div className="grid grid-cols-6 gap-2 mb-3">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleCustomizationChange('colors.primaryColor', color)}
                    className={`w-10 h-10 rounded-lg transition-all ${
                      primaryColor === color
                        ? 'ring-2 ring-offset-2 ring-blue-500 scale-110'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={primaryColor || '#1e40af'}
                  onChange={(e) => handleCustomizationChange('colors.primaryColor', e.target.value)}
                  className="w-12 h-10 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={primaryColor || '#1e40af'}
                  onChange={(e) => handleCustomizationChange('colors.primaryColor', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="#000000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Accent Color</label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={accentColor || '#3b82f6'}
                  onChange={(e) => handleCustomizationChange('colors.accentColor', e.target.value)}
                  className="w-12 h-10 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={accentColor || '#3b82f6'}
                  onChange={(e) => handleCustomizationChange('colors.accentColor', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="#000000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Apply Colors To</label>
              <div className="space-y-2">
                {[
                  { key: 'name', label: 'Name' },
                  { key: 'jobTitle', label: 'Job Title' },
                  { key: 'headings', label: 'Section Headings' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={applyTo?.[key] || false}
                      onChange={(e) => handleCustomizationChange(`colors.applyTo.${key}`, e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600"
                    />
                    <span className="text-sm text-slate-600">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {customizeTab === 'fonts' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Heading Font</label>
              <select
                value={fonts.headingFont || headingFont}
                onChange={(e) => handleCustomizationChange('fonts.headingFont', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {AVAILABLE_FONTS.heading.map((font) => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Body Font</label>
              <select
                value={fonts.bodyFont || bodyFont}
                onChange={(e) => handleCustomizationChange('fonts.bodyFont', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {AVAILABLE_FONTS.body.map((font) => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Font Sizes</label>
              <div className="space-y-4">
                {[
                  { key: 'name', label: 'Name', min: 16, max: 40 },
                  { key: 'jobTitle', label: 'Job Title', min: 12, max: 28 },
                  { key: 'heading', label: 'Headings', min: 10, max: 24 },
                  { key: 'body', label: 'Body Text', min: 8, max: 18 },
                ].map(({ key, label, min, max }) => (
                  <div key={key}>
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>{label}</span>
                      <span>{fontSizes?.[key] || 12}px</span>
                    </div>
                    <input
                      type="range"
                      min={min}
                      max={max}
                      value={fontSizes?.[key] || 12}
                      onChange={(e) => handleCustomizationChange(`fonts.fontSizes.${key}`, parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {customizeTab === 'layout' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Columns</label>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2].map((col) => (
                  <button
                    key={col}
                    onClick={() => handleCustomizationChange('layout.columns', col)}
                    className={`py-3 px-4 rounded-lg font-medium transition-colors text-sm ${
                      (customization?.layout?.columns || 2) === col
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
              <div className="grid grid-cols-2 gap-2">
                {['top', 'left'].map((pos) => (
                  <button
                    key={pos}
                    onClick={() => handleCustomizationChange('layout.headerPosition', pos)}
                    className={`py-2 px-4 rounded-lg font-medium capitalize transition-colors text-sm ${
                      (customization?.layout?.headerPosition || 'top') === pos
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
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Sidebar Width: {customization?.layout?.columnWidth || 35}%
              </label>
              <input
                type="range"
                min="20"
                max="50"
                value={customization?.layout?.columnWidth || 35}
                onChange={(e) => handleCustomizationChange('layout.columnWidth', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Spacing</label>
              <div className="space-y-4">
                {[
                  { key: 'pageMargin', label: 'Page Margin', min: 5, max: 30, suffix: 'mm', default: 10 },
                  { key: 'sectionSpacing', label: 'Section Spacing', min: 4, max: 32, suffix: 'mm', default: 16 },
                ].map(({ key, label, min, max, suffix, default: defaultVal }) => (
                  <div key={key}>
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>{label}</span>
                      <span>{(customization?.spacing?.[key] ?? defaultVal)}{suffix}</span>
                    </div>
                    <input
                      type="range"
                      min={min}
                      max={max}
                      value={customization?.spacing?.[key] ?? defaultVal}
                      onChange={(e) => handleCustomizationChange(`spacing.${key}`, parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {customizeTab === 'templates' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-500">Switch to a different template. This will reset some customization options.</p>
            <div className="grid grid-cols-2 gap-3">
              {TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateChange(template.id)}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
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
                  <p className="font-medium text-sm text-slate-800">{template.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{template.category}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderResumePreview = () => {
    const { customization, content, templateId } = currentResume;
    
    const template = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0];
    const templateStyles = template?.styles || {};
    
    const { primaryColor = templateStyles.primaryColor || '#1e40af', accentColor = templateStyles.accentColor || '#3b82f6', applyTo = {} } = customization?.colors || {};
    const { fonts = {}, fontSizes = {} } = customization?.fonts || {};
    const { pageMargin = template?.layout?.pageMargin || 10, lineHeight = 1.5, sectionSpacing = 16 } = customization?.spacing || {};
    const { headingFont = templateStyles.fontHeading || 'Inter', bodyFont = templateStyles.fontBody || 'Open Sans' } = fonts;
    const templateFontSizes = templateStyles.fontSize || {};
    const { name: nameSize = templateFontSizes.name || 24, jobTitle: jobTitleSize = templateFontSizes.jobTitle || 14, heading: headingSize = templateFontSizes.heading || 14, body: bodySize = templateFontSizes.body || 11, subtitle: subtitleSize = templateFontSizes.subtitle || 10 } = fontSizes;

    const showIcons = template?.styles?.showIcons ?? true;
    const iconStyle = template?.styles?.iconStyle || 'emoji';

    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      if (typeof dateStr === 'string' && dateStr.includes('T')) {
        const date = new Date(dateStr);
        if (!isNaN(date)) {
          return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        }
      }
      return dateStr;
    };

    const formatDateRange = (start, end) => {
      const startFormatted = formatDate(start);
      const endFormatted = formatDate(end);
      if (startFormatted && endFormatted) {
        return `${startFormatted} - ${endFormatted}`;
      }
      if (startFormatted) return startFormatted;
      if (endFormatted) return endFormatted;
      return '';
    };

    const styles = {
      fontFamily: bodyFont,
      lineHeight: lineHeight,
    };

    const getSectionEmoji = (sectionId) => {
      const section = content.sections.find(s => s.id === sectionId);
      const sectionType = section?.type || sectionId;
      return SECTION_CONFIG[sectionId]?.emoji || SECTION_CONFIG[sectionType]?.emoji || '📋';
    };

    const hasContent = (section) => {
      if (!section.content) return false;
      
      if (section.type === SECTION_TYPES.PROFILE) {
        const text = section.content.text || '';
        return text.trim() !== '' && text !== '<br>' && text !== '<p><br></p>';
      }
      
      if (section.type === SECTION_TYPES.SKILLS) {
        const categories = section.content?.categories || [];
        const hasSkills = categories.some(c => c.skills && c.skills.length > 0);
        const hasSkillItems = (section.content?.items || []).some(i => i.name);
        return hasSkills || hasSkillItems;
      }
      
      if (section.type === SECTION_TYPES.LANGUAGES || section.type === SECTION_TYPES.STRENGTHS || section.type === SECTION_TYPES.INTERESTS) {
        return (section.content?.items || []).some(item => item.name);
      }
      
      if (section.type === SECTION_TYPES.CUSTOM) {
        return (section.content?.items || []).some(item => item.title);
      }
      
      if (section.content?.items) {
        return section.content.items.some(item => {
          if (!item) return false;
          return Object.values(item).some(v => {
            if (!v) return false;
            if (typeof v === 'string' && v.trim() !== '') return true;
            if (Array.isArray(v) && v.length > 0) return true;
            return false;
          });
        });
      }
      
      return false;
    };

    const sectionOrder = template?.sectionOrder || content.sections.map(s => s.id);
    const orderedSections = sectionOrder
      .map(id => content.sections.find(s => s.id === id))
      .filter(s => s && s.isVisible !== false && s.type !== SECTION_TYPES.PROFILE);
    
    const customSections = content.sections.filter(
      s => s.isVisible !== false && !sectionOrder.includes(s.id) && s.type !== SECTION_TYPES.PROFILE
    );
    const allOrderedSections = [...orderedSections, ...customSections];

    const getSectionContent = (section) => {
      if (!section.content) return null;
      
      if (section.type === SECTION_TYPES.PROFILE) {
        const text = section.content.text || '';
        if (text.trim() === '' || text === '<br>' || text === '<p><br></p>') return null;
        return (
          <div 
            className="text-sm prose prose-sm max-w-none" 
            style={{ fontSize: `${bodySize}px` }}
            dangerouslySetInnerHTML={{ __html: section.content.text }}
          />
        );
      }
      
      if (section.type === SECTION_TYPES.SKILLS) {
        const categories = section.content?.categories || [];
        const hasCategorySkills = categories.filter(c => c.skills && c.skills.length > 0);
        const skillItems = (section.content?.items || []).filter(i => i.name);
        
        if (hasCategorySkills.length === 0 && skillItems.length === 0) return null;
        
        return (
          <div className="space-y-2">
            {hasCategorySkills.map(cat => (
              <div key={cat.id} className="text-sm">
                {cat.name && <span className="font-medium">{cat.name}: </span>}
                <span style={{ fontSize: `${bodySize}px` }}>
                  {cat.skills.filter(Boolean).join(', ')}
                </span>
              </div>
            ))}
            {skillItems.map(item => (
              <div key={item.id} className="text-sm">
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: `${bodySize}px` }}>{item.name}</span>
                  {item.level > 0 && (
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(l => (
                        <div 
                          key={l} 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: l <= item.level ? accentColor : '#e5e7eb' }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                {item.description && (
                  <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        );
      }
      
      if (section.type === SECTION_TYPES.LANGUAGES) {
        const items = (section.content?.items || []).filter(i => i.name);
        if (items.length === 0) return null;
        
        return (
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.id} className="text-sm">
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: `${bodySize}px` }}>{item.name}</span>
                  {item.level > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(l => (
                          <div 
                            key={l} 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: l <= item.level ? accentColor : '#e5e7eb' }}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-slate-500">
                        {['', 'Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Native'][item.level] || ''}
                      </span>
                    </div>
                  )}
                </div>
                {item.description && (
                  <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        );
      }
      
      if (section.type === SECTION_TYPES.STRENGTHS) {
        const items = (section.content?.items || []).filter(i => i.name);
        if (items.length === 0) return null;
        
        return (
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.id} className="text-sm">
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: `${bodySize}px` }}>{item.name}</span>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(l => (
                      <div 
                        key={l} 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: l <= (item.level || 0) ? accentColor : '#e5e7eb' }}
                      />
                    ))}
                  </div>
                </div>
                {item.description && (
                  <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        );
      }
      
      if (section.type === SECTION_TYPES.INTERESTS) {
        const items = (section.content?.items || []).filter(i => i.name);
        if (items.length === 0) return null;
        
        return (
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.id}>
                <span className="px-2 py-1 text-xs rounded" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                  {item.name}
                </span>
                {item.description && (
                  <p className="text-xs text-slate-500 mt-1 ml-1">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        );
      }
      
      if (section.type === SECTION_TYPES.EMPLOYMENT) {
        const items = (section.content?.items || []).filter(i => i.jobTitle || i.employer || i.title || i.subtitle);
        if (items.length === 0) return null;
        
        return (
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.id}>
                <div className="flex justify-between">
                  <span className="font-medium" style={{ fontSize: `${subtitleSize}px` }}>{item.jobTitle || item.title}</span>
                  <span className="text-slate-500" style={{ fontSize: `${subtitleSize}px` }}>
                    {formatDateRange(item.startDate, item.endDate) || (item.isCurrentRole ? 'Present' : '')}
                  </span>
                </div>
                <div className="text-sm text-slate-600" style={{ fontSize: `${bodySize}px` }}>
                  {item.employer || item.subtitle}{item.location ? `, ${item.location}` : ''}
                </div>
                {item.description && (
                  <div 
                    className="text-sm mt-1 prose prose-sm max-w-none" 
                    style={{ fontSize: `${bodySize}px` }}
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                )}
              </div>
            ))}
          </div>
        );
      }
      
      if (section.type === SECTION_TYPES.EDUCATION) {
        const items = (section.content?.items || []).filter(i => i.degree || i.school || i.title || i.subtitle);
        if (items.length === 0) return null;
        
        return (
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.id}>
                <div className="flex justify-between">
                  <span className="font-medium" style={{ fontSize: `${subtitleSize}px` }}>{item.degree || item.title}</span>
                  <span className="text-slate-500" style={{ fontSize: `${subtitleSize}px` }}>
                    {formatDateRange(item.startDate, item.endDate) || (item.isCurrentlyStudying ? 'Present' : '')}
                  </span>
                </div>
                <div className="text-sm text-slate-600" style={{ fontSize: `${bodySize}px` }}>
                  {item.school || item.subtitle}{item.location ? `, ${item.location}` : ''}
                </div>
                {item.description && (
                  <div 
                    className="text-sm mt-1 prose prose-sm max-w-none" 
                    style={{ fontSize: `${bodySize}px` }}
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                )}
              </div>
            ))}
          </div>
        );
      }
      
      if (section.type === SECTION_TYPES.CERTIFICATES) {
        const items = (section.content?.items || []).filter(i => i.name || i.title);
        if (items.length === 0) return null;
        
        return (
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.id}>
                <div className="flex justify-between items-start">
                  <span className="font-medium" style={{ fontSize: `${subtitleSize}px` }}>{item.name || item.title}</span>
                  {(item.startDate || item.endDate) && (
                    <span className="text-slate-500 text-xs">
                      {formatDateRange(item.startDate, item.endDate)}
                    </span>
                  )}
                </div>
                {(item.issuer || item.subtitle) && (
                  <p className="text-sm text-slate-600" style={{ fontSize: `${bodySize}px` }}>
                    {item.issuer || item.subtitle}
                    {item.location ? `, ${item.location}` : ''}
                  </p>
                )}
                {item.description && (
                  <div 
                    className="text-sm mt-1 prose prose-sm max-w-none" 
                    style={{ fontSize: `${bodySize}px` }}
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                )}
                {item.credentialId && (
                  <p className="text-xs text-slate-500 mt-1">
                    <span className="font-medium">Credential ID: </span>{item.credentialId}
                  </p>
                )}
              </div>
            ))}
          </div>
        );
      }
      
      if (section.type === SECTION_TYPES.PROJECTS) {
        const items = (section.content?.items || []).filter(i => i.name || i.title);
        if (items.length === 0) return null;
        
        return (
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.id}>
                <div className="flex justify-between items-start">
                  <span className="font-medium" style={{ fontSize: `${subtitleSize}px` }}>
                    {item.name || item.title}
                  </span>
                  {(item.startDate || item.endDate) && (
                    <span className="text-slate-500 text-xs">
                      {formatDateRange(item.startDate, item.endDate)}
                    </span>
                  )}
                </div>
                {item.url && (
                  <a href={item.url} className="text-xs text-blue-600 hover:underline" target="_blank">
                    {item.url}
                  </a>
                )}
                {item.subtitle && (
                  <p className="text-sm text-slate-600" style={{ fontSize: `${bodySize}px` }}>
                    {item.subtitle}
                    {item.location ? `, ${item.location}` : ''}
                  </p>
                )}
                {item.description && (
                  <div 
                    className="text-sm mt-1 prose prose-sm max-w-none" 
                    style={{ fontSize: `${bodySize}px` }}
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                )}
                {item.technologies?.length > 0 && (
                  <p className="text-xs text-slate-500 mt-1">
                    <span className="font-medium">Technologies: </span>{item.technologies.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        );
      }
      
      if (section.type === SECTION_TYPES.CUSTOM) {
        const items = (section.content?.items || []).filter(i => i.title);
        if (items.length === 0) return null;
        
        return (
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.id}>
                <div className="flex justify-between items-start">
                  <span className="font-medium" style={{ fontSize: `${subtitleSize}px` }}>{item.title}</span>
                  {(item.startDate || item.endDate) && (
                    <span className="text-slate-500 text-xs">
                      {formatDateRange(item.startDate, item.endDate)}
                    </span>
                  )}
                </div>
                {item.subtitle && <p className="text-sm text-slate-600" style={{ fontSize: `${bodySize}px` }}>{item.subtitle}</p>}
                {item.description && (
                  <div 
                    className="text-sm mt-1 prose prose-sm max-w-none" 
                    style={{ fontSize: `${bodySize}px` }}
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                )}
              </div>
            ))}
          </div>
        );
      }
      
      return null;
    };

    const renderSection = (section) => {
      if (!section) return null;
      const sectionContent = getSectionContent(section);
      const sectionEmoji = getSectionEmoji(section.id);
      const sectionTitle = section.title || SECTION_CONFIG[section.id]?.title || section.id;
      
      return (
        <div key={section.id} className="mb-4" style={{ marginBottom: `${sectionSpacing}mm` }}>
          <h2 
            className="font-semibold mb-2 flex items-center gap-2"
            style={{ 
              fontSize: `${headingSize}px`,
              fontFamily: headingFont,
              color: primaryColor,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            {showIcons && (
              <span className="text-base">{sectionEmoji}</span>
            )}
            {sectionTitle}
          </h2>
          {sectionContent || (
            <p className="text-xs text-slate-400 italic">Click to add content...</p>
          )}
        </div>
      );
    };

    const renderHeader = () => (
      <div className="mb-4 pb-4 border-b-2" style={{ borderColor: primaryColor }}>
        <div className="flex items-center gap-3 mb-2">
          {content.personalDetails.photo && (
            <img 
              src={content.personalDetails.photo} 
              alt="Profile" 
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <div>
            <h1 
              className="font-bold"
              style={{ 
                fontSize: `${nameSize}px`,
                fontFamily: headingFont,
                color: applyTo.name ? primaryColor : '#000'
              }}
            >
              {content.personalDetails.fullName || 'Your Name'}
            </h1>
            <p 
              className="text-sm"
              style={{ 
                fontSize: `${jobTitleSize}px`,
                color: applyTo.jobTitle ? accentColor : '#666'
              }}
            >
              {content.personalDetails.jobTitle || 'Job Title'}
            </p>
          </div>
        </div>
        <div className="text-xs text-slate-600 flex flex-wrap gap-3">
          {content.personalDetails.email && (
            <span className="flex items-center gap-1">
              {showIcons && iconStyle === 'icon' && <Mail className="w-3 h-3" />}
              {showIcons && iconStyle === 'emoji' && '📧 '}
              {content.personalDetails.email}
            </span>
          )}
          {content.personalDetails.phone && (
            <span className="flex items-center gap-1">
              {showIcons && iconStyle === 'icon' && <Phone className="w-3 h-3" />}
              {showIcons && iconStyle === 'emoji' && '📱 '}
              {content.personalDetails.phone}
            </span>
          )}
          {content.personalDetails.location && (
            <span className="flex items-center gap-1">
              {showIcons && iconStyle === 'icon' && <MapPin className="w-3 h-3" />}
              {showIcons && iconStyle === 'emoji' && '📍 '}
              {content.personalDetails.location}
            </span>
          )}
        </div>
      </div>
    );

    const isTwoColumn = template.layout?.type === 'two-column';
    const columnWidth = template.layout?.columnWidth || 35;
    const headerPosition = template.layout?.headerPosition || 'top';
    const leftColumnSections = template.layout?.leftColumnSections || [];
    const rightColumnSections = template.layout?.rightColumnSections || [];

    const renderSingleColumn = () => (
      <div style={{ margin: `${pageMargin}mm` }}>
        {allOrderedSections.map(section => renderSection(section))}
      </div>
    );

    const renderTwoColumn = () => {
      const leftSections = allOrderedSections.filter(s => leftColumnSections.includes(s.id));
      const rightSections = allOrderedSections.filter(s => rightColumnSections.includes(s.id));
      const unassignedSections = allOrderedSections.filter(s => 
        !leftColumnSections.includes(s.id) && !rightColumnSections.includes(s.id)
      );

      if (headerPosition === 'left') {
        return (
          <div className="flex gap-6" style={{ margin: `${pageMargin}mm` }}>
            <div className="w-1/3" style={{ borderRight: `2px solid ${primaryColor}`, paddingRight: '16px' }}>
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  {content.personalDetails.photo && (
                    <img 
                      src={content.personalDetails.photo} 
                      alt="Profile" 
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h1 
                      className="font-bold"
                      style={{ 
                        fontSize: `${nameSize}px`,
                        fontFamily: headingFont,
                        color: applyTo.name ? primaryColor : '#000'
                      }}
                    >
                      {content.personalDetails.fullName || 'Your Name'}
                    </h1>
                    <p 
                      className="text-sm"
                      style={{ 
                        fontSize: `${jobTitleSize}px`,
                        color: applyTo.jobTitle ? accentColor : '#666'
                      }}
                    >
                      {content.personalDetails.jobTitle || 'Job Title'}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-slate-600 space-y-1 mt-3">
                  {content.personalDetails.email && (
                    <div className="flex items-center gap-1">
                      {showIcons && iconStyle === 'icon' && <Mail className="w-3 h-3" />}
                      {showIcons && iconStyle === 'emoji' && '📧 '}
                      {content.personalDetails.email}
                    </div>
                  )}
                  {content.personalDetails.phone && (
                    <div className="flex items-center gap-1">
                      {showIcons && iconStyle === 'icon' && <Phone className="w-3 h-3" />}
                      {showIcons && iconStyle === 'emoji' && '📱 '}
                      {content.personalDetails.phone}
                    </div>
                  )}
                  {content.personalDetails.location && (
                    <div className="flex items-center gap-1">
                      {showIcons && iconStyle === 'icon' && <MapPin className="w-3 h-3" />}
                      {showIcons && iconStyle === 'emoji' && '📍 '}
                      {content.personalDetails.location}
                    </div>
                  )}
                </div>
              </div>
              {leftSections.map(section => renderSection(section))}
            </div>
            <div className="flex-1 pl-2">
              {rightSections.map(section => renderSection(section))}
              {unassignedSections.map(section => renderSection(section))}
            </div>
          </div>
        );
      }

      return (
        <div style={{ margin: `${pageMargin}mm` }}>
          <div className="flex gap-6">
            <div style={{ width: `${columnWidth}%` }}>
              {leftSections.map(section => renderSection(section))}
            </div>
            <div className="flex-1">
              {rightSections.map(section => renderSection(section))}
              {unassignedSections.map(section => renderSection(section))}
            </div>
          </div>
        </div>
      );
    };

    return (
      <div id="resume-preview" className="bg-white p-6" style={styles}>
        {headerPosition === 'top' && renderHeader()}
        {isTwoColumn ? renderTwoColumn() : renderSingleColumn()}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <input
            type="text"
            value={currentResume.name}
            onChange={(e) => updateResumeName(e.target.value)}
            className="text-lg font-semibold text-slate-800 bg-transparent border-none focus:outline-none focus:ring-0"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            title={leftPanelCollapsed ? 'Expand panel' : 'Collapse panel'}
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {leftPanelCollapsed ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              )}
            </svg>
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isDownloading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </>
            )}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {!leftPanelCollapsed && (
          <aside className="w-96 bg-white border-r border-slate-200 overflow-y-auto">
            <div className="p-4">
              <div className="flex border-b border-slate-200 mb-4">
                <button
                  onClick={() => setActiveTab('editor')}
                  className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === 'editor'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Editor
                </button>
                <button
                  onClick={() => setActiveTab('customize')}
                  className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === 'customize'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Customize
                </button>
              </div>

              {activeTab === 'editor' && (
                <ResumeEditorContent
                  content={currentResume.content}
                  sections={currentResume.content.sections}
                  onPersonalDetailsChange={handlePersonalDetailChange}
                  onSectionUpdate={handleSectionChange}
                  onSectionVisibilityToggle={toggleSectionVisibility}
                  onAddCustomSection={() => setShowCustomSectionModal(true)}
                  onEditEntry={handleEditEntry}
                  onDeleteEntry={handleDeleteEntry}
                />
              )}
              {activeTab === 'customize' && renderCustomizePanel()}
            </div>
          </aside>
        )}

        <main className="flex-1 overflow-auto bg-slate-200 p-8">
          <div className="max-w-[210mm] mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
            {renderResumePreview()}
          </div>
        </main>
      </div>

      {showCustomSectionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Add New Section</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-600 mb-3">Choose Section Type</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { type: 'experience', label: 'Work Experience', emoji: '💼' },
                  { type: 'education', label: 'Education', emoji: '🎓' },
                  { type: 'projects', label: 'Projects', emoji: '📁' },
                  { type: 'certificates', label: 'Certificates', emoji: '📜' },
                  { type: 'skills', label: 'Skills', emoji: '⚡' },
                  { type: 'languages', label: 'Languages', emoji: '🌐' },
                  { type: 'strengths', label: 'Strengths', emoji: '💪' },
                  { type: 'interests', label: 'Interests', emoji: '❤️' },
                ].map(({ type, label, emoji }) => (
                  <button
                    key={type}
                    onClick={() => {
                      const newSection = addSection(type, label);
                      setActiveSection(newSection.id);
                      setExpandedSections(prev => ({ ...prev, [newSection.id]: true }));
                      setShowCustomSectionModal(false);
                    }}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-colors text-left"
                  >
                    <span className="text-xl">{emoji}</span>
                    <span className="text-sm font-medium text-slate-700">{label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="border-t border-slate-200 pt-4 mb-4">
              <label className="block text-sm font-medium text-slate-600 mb-3">Or Create Custom Section</label>
              <input
                type="text"
                value={customSectionTitle}
                onChange={(e) => setCustomSectionTitle(e.target.value)}
                placeholder="e.g., Awards, Volunteer, Publications..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
              />
              <p className="text-xs text-slate-500 mb-3">Custom sections include: Title, Subtitle, Date Range, and Description</p>
              <button
                onClick={handleAddCustomSection}
                disabled={!customSectionTitle.trim()}
                className="w-full px-4 py-2 bg-purple-500 text-white font-medium rounded-xl hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Custom Section
              </button>
            </div>
            
            <button
              onClick={() => {
                setShowCustomSectionModal(false);
                setCustomSectionTitle('');
              }}
              className="w-full px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
