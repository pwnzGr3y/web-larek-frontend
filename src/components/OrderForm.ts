export default class OrderForm {
	private element: HTMLElement;
	private selectedPayment: string | null = null;

	constructor(onSubmit: (data: any) => void) {
		const template = document.querySelector<HTMLTemplateElement>('#order')!;
		this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

		const buttons = this.element.querySelectorAll<HTMLButtonElement>('.order__buttons .button');
		const addressInput = this.element.querySelector<HTMLInputElement>('[name="address"]')!;
		const submitBtn = this.element.querySelector<HTMLButtonElement>('.order__button')!;

		buttons.forEach(btn => {
			btn.addEventListener('click', () => {
				buttons.forEach(b => b.classList.remove('active'));
				btn.classList.add('active');
				this.selectedPayment = btn.name; // card | cash
				this.updateSubmit(submitBtn, addressInput);
			});
		});

		addressInput.addEventListener('input', () => {
			this.updateSubmit(submitBtn, addressInput);
		});

		this.element.addEventListener('submit', (e) => {
			e.preventDefault();
			if (!this.selectedPayment) return;
			onSubmit({ payment: this.selectedPayment, address: addressInput.value });
		});
	}

	private updateSubmit(btn: HTMLButtonElement, input: HTMLInputElement) {
		btn.disabled = !this.selectedPayment || !input.value.trim();
	}

	getElement() {
		return this.element;
	}
}
