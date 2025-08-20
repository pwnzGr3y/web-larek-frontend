export function applyPhoneMask(input: HTMLInputElement): void {
  const cursorPosition = input.selectionStart || 0;
  let value = input.value.replace(/\D/g, '');
  
  // Ограничиваем длину до 11 цифр
  if (value.length > 11) {
    value = value.substring(0, 11);
  }
  
  let formattedValue = '';
  
  if (value.length > 0) {
    // Если первая цифра 7 или 8, добавляем +7
    if (value[0] === '7' || value[0] === '8') {
      formattedValue = '+7 ';
      value = value.substring(1);
    } else if (value[0] === '9') {
      formattedValue = '+7 ';
    } else {
      formattedValue = '+7 ';
    }
    
    if (value.length > 0) {
      formattedValue += '(';
      formattedValue += value.substring(0, Math.min(3, value.length));
      
      if (value.length > 3) {
        formattedValue += ') ';
        formattedValue += value.substring(3, Math.min(6, value.length));
        
        if (value.length > 6) {
          formattedValue += '-';
          formattedValue += value.substring(6, Math.min(8, value.length));
          
          if (value.length > 8) {
            formattedValue += '-';
            formattedValue += value.substring(8, Math.min(10, value.length));
          }
        }
      }
    }
  }
  
  // Сохраняем старую длину для расчета новой позиции курсора
  const oldLength = input.value.length;
  input.value = formattedValue;
  
  // Умное позиционирование курсора
  let newCursorPosition = cursorPosition;
  
  // Если добавляем символы в начале (например, +7)
  if (formattedValue.length > oldLength) {
    newCursorPosition += (formattedValue.length - oldLength);
  }
  // Если удаляем символы
  else if (formattedValue.length < oldLength) {
    newCursorPosition = Math.max(0, newCursorPosition - (oldLength - formattedValue.length));
  }
  
  // Ограничиваем позицию курсора длиной строки
  newCursorPosition = Math.min(newCursorPosition, formattedValue.length);
  
  // Устанавливаем курсор
  input.setSelectionRange(newCursorPosition, newCursorPosition);
}

export function formatPhoneForSubmission(phone: string): string {
  return phone.replace(/\D/g, '');
}
