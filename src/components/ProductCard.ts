import type { Product } from '@/shared/types';
import { CDN_URL } from '@/shared/utils';

export default class ProductCard {
	private element: HTMLElement;

	constructor(template: HTMLTemplateElement, product: Product, onSelect: (p: Product) => void) {
		this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

		this.element.querySelector('.card__title')!.textContent = product.title;
		this.element.querySelector('.card__price')!.textContent = product.price ? `${product.price} синапсов`: 'Бесценно';

		const img = this.element.querySelector<HTMLImageElement>('.card__image')!;
		img.src = `${CDN_URL}/${product.image}`;
		img.alt = product.title;

		// клик по карточке = выбор продукта
		this.element.addEventListener('click', () => onSelect(product));
	}

	getElement() {
		return this.element;
	}
}