export const SECTION_TYPES = {
  PROFILE: 'profile',
  EMPLOYMENT: 'employment',
  EDUCATION: 'education',
  SKILLS: 'skills',
  STRENGTHS: 'strengths',
  INTERESTS: 'interests',
  CERTIFICATES: 'certificates',
  PROJECTS: 'projects',
  CUSTOM: 'custom',
};

export const DEFAULT_SECTIONS = [
  { id: 'profile', type: SECTION_TYPES.PROFILE, title: 'Profile', order: 0, isVisible: true },
  { id: 'employment', type: SECTION_TYPES.EMPLOYMENT, title: 'Employment History', order: 1, isVisible: true },
  { id: 'education', type: SECTION_TYPES.EDUCATION, title: 'Education', order: 2, isVisible: true },
  { id: 'skills', type: SECTION_TYPES.SKILLS, title: 'Skills', order: 3, isVisible: true },
  { id: 'strengths', type: SECTION_TYPES.STRENGTHS, title: 'Strengths', order: 4, isVisible: true },
  { id: 'interests', type: SECTION_TYPES.INTERESTS, title: 'Interests', order: 5, isVisible: false },
  { id: 'certificates', type: SECTION_TYPES.CERTIFICATES, title: 'Certificates', order: 6, isVisible: false },
  { id: 'projects', type: SECTION_TYPES.PROJECTS, title: 'Projects', order: 7, isVisible: false },
];

export const TEMPLATES = [
  {
    id: 'atlanic-blue',
    name: 'Atlantic Blue',
    category: 'modern',
    thumbnail: '/templates/atlantic-blue.png',
    default: true,
    layout: {
      columns: 2,
      headerPosition: 'top',
      columnWidth: 35,
    },
    styles: {
      fontHeading: 'Inter',
      fontBody: 'Open Sans',
      primaryColor: '#1e40af',
      accentColor: '#3b82f6',
      fontSize: { name: 24, heading: 14, body: 11, subtitle: 10 },
    },
    sectionOrder: ['profile', 'employment', 'education', 'skills', 'strengths', 'interests', 'certificates', 'projects'],
  },
  {
    id: 'classic',
    name: 'Classic',
    category: 'simple',
    thumbnail: '/templates/classic.png',
    default: false,
    layout: {
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
    },
    sectionOrder: ['profile', 'employment', 'education', 'skills', 'projects'],
  },
  {
    id: 'corporate',
    name: 'Corporate',
    category: 'professional',
    thumbnail: '/templates/corporate.png',
    default: false,
    layout: {
      columns: 2,
      headerPosition: 'left',
      columnWidth: 30,
    },
    styles: {
      fontHeading: 'Helvetica',
      fontBody: 'Roboto',
      primaryColor: '#1a365d',
      accentColor: '#2c5282',
      fontSize: { name: 20, heading: 12, body: 10, subtitle: 9 },
    },
    sectionOrder: ['employment', 'education', 'skills', 'profile', 'projects'],
  },
  {
    id: 'creative',
    name: 'Creative',
    category: 'creative',
    thumbnail: '/templates/creative.png',
    default: false,
    layout: {
      columns: 2,
      headerPosition: 'top',
      columnWidth: 40,
    },
    styles: {
      fontHeading: 'Poppins',
      fontBody: 'Nunito',
      primaryColor: '#7c3aed',
      accentColor: '#8b5cf6',
      fontSize: { name: 26, heading: 14, body: 11, subtitle: 10 },
    },
    sectionOrder: ['profile', 'skills', 'employment', 'education', 'projects'],
  },
  {
    id: 'minimal',
    name: 'Minimal',
    category: 'simple',
    thumbnail: '/templates/minimal.png',
    default: false,
    layout: {
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
    },
    sectionOrder: ['profile', 'employment', 'education', 'skills', 'strengths', 'projects'],
  },
  {
    id: 'modern',
    name: 'Modern',
    category: 'modern',
    thumbnail: '/templates/modern.png',
    default: false,
    layout: {
      columns: 2,
      headerPosition: 'top',
      columnWidth: 38,
    },
    styles: {
      fontHeading: 'Montserrat',
      fontBody: 'Source Sans Pro',
      primaryColor: '#0891b2',
      accentColor: '#06b6d4',
      fontSize: { name: 24, heading: 13, body: 10, subtitle: 9 },
    },
    sectionOrder: ['profile', 'skills', 'employment', 'education', 'projects'],
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
