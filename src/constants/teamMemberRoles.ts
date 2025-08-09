const teamMemberRoles = [
  { label: 'Supervisor', value: 'Supervisor' },
  { label: 'Manager', value: 'Manager' },
  { label: 'Team Member', value: 'Team Member' },
];

export const roleOptions = teamMemberRoles.map((item) => ({
  label: item.label,
  value: item.value,
}));
