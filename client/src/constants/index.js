export const PRIORITIES = [
  { value: 'high', label: 'High', color: 'red' },
  { value: 'medium', label: 'Medium', color: 'yellow' },
  { value: 'low', label: 'Low', color: 'green' }
];

export const CATEGORIES = [
  { value: 'work', label: 'Work', color: 'blue' },
  { value: 'school', label: 'School', color: 'violet' },
  { value: 'health', label: 'Health', color: 'green' },
  { value: 'personal', label: 'Personal', color: 'pink' },
  { value: 'other', label: 'Other', color: 'gray' }
];

export const DEFAULT_FORM_DATA = {
  task: '',
  category: 'work',
  priority: 'medium',
  customDeadline: new Date()
}; 