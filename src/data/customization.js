import { TEMPLATES, COLOR_PRESETS } from './templates';

export const DEFAULT_CUSTOMIZATION = {
  language: 'English (US)',
  dateFormat: 'MM/DD/YYYY',
  pageSize: 'A4',
  
  layout: {
    columns: 2,
    headerPosition: 'top',
    columnWidth: 35,
    sectionOrder: [],
  },
  
  spacing: {
    pageMargin: 10,
    lineHeight: 1.5,
    sectionSpacing: 16,
  },
  
  colors: {
    primaryColor: '#1e40af',
    accentColor: '#3b82f6',
    applyTo: {
      name: true,
      jobTitle: true,
      headings: true,
      headingsLine: true,
      headerIcons: true,
      dates: false,
      bars: false,
      bullets: false,
      entrySubtitle: false,
      linkIcons: true,
    },
  },
  
  fonts: {
    fontStyle: 'sans',
    headingFont: 'Inter',
    bodyFont: 'Open Sans',
    fontSizes: {
      name: 24,
      jobTitle: 14,
      heading: 14,
      body: 11,
      subtitle: 10,
    },
  },
  
  photo: {
    show: true,
    grayscale: false,
    size: 'medium',
    shape: 'square',
  },
  
  professionalTitle: {
    size: 'medium',
    position: 'same-line',
    style: 'normal',
  },
  
  sections: {
    profile: {
      showHeading: false,
    },
    employment: {
      titleSubtitleOrder: 'title-first',
      groupPromotions: true,
      displayStyle: 'list',
    },
    education: {
      titleSubtitleOrder: 'degree-first',
      displayStyle: 'list',
    },
    skills: {
      displayStyle: 'grid',
      columns: 2,
    },
    strengths: {
      displayStyle: 'level',
      columns: 2,
    },
    interests: {
      displayStyle: 'bubble',
    },
    certificates: {
      displayStyle: 'list',
    },
    projects: {
      displayStyle: 'list',
    },
    custom: {
      displayStyle: 'list',
    },
  },
  
  entryLayout: {
    titleSize: 'medium',
    subtitleStyle: 'normal',
    subtitlePlacement: 'same-line',
    descriptionIndent: false,
    listStyle: 'bullet',
  },
  
  footer: {
    showPageNumbers: false,
    showFooterLine: false,
    text: '',
  },
  
  links: {
    underline: false,
    blueColor: false,
    boldName: true,
  },
};

export const CUSTOMIZATION_OPTIONS = {
  language: ['English (US)', 'English (UK)', 'Spanish', 'French', 'German', 'Portuguese'],
  dateFormat: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'],
  pageSize: ['A4', 'Letter'],
  
  columns: [1, 2, 3],
  headerPosition: ['left', 'top', 'right'],
  
  fontStyle: ['sans', 'serif', 'mono'],
  
  photoSize: ['extra-small', 'small', 'medium', 'large', 'extra-large'],
  photoShape: ['square', 'circle', 'rounded'],
  
  titleSize: ['small', 'medium', 'large'],
  subtitleStyle: ['normal', 'bold', 'italic', 'bold-italic'],
  subtitlePlacement: ['same-line', 'next-line'],
  listStyle: ['bullet', 'hyphen', 'arrow', 'number', 'none'],
  
  displayStyle: {
    skills: ['grid', 'compact', 'bubble', 'level'],
    strengths: ['grid', 'level', 'compact', 'bubble'],
    interests: ['grid', 'compact', 'bubble'],
    certificates: ['grid', 'compact', 'list'],
    projects: ['grid', 'compact', 'list'],
    employment: ['list', 'compact', 'grid'],
    education: ['list', 'compact', 'grid'],
  },
  
  titleSubtitleOrder: ['title-first', 'employer-first', 'degree-first', 'school-first'],
};

export const getDefaultCustomization = (templateId) => {
  const template = TEMPLATES.find(t => t.id === templateId);
  if (!template) return DEFAULT_CUSTOMIZATION;
  
  return {
    ...DEFAULT_CUSTOMIZATION,
    layout: {
      ...DEFAULT_CUSTOMIZATION.layout,
      columns: template.layout.columns,
      headerPosition: template.layout.headerPosition,
      columnWidth: template.layout.columnWidth,
      sectionOrder: template.sectionOrder,
    },
    colors: {
      ...DEFAULT_CUSTOMIZATION.colors,
      primaryColor: template.styles.primaryColor,
      accentColor: template.styles.accentColor,
    },
    fonts: {
      ...DEFAULT_CUSTOMIZATION.fonts,
      headingFont: template.styles.fontHeading,
      bodyFont: template.styles.fontBody,
      fontSizes: template.styles.fontSize,
    },
  };
};

export const updateCustomization = (customization, path, value) => {
  const keys = path.split('.');
  const newCustomization = JSON.parse(JSON.stringify(customization));
  
  let current = newCustomization;
  for (let i = 0; i < keys.length - 1; i++) {
    current[keys[i]] = { ...current[keys[i]] };
    current = current[keys[i]];
  }
  
  current[keys[keys.length - 1]] = value;
  return newCustomization;
};

export const applyTemplateStyles = (customization, templateId) => {
  const template = TEMPLATES.find(t => t.id === templateId);
  if (!template) return customization;
  
  return {
    ...customization,
    layout: {
      ...customization.layout,
      columns: template.layout.columns,
      headerPosition: template.layout.headerPosition,
      columnWidth: template.layout.columnWidth,
    },
    colors: {
      ...customization.colors,
      primaryColor: template.styles.primaryColor,
      accentColor: template.styles.accentColor,
    },
    fonts: {
      ...customization.fonts,
      headingFont: template.styles.fontHeading,
      bodyFont: template.styles.fontBody,
      fontSizes: template.styles.fontSize,
    },
  };
};
