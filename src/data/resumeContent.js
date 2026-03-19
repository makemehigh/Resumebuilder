import { SECTION_TYPES, DEFAULT_SECTIONS } from './templates';

export const createEmptyResume = (templateId = 'atlanic-blue') => ({
  personalDetails: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    photo: '',
    isPhotoVisible: true,
    socials: [
      { platform: 'linkedin', url: '' },
      { platform: 'github', url: '' },
      { platform: 'portfolio', url: '' },
    ],
  },
  sections: DEFAULT_SECTIONS.map(section => ({
    ...section,
    content: getEmptySectionContent(section.type),
  })),
});

export const getEmptySectionContent = (type) => {
  switch (type) {
    case SECTION_TYPES.PROFILE:
      return { text: '' };
    case SECTION_TYPES.EMPLOYMENT:
      return {
        items: [
          {
            id: 'emp-1',
            jobTitle: '',
            employer: '',
            location: '',
            startDate: '',
            endDate: '',
            isCurrentRole: false,
            description: '',
          }
        ],
      };
    case SECTION_TYPES.EDUCATION:
      return {
        items: [
          {
            id: 'edu-1',
            degree: '',
            school: '',
            location: '',
            startDate: '',
            endDate: '',
            isCurrentlyStudying: false,
            description: '',
          }
        ],
      };
    case SECTION_TYPES.SKILLS:
      return {
        items: [],
        categories: [
          { id: 'cat-1', name: 'Technical', skills: [] },
          { id: 'cat-2', name: 'Tools', skills: [] },
          { id: 'cat-3', name: 'Languages', skills: [] },
        ],
        displayStyle: 'grid',
      };
    case SECTION_TYPES.LANGUAGES:
      return {
        items: [
          { id: 'lang-1', name: '', level: 3 },
        ],
        displayStyle: 'list',
      };
    case SECTION_TYPES.STRENGTHS:
      return {
        items: [
          { id: 'str-1', name: '', level: 3 },
        ],
        displayStyle: 'level',
      };
    case SECTION_TYPES.INTERESTS:
      return {
        items: [],
        displayStyle: 'bubble',
      };
    case SECTION_TYPES.CERTIFICATES:
      return {
        items: [
          {
            id: 'cert-1',
            name: '',
            issuer: '',
            date: '',
            credentialId: '',
            url: '',
          }
        ],
        displayStyle: 'list',
      };
    case SECTION_TYPES.PROJECTS:
      return {
        items: [
          {
            id: 'proj-1',
            name: '',
            description: '',
            technologies: [],
            url: '',
            highlights: [],
          }
        ],
      };
    case SECTION_TYPES.CUSTOM:
      return {
        title: 'Custom Section',
        items: [{ id: 'custom-1', title: '', subtitle: '', description: '', date: '' }],
        displayStyle: 'list',
      };
    default:
      return {};
  }
};

export const addSection = (sections, type, title) => {
  const newSection = {
    id: `${type}-${Date.now()}`,
    type,
    title: title || type.charAt(0).toUpperCase() + type.slice(1),
    order: sections.length,
    isVisible: true,
    content: getEmptySectionContent(type),
  };
  return [...sections, newSection];
};

export const removeSection = (sections, sectionId) => {
  return sections.filter(s => s.id !== sectionId);
};

export const reorderSections = (sections, fromIndex, toIndex) => {
  const newSections = [...sections];
  const [removed] = newSections.splice(fromIndex, 1);
  newSections.splice(toIndex, 0, removed);
  return newSections.map((s, i) => ({ ...s, order: i }));
};

export const toggleSectionVisibility = (sections, sectionId) => {
  return sections.map(s => 
    s.id === sectionId ? { ...s, isVisible: !s.isVisible } : s
  );
};

export const updateSectionContent = (sections, sectionId, content) => {
  return sections.map(s => 
    s.id === sectionId ? { ...s, content } : s
  );
};

export const updatePersonalDetails = (resume, field, value) => {
  if (field.includes('.')) {
    const [parent, child] = field.split('.');
    return {
      ...resume,
      personalDetails: {
        ...resume.personalDetails,
        [parent]: {
          ...resume.personalDetails[parent],
          [child]: value,
        },
      },
    };
  }
  return {
    ...resume,
    personalDetails: {
      ...resume.personalDetails,
      [field]: value,
    },
  };
};

export const EMPLOYMENT_FIELDS = [
  { key: 'jobTitle', label: 'Job Title', type: 'text', placeholder: 'e.g. Senior Developer' },
  { key: 'employer', label: 'Company', type: 'text', placeholder: 'e.g. Google' },
  { key: 'location', label: 'Location', type: 'text', placeholder: 'e.g. San Francisco, CA' },
  { key: 'startDate', label: 'Start Date', type: 'month' },
  { key: 'endDate', label: 'End Date', type: 'month' },
  { key: 'isCurrentRole', label: 'I currently work here', type: 'checkbox' },
  { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe your responsibilities and achievements...' },
];

export const EDUCATION_FIELDS = [
  { key: 'degree', label: 'Degree', type: 'text', placeholder: 'e.g. Bachelor of Science' },
  { key: 'school', label: 'School/University', type: 'text', placeholder: 'e.g. MIT' },
  { key: 'location', label: 'Location', type: 'text', placeholder: 'e.g. Cambridge, MA' },
  { key: 'startDate', label: 'Start Date', type: 'month' },
  { key: 'endDate', label: 'End Date', type: 'month' },
  { key: 'isCurrentlyStudying', label: 'I currently study here', type: 'checkbox' },
  { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Relevant coursework, achievements...' },
];

export const PROJECT_FIELDS = [
  { key: 'name', label: 'Project Name', type: 'text', placeholder: 'e.g. Resume Builder' },
  { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Brief description of the project...' },
  { key: 'technologies', label: 'Technologies', type: 'tags', placeholder: 'Add technologies...' },
  { key: 'url', label: 'Project URL', type: 'url', placeholder: 'https://...' },
];

export const CERTIFICATE_FIELDS = [
  { key: 'name', label: 'Certificate Name', type: 'text', placeholder: 'e.g. AWS Solutions Architect' },
  { key: 'issuer', label: 'Issuing Organization', type: 'text', placeholder: 'e.g. Amazon Web Services' },
  { key: 'date', label: 'Date', type: 'month' },
  { key: 'credentialId', label: 'Credential ID', type: 'text', placeholder: 'Optional' },
  { key: 'url', label: 'Credential URL', type: 'url', placeholder: 'https://...' },
];
