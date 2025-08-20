export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function validateRequired(value: string): boolean {
  return value.trim().length > 0;
}

export function validateMinLength(value: string, minLength: number): boolean {
  return value.trim().length >= minLength;
}

export function validateAddress(address: string): boolean {
  return validateMinLength(address, 10);
}

export function getFieldError(fieldName: string, value: string): string {
  switch (fieldName) {
    case 'email':
      if (!validateRequired(value)) return 'Email обязателен';
      if (!validateEmail(value)) return 'Введите корректный Email';
      break;
    case 'phone':
      if (!validateRequired(value)) return 'Телефон обязателен';
      if (value.replace(/\D/g, '').length < 11) return 'Введите полный номер телефона';
      break;
    case 'address':
      if (!validateRequired(value)) return 'Адрес обязателен';
      if (!validateAddress(value)) return 'Адрес должен содержать минимум 10 символов';
      break;
  }
  return '';
}
