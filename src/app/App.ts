import {
	Basket,
	ContactsForm,
	Gallery,
	ModalManager,
	OrderForm,
	OrderSuccess,
	Page,
	ProductPreview
} from '@/components';
import type { OrderFormData, ContactsFormData } from '@/shared/types';
import { API_URL } from '@/shared/utils';
import { OrderClient, ProductClient } from '@/app/api';

export default class App {
	private productClient = new ProductClient(API_URL);
	private orderClient = new OrderClient(API_URL);

	private page: Page;
	private gallery: Gallery;
	private basket: Basket;
	private modals: ModalManager;
	private orderForm: OrderForm;
	private contactsForm: ContactsForm;
	private orderSuccess: OrderSuccess;

	constructor() {
		this.page = new Page();
		
		const galleryContainer = this.page.getGalleryContainer();
		if (!galleryContainer) {
			throw new Error('Gallery element not found');
		}
		
		this.gallery = new Gallery(galleryContainer);
		this.basket = new Basket();
		this.basket.setUpdateCounterCallback((count: number) => {
			this.page.updateBasketCounter(count);
		});
		this.modals = new ModalManager();
		
		// Создаем экземпляры форм один раз при загрузке страницы
		let currentOrderData: OrderFormData | null = null;
		
		this.orderForm = new OrderForm((orderData: OrderFormData) => {
			currentOrderData = orderData;
			this.modals.open(this.contactsForm.getElement());
		});
		
		this.contactsForm = new ContactsForm(async (contactsData: ContactsFormData) => {
			if (currentOrderData) {
				await this.handleOrderSubmit(currentOrderData, contactsData);
			}
		});
		
		this.orderSuccess = new OrderSuccess(0);
		this.orderSuccess.onClose = () => {
			this.modals.close();
		};

		this.init();
	}

	async init(): Promise<void> {
		try {
			await this.initializeApplication();
		} catch (error) {
			console.error('Ошибка при инициализации приложения:', error);
		}
	}

	private async initializeApplication(): Promise<void> {
		await this.loadProducts();
		this.setupEventHandlers();
		this.setupBasketHandlers();
	}

	private async loadProducts(): Promise<void> {
		const productList = await this.productClient.getProductList();
		this.gallery.render(productList.items);
	}

	private setupEventHandlers(): void {
		this.setupGalleryHandlers();
		this.setupBasketButtonHandler();
	}

	private setupGalleryHandlers(): void {
		this.gallery.onSelectProduct = async (product) => {
			await this.handleProductSelection(product);
		};
	}

	private setupBasketButtonHandler(): void {
		this.page.setBasketButtonClickHandler(() => {
			this.modals.open(this.basket.getElement());
		});
	}

	private async handleProductSelection(product: any): Promise<void> {
		try {
			const freshProduct = await this.getFreshProductData(product.id);
			await this.showProductPreview(freshProduct);
		} catch (error) {
			console.error('Ошибка при получении информации о товаре:', error);
			await this.showProductPreview(product);
		}
	}

	private async getFreshProductData(productId: string): Promise<any> {
		return await this.productClient.getProductById(productId);
	}

	private async showProductPreview(product: any): Promise<void> {
		const isInBasket = this.checkProductInBasket(product.id);
		const preview = this.createProductPreview(product, isInBasket);
		this.modals.open(preview.getElement());
	}

	private checkProductInBasket(productId: string): boolean {
		return this.basket.getIds().includes(productId);
	}

	private createProductPreview(product: any, isInBasket: boolean): ProductPreview {
		const handlers = this.createProductHandlers();
		return new ProductPreview(
			product, 
			handlers.onAdd,
			handlers.onRemove,
			isInBasket
		);
	}

	private createProductHandlers() {
		return {
			onAdd: (product: any) => {
				this.basket.add(product);
				this.modals.close();
				this.updateProductInGallery(product.id, true);
			},
			onRemove: (product: any) => {
				this.basket.remove(product.id);
				this.modals.close();
				this.updateProductInGallery(product.id, false);
			}
		};
	}

	private updateProductInGallery(productId: string, isInBasket: boolean): void {
		this.gallery.updateProductInBasket(productId, isInBasket);
	}

	private setupBasketHandlers(): void {
		this.basket.onCheckout = () => {
			this.modals.open(this.orderForm.getElement());
		};
	}

	private async handleOrderSubmit(orderData: OrderFormData, contactsData: ContactsFormData): Promise<void> {
		try {
			await this.processOrderSubmission(orderData, contactsData);
		} catch (error) {
			console.error('Ошибка при создании заказа:', error);
			alert('Ошибка при оформлении заказа. Попробуйте еще раз.');
		}
	}

	private async processOrderSubmission(orderData: OrderFormData, contactsData: ContactsFormData): Promise<void> {
		await this.validateBasketItems();
		
		const validItems = this.getValidItemsWithPrice();
		if (this.isBasketEmpty(validItems)) {
			this.showEmptyBasketMessage();
			return;
		}
		
		const order = await this.createOrder(orderData, contactsData, validItems);
		console.log('Заказ успешно создан', order);
		
		await this.handleOrderSuccess(order);
	}

	private isBasketEmpty(validItems: string[]): boolean {
		return validItems.length === 0;
	}

	private showEmptyBasketMessage(): void {
		alert('В корзине не осталось товаров с ценой. Заказ не может быть оформлен.');
		this.modals.close();
	}

	private async validateBasketItems(): Promise<void> {
		const basketItems = this.basket.getItems();
		const validItems = await this.validateItemsAvailability(basketItems);
		
		if (this.isBasketEmpty(validItems)) {
			this.showEmptyBasketAfterValidationMessage();
			throw new Error('No valid items in basket');
		}
	}

	private async validateItemsAvailability(basketItems: any[]): Promise<string[]> {
		const validItems: string[] = [];
		
		for (const item of basketItems) {
			try {
				await this.productClient.getProductById(item.id);
				validItems.push(item.id);
			} catch (error) {
				this.handleUnavailableItem(item);
			}
		}
		
		return validItems;
	}

	private handleUnavailableItem(item: any): void {
		console.warn(`Товар ${item.title} (${item.id}) больше не доступен, удаляем из корзины`);
		this.basket.remove(item.id);
	}

	private showEmptyBasketAfterValidationMessage(): void {
		alert('В корзине не осталось доступных товаров. Корзина очищена.');
		this.modals.close();
	}

	private getValidItemsWithPrice(): string[] {
		const itemsWithPrice = this.basket.getItemsWithPrice();
		const validItems = this.basket.getItems().map(item => item.id);
		
		return itemsWithPrice
			.filter(item => validItems.includes(item.id))
			.map(item => item.id);
	}

	private async createOrder(orderData: OrderFormData, contactsData: ContactsFormData, items: string[]): Promise<any> {
		const order = await this.orderClient.sendOrder({
			...orderData,
			...contactsData,
			total: this.basket.getTotalWithPrice(),
			items: items
		});
		return order;
	}

	private async handleOrderSuccess(orderResponse: any): Promise<void> {
		const orderTotal = this.getOrderTotalFromResponse(orderResponse);
		
		this.clearBasketAndCloseModal();
		
		this.showOrderSuccessModal(orderTotal);
	}

	private getOrderTotalFromResponse(orderResponse: any): number {
		// Используем данные с сервера вместо локальных
		return orderResponse?.total || this.basket.getTotalWithPrice();
	}

	private clearBasketAndCloseModal(): void {
		this.basket.clear();
		this.modals.close();
	}

	private showOrderSuccessModal(orderTotal: number): void {
		// Обновляем существующий экземпляр OrderSuccess
		this.orderSuccess = new OrderSuccess(orderTotal);
		this.orderSuccess.onClose = () => {
			this.modals.close();
		};
		this.modals.open(this.orderSuccess.getElement());
	}

}
