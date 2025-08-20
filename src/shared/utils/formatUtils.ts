export function formatPrice(price: number | null | undefined): string {
	if (price === null || price === undefined || price <= 0) {
		return 'Бесценно';
	}
	return `${price.toLocaleString('ru-RU')} синапсов`;
}