// Shared catalogue data used by both the homepage and the resources section.
// Kept separate so neither module has to import the other.

export const RESOURCE_CATEGORIES = [
  {
    iconName: 'book',
    name: 'Guides',
    copy: 'Step-by-step explanations of common security topics.',
    href: '/resources/guides',
  },
  {
    iconName: 'list',
    name: 'Checklists',
    copy: 'Quick references your team can use and revisit.',
    href: '/resources/checklists',
  },
  {
    iconName: 'download',
    name: 'Downloads',
    copy: 'Documents you can save and share with your staff.',
    href: '/resources/downloads',
  },
  {
    iconName: 'building',
    name: 'Cybersecurity organisations',
    copy: 'Nigerian and international bodies that can help.',
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

/* Checklist items. `id` values are localStorage keys, so keep them stable
   when editing wording so saved progress is not orphaned. */
export const CHECKLIST = [
  {
    group: 'Accounts and passwords',
    items: [
      { id: 'unique-passwords', text: 'Every work account has its own password, not a reused one' },
      { id: '2fa-email', text: 'Two-factor authentication is enabled on business email' },
      { id: '2fa-whatsapp', text: 'WhatsApp two-step verification is turned on' },
      { id: 'no-shared-logins', text: 'Staff have individual logins rather than shared accounts' },
      { id: 'leaver-access', text: 'Access is removed the day a staff member leaves' },
    ],
  },
  {
    group: 'Payments',
    items: [
      { id: 'confirm-credit', text: 'Payments are confirmed in your own banking app before goods are released' },
      { id: 'verify-account-change', text: 'Any change of supplier account details is confirmed by phone on a known number' },
      { id: 'second-approver', text: 'Transfers above a set amount need a second approver' },
      { id: 'transaction-alerts', text: 'Transaction alerts are switched on for every business account' },
    ],
  },
  {
    group: 'Devices and data',
    items: [
      { id: 'updates', text: 'Operating systems and business apps are set to update automatically' },
      { id: 'antivirus', text: 'Reputable antivirus with real-time protection is running on business computers' },
      { id: 'screen-lock', text: 'Phones and laptops lock with a PIN or biometrics, and SIM PINs are set' },
      { id: 'backup-321', text: 'Important data follows the 3-2-1 rule, with one copy kept offline' },
      { id: 'restore-tested', text: 'A restore from backup has been tested in the last three months' },
    ],
  },
  {
    group: 'People and response',
    items: [
      { id: 'staff-briefed', text: 'Staff know never to share an OTP and never to pay on a message alone' },
      { id: 'incident-contacts', text: 'Bank fraud line and ngCERT contacts are written down somewhere findable' },
    ],
  },
];

export const CHECKLIST_TOTAL = CHECKLIST.reduce((sum, group) => sum + group.items.length, 0);
