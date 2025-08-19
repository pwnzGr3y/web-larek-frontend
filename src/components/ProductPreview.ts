import type { Product } from '@/shared/types';
import { CDN_URL } from '@/shared/utils';

export default class ProductPreview {
	private element: HTMLElement;

	constructor(product: Product, onAdd: (p: Product) => void) {
		const template = document.querySelector<HTMLTemplateElement>('#card-preview')!;
		this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

		this.element.querySelector('.card__title')!.textContent = product.title;
		this.element.querySelector('.card__price')!.textContent = `${product.price} синапсов`;
		this.element.querySelector('.card__category')!.textContent = product.category;

		const img = this.element.querySelector<HTMLImageElement>('.card__image')!;
		img.src = `${CDN_URL}/${product.image}`;
		img.alt = product.title;

		this.element.querySelector('.card__button')?.addEventListener('click', () => {
			onAdd(product);
		});
	}

	getElement() {
		return this.element;
	}
}
