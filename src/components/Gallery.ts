import type { Product } from '@/shared/types';
import { ProductCard } from '@/components/index';

export default class Gallery {
	private container: HTMLElement;
	private productCards: Map<string, ProductCard> = new Map();
	onSelectProduct?: (product: Product) => void | Promise<void>;

	constructor(container: HTMLElement) {
		this.container = container;
	}

	render(products: Product[]): void {
		this.container.innerHTML = '';
		this.productCards.clear();
		
		const template = document.querySelector<HTMLTemplateElement>('#card-catalog');
		if (!template) {
			console.error('Card catalog template not found');
			return;
		}

		products.forEach((product, index) => {
			const card = new ProductCard(template, product, async () => {
				if (this.onSelectProduct) {
					await this.onSelectProduct(product);
				}
			});
			
			const cardElement = card.getElement();
			cardElement.classList.add('gallery__item--hidden');
			this.container.append(cardElement);
			this.productCards.set(product.id, card);
			
			setTimeout(() => {
				cardElement.classList.remove('gallery__item--hidden');
				cardElement.classList.add('gallery__item--visible');
			}, index * 100);
		});
	}

	updateProductInBasket(productId: string, isInBasket: boolean): void {
		const card = this.productCards.get(productId);
		if (card) {
			card.updateBasketState(isInBasket);
		}
	}
}
