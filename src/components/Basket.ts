import type { Product } from '@/shared/types';
import type ProductClient from '@/app/api/ProductClient';
import { formatPrice } from '@/shared/utils';
import BasketItem from './BasketItem';

export default class Basket {
	private items: Product[] = [];
	private readonly container: HTMLElement;
	private readonly listElement: HTMLElement;
	private readonly priceElement: HTMLElement;
	private readonly checkoutButton: HTMLButtonElement;
	private readonly STORAGE_KEY = 'basket-items';
	private validationCache: Map<string, boolean> = new Map();
	onCheckout?: () => void;
	private onUpdateCounter?: () => void;

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
		
		// Находим статичные DOM элементы в конструкторе
		this.listElement = this.container.querySelector('.basket__list') as HTMLElement;
		this.priceElement = this.container.querySelector('.basket__price') as HTMLElement;
		this.checkoutButton = this.container.querySelector('.basket__button') as HTMLButtonElement;
		
		if (!this.listElement) {
			throw new Error('Basket list element not found');
		}
		if (!this.priceElement) {
			throw new Error('Basket price element not found');
		}
		if (!this.checkoutButton) {
			throw new Error('Basket checkout button not found');
		}

		// Вешаем слушатели в конструкторе
		this.checkoutButton.addEventListener('click', () => {
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
			this.triggerCounterUpdate();
		} catch (error) {
			console.warn('Failed to load basket from localStorage:', error);
			this.render();
			this.triggerCounterUpdate();
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
		this.triggerCounterUpdate();
	}

	remove(productId: string): void {
		const index = this.items.findIndex(p => p.id === productId);
		if (index !== -1) {
			this.items.splice(index, 1);
			this.validationCache.delete(productId);
			this.saveToStorage();
			this.render();
			this.triggerCounterUpdate();
		}
	}

	clear(): void {
		this.items = [];
		this.saveToStorage();
		this.render();
		this.triggerCounterUpdate();
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
			this.triggerCounterUpdate();
			alert('Некоторые товары в корзине больше не доступны и были удалены.');
		}
	}

	render(): void {
		this.listElement.innerHTML = '';

		if (this.items.length === 0) {
			const emptyMessage = document.createElement('li');
			emptyMessage.className = 'basket__empty';
			emptyMessage.textContent = 'Корзина пуста';
			this.listElement.append(emptyMessage);
		} else {
			this.items.forEach((item, index) => {
				const basketItem = new BasketItem(item, (productId) => this.remove(productId));
				basketItem.setIndex(index);
				this.listElement.append(basketItem.getElement());
			});
		}

		const total = this.getTotal();
		this.priceElement.textContent = `${total.toLocaleString('ru-RU')} синапсов`;
		this.checkoutButton.disabled = !this.canCheckout();
	}

	getElement(): HTMLElement {
		return this.container;
	}

	setUpdateCounterCallback(callback: () => void): void {
		this.onUpdateCounter = callback;
	}

	updateCounter(counterElement: HTMLElement | null): void {
		if (counterElement) {
			counterElement.textContent = String(this.items.length);
		}
	}

	private triggerCounterUpdate(): void {
		if (this.onUpdateCounter) {
			this.onUpdateCounter();
		}
	}
}
