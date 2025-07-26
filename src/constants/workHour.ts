const workHour = [
  { label: '9AM - 5PM', value: '9AM - 5PM' },
  { label: '10AM - 6PM', value: '10AM - 6PM' },
  { label: 'Flexible', value: 'flexible' },
  { label: 'Part-Time', value: 'part-time' },
  { label: 'Full-Time', value: 'full-time' },
];

export const workHourOptions = workHour.map((item) => ({
  label: item.label,
  value: item.value,
}));
