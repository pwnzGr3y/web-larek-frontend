import BaseClient from '@/shared/api/BaseClient';
import type { Product, ProductList } from '@/shared/types';

class ProductClient extends BaseClient {
	constructor(baseUrl: string, options: RequestInit = {}) {
		super(baseUrl, options);
	}

	getProductList() {
		return this.get<ProductList>('/product');
	}

	getProductById(id: Product['id']) {
		return this.get<Product>(`/product/${id}`);
	}
}

export default ProductClient;