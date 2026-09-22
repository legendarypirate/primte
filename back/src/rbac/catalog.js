const PERMISSIONS = [
  { key: 'dashboard.view', group: 'Dashboard', label: 'View dashboard' },
  { key: 'members.view', group: 'Members', label: 'View members' },
  { key: 'members.create', group: 'Members', label: 'Create members' },
  { key: 'members.update', group: 'Members', label: 'Update members' },
  { key: 'members.delete', group: 'Members', label: 'Delete members' },
  { key: 'members.topup', group: 'Members', label: 'Wallet top-up' },
  { key: 'products.view', group: 'Store', label: 'View products' },
  { key: 'products.manage', group: 'Store', label: 'Manage products' },
  { key: 'competitions.view', group: 'Events', label: 'View competitions' },
  { key: 'competitions.manage', group: 'Events', label: 'Manage competitions' },
  { key: 'trainings.view', group: 'Events', label: 'View trainings' },
  { key: 'trainings.manage', group: 'Events', label: 'Manage trainings' },
  { key: 'orders.view', group: 'Commerce', label: 'View orders' },
  { key: 'orders.manage', group: 'Commerce', label: 'Update orders' },
  { key: 'transactions.view', group: 'Commerce', label: 'View transactions' },
  { key: 'notices.view', group: 'Club', label: 'View notices' },
  { key: 'notices.manage', group: 'Club', label: 'Manage notices' },
  { key: 'attendance.view', group: 'Club', label: 'View attendance' },
  { key: 'attendance.scan', group: 'Club', label: 'Scan QR / check-in' },
  { key: 'settings.manage', group: 'System', label: 'Club settings' },
  { key: 'roles.manage', group: 'System', label: 'Manage roles & permissions' },
  { key: 'member_types.manage', group: 'System', label: 'Manage member types' },
  { key: 'activities.manage', group: 'System', label: 'Manage development activities' },
  { key: 'match_types.manage', group: 'System', label: 'Manage match types' },
  { key: 'divisions.manage', group: 'System', label: 'Manage divisions' },
  { key: 'staff.manage', group: 'System', label: 'Manage admin users' },
];

const ALL_KEYS = PERMISSIONS.map((p) => p.key);

const ROLE_PRESETS = {
  'head-admin': ALL_KEYS,
  'senior-admin': ALL_KEYS.filter((k) => k !== 'roles.manage'),
  admin: [
    'dashboard.view',
    'members.view',
    'members.create',
    'members.update',
    'members.topup',
    'products.view',
    'products.manage',
    'competitions.view',
    'competitions.manage',
    'trainings.view',
    'trainings.manage',
    'orders.view',
    'orders.manage',
    'transactions.view',
    'notices.view',
    'notices.manage',
    'attendance.view',
    'attendance.scan',
  ],
  'assistant-admin': [
    'dashboard.view',
    'members.view',
    'products.view',
    'competitions.view',
    'trainings.view',
    'orders.view',
    'transactions.view',
    'notices.view',
    'notices.manage',
    'attendance.view',
    'attendance.scan',
  ],
};

function groupedPermissions() {
  const groups = {};
  for (const item of PERMISSIONS) {
    groups[item.group] = groups[item.group] || [];
    groups[item.group].push(item);
  }
  return groups;
}

module.exports = { PERMISSIONS, ALL_KEYS, ROLE_PRESETS, groupedPermissions };
