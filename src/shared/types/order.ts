import type { Product } from '@/shared/types';

export type PaymentType = 'online' | 'offline';

export type OrderVariables = {
	payment: PaymentType;
	email: string;
	phone: string;
	address: string;
	total: number | null;
	items: Product['id'][];
}

export type OrderResponse = {
	id: Product['id'];
	total: number | null;
}