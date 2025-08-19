import BaseClient from '@/app/api/BaseClient';
import type { Product, ProductList } from '@/shared/types';

class ProductClient extends BaseClient {
	constructor(baseUrl: string, options: RequestInit = {}) {
		super(baseUrl, options);
	}

	// Функция для замены .svg на .png
	private replaceSvgToPng(product: Product): Product {
		return {
			...product,
			image: product.image.replace(/\.svg$/, '.png')
		};
	}

	// Функция для обработки массива продуктов
	private replaceSvgToPngInArray(products: Product[]): Product[] {
		return products.map(product => this.replaceSvgToPng(product));
	}

	getProductList() {
		return this.get<ProductList>('/product').then(response => {
			if (response && response.items) {
				return {
					...response,
					items: this.replaceSvgToPngInArray(response.items)
				};
			}
			return response;
		});
	}

	getProductById(id: Product['id']) {
		if (!id) {
			return this.handleError('getProductById', 'Для выполнения функции нужен id');
		}

		return this.get<Product>(`/product/${id}`).then(product => {
			if (product) {
				return this.replaceSvgToPng(product);
			}
			return product;
		});
	}
}

export default ProductClient;