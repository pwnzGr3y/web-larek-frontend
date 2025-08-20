import { BaseClient } from '@/app/api';
import type { OrderResponse, OrderVariables } from '@/shared/types';

class OrderClient extends BaseClient {
	constructor(baseUrl: string, options: RequestInit = {}) {
		super(baseUrl, options);
	}

	async sendOrder(orderVariables: OrderVariables): Promise<OrderResponse> {
		if (!Object.values(orderVariables).length) {
			throw new Error('Не переданы аргументы для запроса');
		}

		return this.post<OrderResponse>('/order', orderVariables);
	}
}

export default OrderClient;