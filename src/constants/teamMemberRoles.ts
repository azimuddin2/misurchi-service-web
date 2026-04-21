const teamMemberRoles = [
  { label: 'Supervisor', value: 'supervisor' },
  { label: 'Manager', value: 'manager' },
  { label: 'Team Member', value: 'team_member' },
];

export const roleOptions = teamMemberRoles.map((item) => ({
  label: item.label,
  value: item.value,
}));
