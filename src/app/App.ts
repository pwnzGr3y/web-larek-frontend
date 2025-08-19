import ProductClient from '@/app/api/ProductClient';
import OrderClient from '@/app/api/OrderClient';
import { API_URL } from '@/shared/utils';

import Gallery from '@/components/Gallery';
import ProductPreview from '@/components/ProductPreview';
import Basket from '@/components/Basket';
import ModalManager from '@/components/ModalManager';
import OrderForm from '@/components/OrderForm';
import ContactsForm from '@/components/ContactsForm';

export default class App {
	private productClient = new ProductClient(API_URL);
	private orderClient = new OrderClient(API_URL);

	private gallery: Gallery;
	private basket: Basket;
	private modals: ModalManager;

	constructor() {
		this.gallery = new Gallery(document.querySelector('.gallery')!);
		this.basket = new Basket();
		this.modals = new ModalManager();

		this.init();
	}

	async init() {
		const productList = await this.productClient.getProductList();

		// рендерим карточки товаров
		this.gallery.render(productList.items);

		this.gallery.onSelectProduct = (product) => {
			const preview = new ProductPreview(product, (p) => {
				this.basket.add(p);
				this.modals.close();
			});
			this.modals.open(preview.getElement());
		};

		// открытие корзины по кнопке в хедере
		document.querySelector('.header__basket')?.addEventListener('click', () => {
			this.modals.open(this.basket.getElement());
		});

		// оформление заказа
		this.basket.onCheckout = () => {
			const orderForm = new OrderForm(async (orderData) => {
				// переход на форму контактов
				const contactsForm = new ContactsForm(async (contactsData) => {
					const order = await this.orderClient.sendOrder({
						...orderData,
						...contactsData,
						total: this.basket.getTotal(),
						items: this.basket.getIds()
					});
					console.log('Заказ успешно создан', order);
				});
				this.modals.open(contactsForm.getElement());
			});
			this.modals.open(orderForm.getElement());
		};
	}
}
