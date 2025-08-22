import type { Product } from '@/shared/types';
import { formatPrice } from '@/shared/utils';

export default class BasketItem {
	private element: HTMLElement;
	private product: Product;
	private onDelete: (productId: string) => void;

	constructor(product: Product, onDelete: (productId: string) => void) {
		this.product = product;
		this.onDelete = onDelete;
		this.element = this.createElement();
	}

	private createElement(): HTMLElement {
		const template = document.querySelector<HTMLTemplateElement>('#card-basket');
		if (!template) {
			throw new Error('Card basket template not found');
		}

		const li = template.content.firstElementChild?.cloneNode(true) as HTMLElement;
		if (!li) {
			throw new Error('Card basket template content is empty');
		}

		this.setupElement(li);
		return li;
	}

	private setupElement(element: HTMLElement): void {
		const titleElement = element.querySelector('.card__title');
		const priceElement = element.querySelector('.card__price');
		const deleteButton = element.querySelector('.basket__item-delete');

		if (titleElement) titleElement.textContent = this.product.title;
		if (priceElement) priceElement.textContent = formatPrice(this.product.price);
		
		if (deleteButton) {
			deleteButton.addEventListener('click', () => this.onDelete(this.product.id));
		}
	}

	setIndex(index: number): void {
		const indexElement = this.element.querySelector('.basket__item-index');
		if (indexElement) {
			indexElement.textContent = String(index + 1);
		}
	}

	getElement(): HTMLElement {
		return this.element;
	}

	getProduct(): Product {
		return this.product;
	}
}
