import type { ContactsFormData } from '@/shared/types';
import { applyPhoneMask, formatPhoneForSubmission } from '@/shared/utils';
import { getFieldError } from '@/shared/utils';

export default class ContactsForm {
	private readonly element: HTMLElement;
	private emailError = '';
	private phoneError = '';

	constructor(onSubmit: (data: ContactsFormData) => void) {
		const template = document.querySelector<HTMLTemplateElement>('#contacts');
		if (!template) {
			throw new Error('Contacts template not found');
		}
		
		const firstChild = template.content.firstElementChild;
		if (!firstChild) {
			throw new Error('Contacts template content is empty');
		}
		this.element = firstChild.cloneNode(true) as HTMLElement;

		const emailInput = this.element.querySelector<HTMLInputElement>('[name="email"]');
		if (!emailInput) {
			throw new Error('Email input not found');
		}
		
		const phoneInput = this.element.querySelector<HTMLInputElement>('[name="phone"]');
		if (!phoneInput) {
			throw new Error('Phone input not found');
		}
		
		const submitBtn = this.element.querySelector<HTMLButtonElement>('button[type="submit"]');
		if (!submitBtn) {
			throw new Error('Submit button not found');
		}
		
		const errors = this.element.querySelector<HTMLElement>('.form__errors');
		if (!errors) {
			throw new Error('Errors element not found');
		}

		// Применяем маску к телефону
		phoneInput.addEventListener('input', (e) => {
			applyPhoneMask(e.target as HTMLInputElement);
			this.validateForm();
		});

		// Валидация email
		emailInput.addEventListener('input', () => {
			this.emailError = getFieldError('email', emailInput.value);
			this.validateForm();
		});

		// Валидация при потере фокуса
		emailInput.addEventListener('blur', () => {
			this.emailError = getFieldError('email', emailInput.value);
			this.validateForm();
		});

		phoneInput.addEventListener('blur', () => {
			this.phoneError = getFieldError('phone', phoneInput.value);
			this.validateForm();
		});

		this.element.addEventListener('submit', (e) => {
			e.preventDefault();
			if (submitBtn.disabled) return;

			onSubmit({ 
				email: emailInput.value.trim(), 
				phone: formatPhoneForSubmission(phoneInput.value) 
			});
		});
		
		// Инициализируем валидацию при создании формы
		this.validateForm();
	}

	private validateForm(): void {
		const submitBtn = this.element.querySelector<HTMLButtonElement>('button[type="submit"]');
		const errors = this.element.querySelector<HTMLElement>('.form__errors');
		const emailInput = this.element.querySelector<HTMLInputElement>('[name="email"]');
		const phoneInput = this.element.querySelector<HTMLInputElement>('[name="phone"]');
		
		if (!submitBtn || !errors || !emailInput || !phoneInput) return;

		// Проверяем, что все поля заполнены
		const isEmailFilled = emailInput.value.trim().length > 0;
		const isPhoneFilled = phoneInput.value.trim().length > 0;
		const allErrors = [this.emailError, this.phoneError].filter(error => error);
		
		if (allErrors.length > 0) {
			errors.textContent = allErrors[0];
		} else {
			errors.textContent = '';
		}

		// Кнопка активна только если все поля заполнены и нет ошибок
		submitBtn.disabled = !isEmailFilled || !isPhoneFilled || allErrors.length > 0;
	}

	getElement(): HTMLElement {
		return this.element;
	}
}