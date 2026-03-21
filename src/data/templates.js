export const SECTION_TYPES = {
  PROFILE: 'profile',
  EMPLOYMENT: 'employment',
  EDUCATION: 'education',
  SKILLS: 'skills',
  STRENGTHS: 'strengths',
  INTERESTS: 'interests',
  CERTIFICATES: 'certificates',
  PROJECTS: 'projects',
  LANGUAGES: 'languages',
  CUSTOM: 'custom',
};

export const SECTION_CONFIG = {
  profile: { title: 'Profile', icon: '📝', emoji: '📝' },
  employment: { title: 'Work Experience', icon: '💼', emoji: '💼' },
  education: { title: 'Education', icon: '🎓', emoji: '🎓' },
  skills: { title: 'Skills', icon: '⚡', emoji: '⚡' },
  strengths: { title: 'Strengths', icon: '💪', emoji: '💪' },
  languages: { title: 'Languages', icon: '🌐', emoji: '🌐' },
  interests: { title: 'Interests', icon: '❤️', emoji: '❤️' },
  hobbies: { title: 'Hobbies', icon: '🎯', emoji: '🎯' },
  certificates: { title: 'Certificates', icon: '📜', emoji: '📜' },
  certifications: { title: 'Certifications', icon: '🏅', emoji: '🏅' },
  projects: { title: 'Projects', icon: '📁', emoji: '📁' },
  awards: { title: 'Awards', icon: '🏆', emoji: '🏆' },
  references: { title: 'References', icon: '👥', emoji: '👥' },
  publications: { title: 'Publications', icon: '📚', emoji: '📚' },
  links: { title: 'Links', icon: '🔗', emoji: '🔗' },
  'tech-stack': { title: 'Tech Stack', icon: '💻', emoji: '💻' },
  software: { title: 'Software', icon: '⚙️', emoji: '⚙️' },
  portfolio: { title: 'Portfolio', icon: '🎨', emoji: '🎨' },
  custom: { title: 'Custom Section', icon: '📋', emoji: '📋' },
};

export const DEFAULT_SECTIONS = [
  { id: 'profile', type: SECTION_TYPES.PROFILE, title: 'Profile', order: 0, isVisible: true },
  { id: 'employment', type: SECTION_TYPES.EMPLOYMENT, title: 'Work Experience', order: 1, isVisible: true },
  { id: 'education', type: SECTION_TYPES.EDUCATION, title: 'Education', order: 2, isVisible: true },
  { id: 'skills', type: SECTION_TYPES.SKILLS, title: 'Skills', order: 3, isVisible: true },
  { id: 'languages', type: SECTION_TYPES.LANGUAGES, title: 'Languages', order: 4, isVisible: false },
  { id: 'strengths', type: SECTION_TYPES.STRENGTHS, title: 'Strengths', order: 5, isVisible: false },
  { id: 'projects', type: SECTION_TYPES.PROJECTS, title: 'Projects', order: 6, isVisible: false },
  { id: 'certificates', type: SECTION_TYPES.CERTIFICATES, title: 'Certificates', order: 7, isVisible: false },
  { id: 'interests', type: SECTION_TYPES.INTERESTS, title: 'Interests', order: 8, isVisible: false },
];

export const TEMPLATES = [
  {
    id: 'atlantic-blue',
    name: 'Atlantic Blue',
    category: 'modern',
    thumbnail: '/templates/atlantic-blue.png',
    default: true,
    layout: {
      type: 'two-column',
      columns: 2,
      headerPosition: 'top',
      columnWidth: 35,
      leftColumnSections: ['skills', 'languages', 'strengths'],
      rightColumnSections: ['employment', 'education', 'projects', 'certificates', 'interests'],
    },
    styles: {
      fontHeading: 'Inter',
      fontBody: 'Open Sans',
      primaryColor: '#1e40af',
      accentColor: '#3b82f6',
      fontSize: { name: 24, heading: 14, body: 11, subtitle: 10 },
      showIcons: true,
      iconStyle: 'emoji',
      showSectionUnderline: true,
    },
    sectionOrder: ['employment', 'education', 'skills', 'languages', 'strengths', 'projects', 'certificates', 'interests'],
  },
  {
    id: 'classic',
    name: 'Classic',
    category: 'simple',
    thumbnail: '/templates/classic.png',
    default: false,
    layout: {
      type: 'single-column',
      columns: 1,
      headerPosition: 'top',
      columnWidth: 0,
    },
    styles: {
      fontHeading: 'Georgia',
      fontBody: 'Arial',
      primaryColor: '#000000',
      accentColor: '#333333',
      fontSize: { name: 22, heading: 13, body: 11, subtitle: 10 },
      showIcons: false,
    },
    sectionOrder: ['employment', 'education', 'skills', 'languages', 'projects', 'certificates', 'interests'],
  },
  {
    id: 'corporate',
    name: 'Corporate',
    category: 'professional',
    thumbnail: '/templates/corporate.png',
    default: false,
    layout: {
      type: 'two-column',
      columns: 2,
      headerPosition: 'left',
      columnWidth: 30,
      leftColumnSections: ['skills', 'languages', 'certificates'],
      rightColumnSections: ['employment', 'education', 'projects', 'interests'],
    },
    styles: {
      fontHeading: 'Helvetica',
      fontBody: 'Roboto',
      primaryColor: '#1a365d',
      accentColor: '#2c5282',
      fontSize: { name: 20, heading: 12, body: 10, subtitle: 9 },
      showIcons: true,
      iconStyle: 'emoji',
    },
    sectionOrder: ['employment', 'education', 'skills', 'languages', 'projects', 'certificates', 'interests'],
  },
  {
    id: 'creative',
    name: 'Creative',
    category: 'creative',
    thumbnail: '/templates/creative.png',
    default: false,
    layout: {
      type: 'two-column',
      columns: 2,
      headerPosition: 'top',
      columnWidth: 40,
      leftColumnSections: ['skills', 'languages', 'interests'],
      rightColumnSections: ['employment', 'education', 'projects', 'certificates'],
    },
    styles: {
      fontHeading: 'Poppins',
      fontBody: 'Nunito',
      primaryColor: '#7c3aed',
      accentColor: '#8b5cf6',
      fontSize: { name: 26, heading: 14, body: 11, subtitle: 10 },
      showIcons: true,
      iconStyle: 'emoji',
    },
    sectionOrder: ['skills', 'employment', 'education', 'languages', 'projects', 'certificates', 'interests'],
  },
  {
    id: 'minimal',
    name: 'Minimal',
    category: 'simple',
    thumbnail: '/templates/minimal.png',
    default: false,
    layout: {
      type: 'single-column',
      columns: 1,
      headerPosition: 'top',
      columnWidth: 0,
    },
    styles: {
      fontHeading: 'Lato',
      fontBody: 'Open Sans',
      primaryColor: '#374151',
      accentColor: '#6b7280',
      fontSize: { name: 22, heading: 13, body: 11, subtitle: 10 },
      showIcons: false,
    },
    sectionOrder: ['employment', 'education', 'skills', 'languages', 'strengths', 'projects', 'certificates', 'interests'],
  },
  {
    id: 'modern',
    name: 'Modern',
    category: 'modern',
    thumbnail: '/templates/modern.png',
    default: false,
    layout: {
      type: 'two-column',
      columns: 2,
      headerPosition: 'top',
      columnWidth: 38,
      leftColumnSections: ['skills', 'languages', 'certificates'],
      rightColumnSections: ['employment', 'education', 'projects', 'interests'],
    },
    styles: {
      fontHeading: 'Montserrat',
      fontBody: 'Source Sans Pro',
      primaryColor: '#0891b2',
      accentColor: '#06b6d4',
      fontSize: { name: 24, heading: 13, body: 10, subtitle: 9 },
      showIcons: true,
      iconStyle: 'emoji',
    },
    sectionOrder: ['skills', 'employment', 'education', 'languages', 'projects', 'certificates', 'interests'],
  },
];

export const TEMPLATE_CATEGORIES = ['all', 'simple', 'modern', 'professional', 'creative'];

export const AVAILABLE_FONTS = {
  heading: ['Inter', 'Poppins', 'Montserrat', 'Helvetica', 'Georgia', 'Lato', 'Roboto', 'Open Sans', 'Arial'],
  body: ['Open Sans', 'Nunito', 'Source Sans Pro', 'Roboto', 'Arial', 'Inter', 'Lato', 'Georgia'],
};

export const COLOR_PRESETS = [
  '#1e40af', '#0891b2', '#7c3aed', '#dc2626', '#ea580c', '#65a30d',
  '#000000', '#1f2937', '#4b5563', '#6b7280', '#9ca3af', '#d1d5db',
];

export const getTemplateConfig = (templateId) => {
  return TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0];
};

export const getSectionDisplayTitle = (sectionId) => {
  return SECTION_CONFIG[sectionId]?.title || sectionId.charAt(0).toUpperCase() + sectionId.slice(1).replace(/-/g, ' ');
};

export const getSectionEmoji = (sectionId) => {
  return SECTION_CONFIG[sectionId]?.emoji || '📄';
};
