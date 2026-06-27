/**
 * Auth validation schemas
 */

const registerSchema = {
  name: {
    required: true,
    label: 'Name',
    minLength: 2,
    maxLength: 50,
  },
  email: {
    required: true,
    label: 'Email',
    type: 'email',
  },
  password: {
    required: true,
    label: 'Password',
    minLength: 6,
    maxLength: 128,
  },
};

const loginSchema = {
  email: {
    required: true,
    label: 'Email',
    type: 'email',
  },
  password: {
    required: true,
    label: 'Password',
  },
};

const updateProfileSchema = {
  name: {
    required: true,
    label: 'Name',
    minLength: 2,
    maxLength: 50,
  },
  email: {
    required: true,
    label: 'Email',
    type: 'email',
  },
};

const changePasswordSchema = {
  currentPassword: {
    required: true,
    label: 'Current password',
  },
  newPassword: {
    required: true,
    label: 'New password',
    minLength: 6,
    maxLength: 128,
  },
};

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
};
