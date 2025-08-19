import type { Product } from '@/shared/types';
import ProductCard from './ProductCard';

export default class Gallery {
	private container: HTMLElement;
	onSelectProduct?: (product: Product) => void;

	constructor(container: HTMLElement) {
		this.container = container;
	}

	render(products: Product[]) {
		this.container.innerHTML = '';
		const template = document.querySelector<HTMLTemplateElement>('#card-catalog')!;

		products.forEach(product => {
			const card = new ProductCard(template, product, () => {
				this.onSelectProduct?.(product);
			});
			this.container.append(card.getElement());
		});
	}
}
