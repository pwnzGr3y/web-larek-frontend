import BaseClient from '@/app/api/BaseClient';
import type { OrderResponse, OrderVariables } from '@/shared/types';

class OrderClient extends BaseClient {
	constructor(baseUrl: string, options: RequestInit = {}) {
		super(baseUrl, options);
	}

	sendOrder(orderVariables: OrderVariables) {
		if (!Object.values(orderVariables).length) {
			return this.handleError('sendOrder', 'не переданы аргументы для запроса');
		}

		return this.post<OrderResponse>('/order', orderVariables);
	}
}

export default OrderClient;