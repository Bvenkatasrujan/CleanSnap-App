export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
};

export const validateReportForm = ({ name, age, gender, description }) => {
  if (!name || name.trim().length < 2) return 'Full name is required (min 2 chars)';
  if (!age || isNaN(age) || age < 1 || age > 120) return 'Enter a valid age (1–120)';
  if (!gender) return 'Please select a gender';
  if (!description || description.trim().length < 10) return 'Description must be at least 10 characters';
  return null;
};
