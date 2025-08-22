import type { OrderFormData, PaymentType } from '@/shared/types';
import { getFieldError } from '@/shared/utils';

export default class OrderForm {
	private readonly element: HTMLElement;
	private selectedPayment: PaymentType | null = null;
	private addressError = '';

	constructor(onSubmit: (data: OrderFormData) => void) {
		const template = document.querySelector<HTMLTemplateElement>('#order');
		if (!template) {
			throw new Error('Order template not found');
		}
		
		const firstChild = template.content.firstElementChild;
		if (!firstChild) {
			throw new Error('Order template content is empty');
		}
		this.element = firstChild.cloneNode(true) as HTMLElement;

		const buttons = this.element.querySelectorAll<HTMLButtonElement>('.order__buttons .button');
		const addressInput = this.element.querySelector<HTMLInputElement>('[name="address"]');
		if (!addressInput) {
			throw new Error('Address input not found');
		}
		
		const submitBtn = this.element.querySelector<HTMLButtonElement>('.order__button');
		if (!submitBtn) {
			throw new Error('Submit button not found');
		}

		const errors = this.element.querySelector<HTMLElement>('.form__errors');
		if (!errors) {
			throw new Error('Errors element not found');
		}

		buttons.forEach(btn => {
			btn.addEventListener('click', () => {
				buttons.forEach(b => b.classList.remove('active'));
				btn.classList.add('active');
				this.selectedPayment = btn.name === 'card' ? 'online' : 'offline';
				this.validateForm();
			});
		});

		addressInput.addEventListener('input', () => {
			this.addressError = getFieldError('address', addressInput.value);
			this.validateForm();
		});

		addressInput.addEventListener('blur', () => {
			this.addressError = getFieldError('address', addressInput.value);
			this.validateForm();
		});

		this.element.addEventListener('submit', (e) => {
			e.preventDefault();
			if (!this.selectedPayment) {
				return;
			}
			onSubmit({ payment: this.selectedPayment, address: addressInput.value.trim() });
		});
		
		// Инициализируем валидацию при создании формы
		this.validateForm();
	}

	private validateForm(): void {
		const submitBtn = this.element.querySelector<HTMLButtonElement>('.order__button');
		const errors = this.element.querySelector<HTMLElement>('.form__errors');
		const addressInput = this.element.querySelector<HTMLInputElement>('[name="address"]');
		
		if (!submitBtn || !errors || !addressInput) return;

		// Проверяем, что все поля заполнены
		const isAddressFilled = addressInput.value.trim().length > 0;
		const allErrors = [this.addressError].filter(error => error);
		
		if (allErrors.length > 0) {
			errors.textContent = allErrors[0];
		} else {
			errors.textContent = '';
		}

		// Кнопка активна только если выбран способ оплаты, адрес заполнен и нет ошибок
		submitBtn.disabled = !this.selectedPayment || !isAddressFilled || allErrors.length > 0;
	}

	getElement(): HTMLElement {
		return this.element;
	}
}
