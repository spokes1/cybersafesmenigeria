// Shared catalogue data used by both the homepage and the resources section.
// Kept separate so neither module has to import the other.

export const RESOURCE_CATEGORIES = [
  {
    iconName: 'download',
    name: 'Downloads',
    copy: 'Documents you can save and share with your staff.',
    href: '/resources/downloads',
  },
  {
    iconName: 'building',
    name: 'Cybersecurity organisations',
    copy: 'Nigeria-first incident reporting and complaint contacts, with the right first action for each situation.',
    href: '/resources/organisations',
  },
  {
    iconName: 'ext',
    name: 'External resources',
    copy: 'Trusted links to government agencies and security bodies.',
    href: '/resources/external',
  },
  {
    iconName: 'tools',
    name: 'Tools',
    copy: 'Free and low-cost tools worth knowing about.',
    href: '/resources/tools',
  },
];
