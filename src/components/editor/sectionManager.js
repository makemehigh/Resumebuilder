import {
  faUser,
  faGraduationCap,
  faBolt,
  faTrophy,
  faLanguage,
  faBriefcase,
  faFolderOpen,
  faCertificate,
  faAward,
  faHeart,
  faCoffee,
  faFileAlt,
  faEnvelope,
  faUsers,
  faBook,
  faLink,
  faLaptopCode,
  faCog,
  faPalette,
  faSearch,
  faMicrophone,
  faStar,
  faUserEdit,
} from '@fortawesome/free-solid-svg-icons';

export const SECTION_ICONS = {
  personal: faUser,
  'personal-info': faUser,
  education: faGraduationCap,
  skills: faBolt,
  strengths: faTrophy,
  languages: faLanguage,
  experience: faBriefcase,
  employment: faBriefcase,
  'work-experience': faBriefcase,
  projects: faFolderOpen,
  certificates: faCertificate,
  certifications: faAward,
  interests: faHeart,
  hobbies: faCoffee,
  professional_summary: faFileAlt,
  profile: faUserEdit,
  summary: faFileAlt,
  'executive-summary': faFileAlt,
  contact: faEnvelope,
  references: faUsers,
  publications: faBook,
  links: faLink,
  'tech-stack': faLaptopCode,
  software: faCog,
  portfolio: faPalette,
  'research-interests': faSearch,
  teaching: faBook,
  conferences: faMicrophone,
  awards: faAward,
  'awards-honors': faAward,
  'core-competencies': faStar,
  'academic-positions': faBriefcase,
  'professional-memberships': faUsers,
  'board-positions': faBriefcase,
};

export const SECTION_EMOJI = {
  'personal-info': '👤',
  education: '🎓',
  experience: '💼',
  'work-experience': '💼',
  skills: '⚡',
  languages: '🌐',
  strengths: '💪',
  awards: '🏆',
  certificates: '📜',
  certifications: '🏅',
  projects: '📁',
  interests: '❤️',
  hobbies: '🎯',
  profile: '📝',
  summary: '📋',
  'executive-summary': '📋',
  contact: '📧',
  references: '👥',
  publications: '📚',
  links: '🔗',
  'tech-stack': '💻',
  software: '⚙️',
  portfolio: '🎨',
  'research-interests': '🔬',
  teaching: '📖',
  conferences: '🎤'
};

export const sectionManager = {
  sections: [
    {
      id: 'personal',
      title: 'Personal Information',
      type: 'fixed',
      collapsible: false,
      icon: faUser,
      fields: [
        { name: 'fullName', type: 'text', required: true, label: 'Full Name', placeholder: 'John Doe' },
        { name: 'title', type: 'text', required: true, label: 'Professional Title', placeholder: 'Software Engineer' },
        { name: 'email', type: 'email', required: true, label: 'Email', placeholder: 'john@example.com', reorderable: true },
        { name: 'phone', type: 'tel', required: true, label: 'Phone', placeholder: '+1 555 123-4567', reorderable: true },
        { name: 'location', type: 'text', required: true, label: 'Location', placeholder: 'New York, NY', reorderable: true },
        { name: 'nationality', type: 'text', required: false, label: 'Nationality', placeholder: 'American', reorderable: true },
        { name: 'photo', type: 'image', required: false, label: 'Photo' }
      ]
    },
    {
      id: 'professional_summary',
      title: 'Professional Summary',
      type: 'single',
      collapsible: true,
      icon: faFileAlt,
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Enter Title', placeholder: 'Enter Title', hasLink: true },
        { name: 'subtitle', type: 'text', required: false, label: 'Enter Subtitle', placeholder: 'Enter Subtitle' },
        { name: 'description', type: 'richtext', required: true, label: 'Summary', placeholder: 'Write a brief professional summary...' },
      ]
    },
    {
      id: 'experience',
      title: 'Work Experience',
      type: 'list',
      collapsible: true,
      icon: faBriefcase,
      fields: [
        { name: 'jobTitle', type: 'text', required: true, label: 'Job Title', placeholder: 'Senior Developer' },
        { name: 'employer', type: 'text', required: false, label: 'Company', placeholder: 'Tech Corp Inc.' },
        { name: 'startDate', type: 'date', required: false, label: 'Start Date' },
        { name: 'endDate', type: 'date', required: false, label: 'End Date', endDate: true },
        { name: 'location', type: 'text', required: false, label: 'Location', placeholder: 'San Francisco, CA' },
        { name: 'description', type: 'richtext', required: false, label: 'Description', placeholder: 'Describe your responsibilities and achievements...' }
      ]
    },
    {
      id: 'education',
      title: 'Education',
      type: 'list',
      collapsible: true,
      icon: faGraduationCap,
      fields: [
        { name: 'school', type: 'text', required: true, label: 'School/University', placeholder: 'MIT', hasLink: true },
        { name: 'degree', type: 'text', required: true, label: 'Degree', placeholder: 'Bachelor of Science in Computer Science' },
        { name: 'startDate', type: 'date', required: false, label: 'Start Date' },
        { name: 'endDate', type: 'date', required: false, label: 'End Date', endDate: true },
        { name: 'location', type: 'text', required: false, label: 'Location', placeholder: 'Cambridge, MA' },
        { name: 'description', type: 'richtext', required: false, label: 'Description', placeholder: 'GPA, honors, relevant coursework...' }
      ]
    },
    {
      id: 'skills',
      title: 'Skills',
      type: 'list',
      collapsible: true,
      icon: faBolt,
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Skill', placeholder: 'JavaScript' },
        { name: 'level', type: 'rating', required: false, label: 'Proficiency Level' },
        { name: 'description', type: 'richtext', required: false, label: 'Details (optional)', placeholder: 'Additional details...' }
      ]
    },
    {
      id: 'languages',
      title: 'Languages',
      type: 'list',
      collapsible: true,
      icon: faLanguage,
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Language', placeholder: 'English' },
        { name: 'level', type: 'rating', required: false, label: 'Proficiency Level' },
        { name: 'description', type: 'richtext', required: false, label: 'Details (optional)', placeholder: 'Additional details...' }
      ]
    },
    {
      id: 'strengths',
      title: 'Strengths',
      type: 'list',
      collapsible: true,
      icon: faTrophy,
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Strength', placeholder: 'Leadership' },
        { name: 'level', type: 'rating', required: false, label: 'Level' },
        { name: 'description', type: 'richtext', required: false, label: 'Details (optional)', placeholder: 'Additional details...' }
      ]
    },
    {
      id: 'projects',
      title: 'Projects',
      type: 'list',
      collapsible: true,
      icon: faFolderOpen,
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Project Title', placeholder: 'Resume Builder App', hasLink: true },
        { name: 'subtitle', type: 'text', required: false, label: 'Role/Technologies', placeholder: 'React, Node.js, MongoDB' },
        { name: 'startDate', type: 'date', required: false, label: 'Start Date' },
        { name: 'endDate', type: 'date', required: false, label: 'End Date', endDate: true },
        { name: 'location', type: 'text', required: false, label: 'Location', placeholder: 'Remote' },
        { name: 'description', type: 'richtext', required: false, label: 'Description', placeholder: 'Describe the project, your role, and achievements...' }
      ]
    },
    {
      id: 'certificates',
      title: 'Certificates',
      type: 'list',
      collapsible: true,
      icon: faCertificate,
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Certificate Name', placeholder: 'AWS Solutions Architect', hasLink: true },
        { name: 'subtitle', type: 'text', required: false, label: 'Issuing Organization', placeholder: 'Amazon Web Services' },
        { name: 'startDate', type: 'date', required: false, label: 'Issue Date' },
        { name: 'endDate', type: 'date', required: false, label: 'Expiry Date', endDate: true },
        { name: 'location', type: 'text', required: false, label: 'Location', placeholder: 'Online' },
        { name: 'description', type: 'richtext', required: false, label: 'Description', placeholder: 'Credential ID, URL, or additional details...' }
      ]
    },
    {
      id: 'interests',
      title: 'Interests',
      type: 'list',
      collapsible: true,
      icon: faHeart,
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Interest', placeholder: 'Photography' },
        { name: 'description', type: 'richtext', required: false, label: 'Details (optional)', placeholder: 'Additional details...' }
      ]
    }
  ]
};

export const getSectionConfig = (sectionId) => {
  return sectionManager.sections.find(s => s.id === sectionId);
};

export const getAllSectionIds = () => {
  return sectionManager.sections.map(s => s.id);
};

export const createEmptyEntry = (sectionId) => {
  const config = getSectionConfig(sectionId);
  
  const entry = { id: `${sectionId}-${Date.now()}` };
  
  if (!config) {
    entry.title = '';
    entry.subtitle = '';
    entry.startDate = '';
    entry.endDate = '';
    entry.description = '';
    return entry;
  }

  config.fields.forEach(field => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
        entry[field.name] = '';
        break;
      case 'date':
        entry[field.name] = '';
        entry[`${field.name}Text`] = '';
        break;
      case 'richtext':
        entry[field.name] = '';
        break;
      case 'rating':
        entry[field.name] = 0;
        break;
      case 'image':
        entry[field.name] = '';
        break;
    }
  });

  return entry;
};

export const getEntryPreview = (sectionId, entry) => {
  const config = getSectionConfig(sectionId);
  
  if (!config) {
    const preview = [];
    if (entry.title || entry.name) preview.push(entry.title || entry.name);
    if (entry.subtitle) preview.push(entry.subtitle);
    return preview;
  }

  const preview = [];
  
  config.fields.forEach(field => {
    if (field.type === 'text' && entry[field.name]) {
      if (field.hasLink) {
        preview.push(entry[field.name]);
      }
    }
    if (field.type === 'date' && entry[`${field.name}Text`]) {
      preview.push(entry[`${field.name}Text`]);
    }
  });

  return preview.slice(0, 3);
};

export const formatEntryTitle = (sectionId, entry) => {
  const config = getSectionConfig(sectionId);
  
  if (!config) {
    return entry.title || entry.name || 'Untitled';
  }

  for (const field of config.fields) {
    if (field.hasLink && entry[field.name]) {
      return entry[field.name];
    }
    if (field.type === 'text' && field.required && entry[field.name]) {
      return entry[field.name];
    }
  }

  if (isEntryEmpty(sectionId, entry)) {
    return 'New Entry';
  }

  return entry.title || entry.name || 'Untitled';
};

export const isEntryEmpty = (sectionId, entry) => {
  const config = getSectionConfig(sectionId);
  
  if (!config) {
    const customFields = ['title', 'subtitle', 'description', 'name'];
    for (const field of customFields) {
      if (entry[field] && typeof entry[field] === 'string' && entry[field].trim() !== '') {
        return false;
      }
    }
    return true;
  }

  for (const field of config.fields) {
    const value = entry[field.name];
    if (value && typeof value === 'string' && value.trim() !== '') {
      return false;
    }
    if (field.type === 'rating' && value > 0) {
      return false;
    }
    if (field.type === 'richtext' && value && value !== '<br>' && value !== '<p><br></p>') {
      return false;
    }
  }

  return true;
};
