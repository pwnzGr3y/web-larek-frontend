import {
	Basket,
	ContactsForm,
	Gallery,
	ModalManager,
	OrderForm,
	OrderSuccess,
	ProductPreview
} from '@/components';
import type { OrderFormData, ContactsFormData } from '@/shared/types';
import { API_URL } from '@/shared/utils';
import { OrderClient, ProductClient } from '@/app/api';

export default class App {
	private productClient = new ProductClient(API_URL);
	private orderClient = new OrderClient(API_URL);

	private gallery: Gallery;
	private basket: Basket;
	private modals: ModalManager;

	constructor() {
		const galleryElement = document.querySelector('.gallery') as HTMLElement;
		if (!galleryElement) {
			throw new Error('Gallery element not found');
		}
		this.gallery = new Gallery(galleryElement);
		this.basket = new Basket();
		this.modals = new ModalManager();

		this.init();
	}

	async init(): Promise<void> {
		try {
			const productList = await this.productClient.getProductList();

			this.gallery.render(productList.items);

			this.gallery.onSelectProduct = async (product) => {
				try {
					const freshProduct = await this.productClient.getProductById(product.id);
					const isInBasket = this.basket.getIds().includes(freshProduct.id);
					
					const preview = new ProductPreview(
						freshProduct, 
						(p) => {
							this.basket.add(p);
							this.modals.close();
							this.updateGallery();
						},
						(p) => {
							this.basket.remove(p.id);
							this.modals.close();
							this.updateGallery();
						},
						isInBasket
					);
					this.modals.open(preview.getElement());
				} catch (error) {
					console.error('Ошибка при получении информации о товаре:', error);
					const isInBasket = this.basket.getIds().includes(product.id);
			
					const preview = new ProductPreview(
						product, 
						(p) => {
							this.basket.add(p);
							this.modals.close();
							this.updateGallery();
						},
						(p) => {
							this.basket.remove(p.id);
							this.modals.close();
							this.updateGallery();
						},
						isInBasket
					);
					this.modals.open(preview.getElement());
				}
			};

			document.querySelector('.header__basket')?.addEventListener('click', () => {
				this.modals.open(this.basket.getElement());
			});

			this.basket.onCheckout = () => {
				const orderForm = new OrderForm(async (orderData: OrderFormData) => {
					const contactsForm = new ContactsForm(async (contactsData: ContactsFormData) => {
						try {
							const basketItems = this.basket.getItems();
							const validItems: string[] = [];
							
							for (const item of basketItems) {
								try {
									await this.productClient.getProductById(item.id);
									validItems.push(item.id);
								} catch (error) {
									console.warn(`Товар ${item.title} (${item.id}) больше не доступен, удаляем из корзины`);
									this.basket.remove(item.id);
								}
							}
							
							if (validItems.length === 0) {
								alert('В корзине не осталось доступных товаров. Корзина очищена.');
								this.modals.close();
								return;
							}
							
							const itemsWithPrice = this.basket.getItemsWithPrice();
							const validItemsWithPrice = itemsWithPrice
								.filter(item => validItems.includes(item.id))
								.map(item => item.id);
							
							if (validItemsWithPrice.length === 0) {
								alert('В корзине не осталось товаров с ценой. Заказ не может быть оформлен.');
								this.modals.close();
								return;
							}
							
							const order = await this.orderClient.sendOrder({
								...orderData,
								...contactsData,
								total: this.basket.getTotalWithPrice(),
								items: validItemsWithPrice
							});
							console.log('Заказ успешно создан', order);
							
							const orderTotal = this.basket.getTotalWithPrice();
							
							this.basket.clear();
							this.modals.close();
							
							const orderSuccess = new OrderSuccess(orderTotal);
							orderSuccess.onClose = () => {
								this.modals.close();
							};
							this.modals.open(orderSuccess.getElement());
							
						} catch (error) {
							console.error('Ошибка при создании заказа:', error);
							alert('Ошибка при оформлении заказа. Попробуйте еще раз.');
						}
					});
					this.modals.open(contactsForm.getElement());
				});
				this.modals.open(orderForm.getElement());
			};
		} catch (error) {
			console.error('Ошибка при инициализации приложения:', error);
		}
	}

	private async updateGallery(): Promise<void> {
		try {
			const productList = await this.productClient.getProductList();
			this.gallery.render(productList.items);
		} catch (error) {
			console.error('Ошибка при обновлении галереи:', error);
		}
	}
}
