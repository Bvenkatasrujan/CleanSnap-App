export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  if (!password || password.length < 6)
    return 'Password must be at least 6 characters';
  return null;
};

export const validatePhone = (phone) => {
  const re = /^[6-9]\d{9}$/;
  return re.test(phone);
};

export const validateReportForm = (form) => {
  if (!form.name || form.name.trim().length < 2)
    return 'Please enter a valid full name';
  if (!form.age || isNaN(form.age) || parseInt(form.age) < 1 || parseInt(form.age) > 120)
    return 'Please enter a valid age between 1 and 120';
  if (!form.gender)
    return 'Please select a gender';
  if (!form.phone || !validatePhone(form.phone))
    return 'Please enter a valid 10-digit Indian phone number';
  if (!form.house_no || form.house_no.trim().length < 1)
    return 'Please enter a valid house/door number';
  if (!form.ward_no || form.ward_no.trim().length < 1)
    return 'Please enter a valid ward number';
  if (!form.description || form.description.trim().length < 10)
    return 'Description must be at least 10 characters';
  return null;
};