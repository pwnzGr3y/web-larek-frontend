import type { Product } from '@/shared/types';
import { CDN_URL, changeImageExtensionToPng, formatPrice, buildImageUrl } from '@/shared/utils';

export default class ProductCard {
	private readonly element: HTMLElement;

	constructor(
		template: HTMLTemplateElement, 
		product: Product, 
		onSelect: (p: Product) => void
	) {
		const firstChild = template.content.firstElementChild;
		if (!firstChild) {
			throw new Error('Product card template content is empty');
		}
		this.element = firstChild.cloneNode(true) as HTMLElement;

		const titleElement = this.element.querySelector('.card__title');
		if (!titleElement) {
			throw new Error('Title element not found');
		}
		titleElement.textContent = product.title;
		
		const priceElement = this.element.querySelector('.card__price');
		if (!priceElement) {
			throw new Error('Price element not found');
		}
		const formattedPrice = formatPrice(product.price);
		priceElement.textContent = formattedPrice;
		
		if (formattedPrice === 'Бесценно') {
			priceElement.classList.add('card__price_priceless');
		}

		const categoryElement = this.element.querySelector('.card__category');
		if (!categoryElement) {
			throw new Error('Category element not found');
		}
		categoryElement.textContent = product.category;
		
		const categoryClass = this.getCategoryClass(product.category);
		categoryElement.className = `card__category ${categoryClass}`;

		const img = this.element.querySelector<HTMLImageElement>('.card__image');
		if (!img) {
			throw new Error('Image element not found');
		}
		const imageUrl = buildImageUrl(CDN_URL, product.image);
		img.src = changeImageExtensionToPng(imageUrl);
		img.alt = product.title;

		this.element.addEventListener('click', (event) => {
			event.preventDefault();
			event.stopPropagation();
			onSelect(product);
		});
		
		this.element.style.cursor = 'pointer';
	}

	private getCategoryClass(category: string): string {
		const categoryMap: Record<string, string> = {
			'софт-скил': 'card__category_soft',
			'хард-скил': 'card__category_hard',
			'другое': 'card__category_other',
			'дополнительное': 'card__category_additional',
			'кнопка': 'card__category_button'
		};
		
		return categoryMap[category] || 'card__category_other';
	}

	getElement(): HTMLElement {
		return this.element;
	}
}