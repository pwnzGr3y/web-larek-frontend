import type { OrderVariables } from '@/shared/types';

export default class ContactsForm {
	private element: HTMLElement;

	constructor(onSubmit: (data: Pick<OrderVariables, 'email' | 'phone'>) => void) {
		const template = document.querySelector<HTMLTemplateElement>('#contacts')!;
		this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

		const emailInput = this.element.querySelector<HTMLInputElement>('[name="email"]')!;
		const phoneInput = this.element.querySelector<HTMLInputElement>('[name="phone"]')!;
		const submitBtn = this.element.querySelector<HTMLButtonElement>('button[type="submit"]')!;
		const errors = this.element.querySelector<HTMLElement>('.form__errors')!;

		const validate = () => {
			const emailValid = /\S+@\S+\.\S+/.test(emailInput.value);
			const phoneValid = /^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/.test(phoneInput.value);

			if (!emailValid) {
				errors.textContent = 'Введите корректный Email';
			} else if (!phoneValid) {
				errors.textContent = 'Введите корректный телефон';
			} else {
				errors.textContent = '';
			}

			submitBtn.disabled = !(emailValid && phoneValid);
		};

		emailInput.addEventListener('input', validate);
		phoneInput.addEventListener('input', validate);

		this.element.addEventListener('submit', (e) => {
			e.preventDefault();
			if (submitBtn.disabled) return;

			onSubmit({ email: emailInput.value, phone: phoneInput.value });
		});
	}

	getElement() {
		return this.element;
	}
}