import type { Product } from '@/shared/types';

export type PaymentType = 'online' | 'offline';

export type OrderVariables = {
	payment: PaymentType;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: Product['id'][];
}

export type OrderResponse = {
	id: Product['id'];
	total: number;
}

export interface OrderFormData {
	payment: PaymentType;
	address: string;
}

export interface ContactsFormData {
	email: string;
	phone: string;
}