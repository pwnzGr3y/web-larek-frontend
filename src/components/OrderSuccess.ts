import { formatPrice } from '@/shared/utils';

export default class OrderSuccess {
	private container: HTMLElement;
	private total: number;
	onClose?: () => void;

	constructor(total: number) {
		this.total = total;
		
		const template = document.querySelector<HTMLTemplateElement>('#success');
		if (!template) {
			throw new Error('OrderSuccess template not found');
		}
		
		const firstChild = template.content.firstElementChild;
		if (!firstChild) {
			throw new Error('OrderSuccess template content is empty');
		}
		
		this.container = firstChild.cloneNode(true) as HTMLElement;

		const descriptionElement = this.container.querySelector('.order-success__description');
		if (descriptionElement) {
			descriptionElement.textContent = `Списано ${formatPrice(total)}`;
		}

		this.container.querySelector('.order-success__close')?.addEventListener('click', () => {
			this.onClose?.();
		});
	}

	getElement(): HTMLElement {
		return this.container;
	}
}
