import { BaseClient } from '@/app/api';
import type { Product, ProductList } from '@/shared/types';

class ProductClient extends BaseClient {
	constructor(baseUrl: string, options: RequestInit = {}) {
		super(baseUrl, options);
	}

	async getProductList(): Promise<ProductList> {
		return this.get<ProductList>('/product');
	}

	async getProductById(id: Product['id']): Promise<Product> {
		if (!id) {
			throw new Error('Для выполнения функции нужен id');
		}

		return this.get<Product>(`/product/${id}`);
	}
}

export default ProductClient;