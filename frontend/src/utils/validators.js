export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateFullName = (name) => {
  return name && name.trim().length >= 2;
};

export const validatePhoneNumber = (phone) => {
  const re = /^[0-9]{10,11}$/;
  return re.test(phone.replace(/\D/g, ''));
};
