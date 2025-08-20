import type { Product } from '@/shared/types';
import type ProductClient from '@/app/api/ProductClient';
import { formatPrice } from '@/shared/utils';

export default class Basket {
	private items: Product[] = [];
	private readonly container: HTMLElement;
	private counter: HTMLElement;
	private readonly STORAGE_KEY = 'basket-items';
	private validationCache: Map<string, boolean> = new Map();
	onCheckout?: () => void;

	constructor() {
		const template = document.querySelector<HTMLTemplateElement>('#basket');
		if (!template) {
			throw new Error('Basket template not found');
		}
		
		const firstChild = template.content.firstElementChild;
		if (!firstChild) {
			throw new Error('Basket template content is empty');
		}
		
		this.container = firstChild.cloneNode(true) as HTMLElement;

		const counter = document.querySelector('.header__basket-counter') as HTMLElement;
		if (!counter) {
			throw new Error('Basket counter not found');
		}
		this.counter = counter;

		this.container.querySelector('.basket__button')?.addEventListener('click', () => {
			if (this.canCheckout()) {
				this.onCheckout?.();
			}
		});

		this.loadFromStorage();
	}

	private loadFromStorage(): void {
		try {
			const stored = localStorage.getItem(this.STORAGE_KEY);
			if (stored) {
				this.items = JSON.parse(stored);
			}
			this.render();
		} catch (error) {
			console.warn('Failed to load basket from localStorage:', error);
			this.render();
		}
	}

	private saveToStorage(): void {
		try {
			localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items));
		} catch (error) {
			console.warn('Failed to save basket to localStorage:', error);
		}
	}

	add(product: Product): void {
		this.items.push(product);
		this.validationCache.delete(product.id);
		this.saveToStorage();
		this.render();
	}

	remove(productId: string): void {
		const index = this.items.findIndex(p => p.id === productId);
		if (index !== -1) {
			this.items.splice(index, 1);
			this.validationCache.delete(productId);
			this.saveToStorage();
			this.render();
		}
	}

	clear(): void {
		this.items = [];
		this.saveToStorage();
		this.render();
	}

	getTotal(): number {
		return this.items.reduce((acc, p) => acc + (p.price || 0), 0);
	}

	getTotalWithPrice(): number {
		return this.getItemsWithPrice().reduce((acc, p) => acc + (p.price || 0), 0);
	}

	getIds(): string[] {
		return this.items.map(p => p.id);
	}

	getItems(): Product[] {
		return [...this.items];
	}

	getItemsWithPrice(): Product[] {
		return this.items.filter(p => p.price && p.price > 0);
	}

	canCheckout(): boolean {
		return this.getItemsWithPrice().length > 0;
	}

	async validateItems(productClient: ProductClient): Promise<void> {
		const validItems: Product[] = [];
		let hasRemovedItems = false;

		for (const item of this.items) {
			if (this.validationCache.has(item.id)) {
				if (this.validationCache.get(item.id)) {
					validItems.push(item);
				} else {
					hasRemovedItems = true;
				}
				continue;
			}

			try {
				await productClient.getProductById(item.id);
				validItems.push(item);
				this.validationCache.set(item.id, true); // Кэшируем успешную валидацию
			} catch (error) {
				console.warn(`Товар ${item.title} (${item.id}) больше не доступен, удаляем из корзины`);
				this.validationCache.set(item.id, false); // Кэшируем неуспешную валидацию
				hasRemovedItems = true;
			}
		}

		if (hasRemovedItems) {
			this.items = validItems;
			this.saveToStorage();
			this.render();
			alert('Некоторые товары в корзине больше не доступны и были удалены.');
		}
	}

	render(): void {
		const list = this.container.querySelector('.basket__list');
		if (!list) {
			console.error('Basket list element not found');
			return;
		}
		list.innerHTML = '';

		if (this.items.length === 0) {
			const emptyMessage = document.createElement('li');
			emptyMessage.className = 'basket__empty';
			emptyMessage.textContent = 'Корзина пуста';
			list.append(emptyMessage);
		} else {
			this.items.forEach((item, index) => {
				const template = document.querySelector<HTMLTemplateElement>('#card-basket');
				if (!template) {
					console.error('Card basket template not found');
					return;
				}

				const li = template.content.firstElementChild?.cloneNode(true) as HTMLElement;
				if (!li) {
					console.error('Card basket template content is empty');
					return;
				}

				const indexElement = li.querySelector('.basket__item-index');
				const titleElement = li.querySelector('.card__title');
				const priceElement = li.querySelector('.card__price');
				const deleteButton = li.querySelector('.basket__item-delete');

				if (indexElement) indexElement.textContent = String(index + 1);
				if (titleElement) titleElement.textContent = item.title;
				if (priceElement) priceElement.textContent = formatPrice(item.price);
				
				if (deleteButton) {
					deleteButton.addEventListener('click', () => this.remove(item.id));
				}

				list.append(li);
			});
		}

		const total = this.getTotal();
		const priceElement = this.container.querySelector('.basket__price');
		if (priceElement) {
			priceElement.textContent = `${total.toLocaleString('ru-RU')} синапсов`;
		}
		
		const checkoutButton = this.container.querySelector('.basket__button') as HTMLButtonElement;
		if (checkoutButton) {
			checkoutButton.disabled = !this.canCheckout();
		}
		
		this.counter.textContent = String(this.items.length);
	}

	getElement(): HTMLElement {
		return this.container;
	}
}
