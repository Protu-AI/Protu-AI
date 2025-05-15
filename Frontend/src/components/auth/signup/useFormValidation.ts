import { useState } from 'react';

interface ValidationErrors {
  [key: string]: string;
}

export function useFormValidation() {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = (field: string, value: string, compareValue?: string) => {
    let error = '';

    switch (field) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) {
          error = 'This field is required';
        }
        break;

      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;

      case 'phone':
        if (!value.trim()) {
          error = 'Phone number is required';
        } else if (!/^\+?[\d\s-]{10,}$/.test(value)) {
          error = 'Please enter a valid phone number';
        }
        break;

      case 'gender':
        if (!value) {
          error = 'Please select a gender';
        }
        break;

      case 'username':
        if (!value.trim()) {
          error = 'Username is required';
        } else if (value.length < 3) {
          error = 'Username must be at least 3 characters';
        }
        break;

      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 8) {
          error = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          error = 'Password must contain uppercase, lowercase and numbers';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password';
        } else if (value !== compareValue) {
          error = 'Passwords do not match';
        }
        break;

      case 'verificationCode':
        if (!value || value.length !== 6) {
          error = 'Please enter the complete verification code';
        } else if (!/^\d{6}$/.test(value)) {
          error = 'Verification code must contain only numbers';
        }
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const validateStep = (step: number, data: any) => {
    switch (step) {
      case 1:
        return ['firstName', 'lastName', 'email', 'phone', 'gender']
          .every(field => validateField(field, data[field]));

      case 2:
        return validateField('verificationCode', data.verificationCode);

      case 3:
        return ['username', 'password']
          .every(field => validateField(field, data[field])) &&
          validateField('confirmPassword', data.confirmPassword, data.password);

      default:
        return false;
    }
  };

  return { errors, validateField, validateStep };
}
