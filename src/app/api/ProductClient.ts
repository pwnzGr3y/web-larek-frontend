import BaseClient from '@/app/api/BaseClient';
import type { Product, ProductList } from '@/shared/types';

class ProductClient extends BaseClient {
	constructor(baseUrl: string, options: RequestInit = {}) {
		super(baseUrl, options);
	}

	getProductList() {
		return this.get<ProductList>('/product');
	}

	getProductById(id: Product['id']) {
		if (!id) {
			return this.handleError('getProductById', 'Для выполнения функции нужен id')
		}

		return this.get<Product>(`/product/${id}`);
	}
}

export default ProductClient;