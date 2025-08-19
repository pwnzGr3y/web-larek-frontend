export type Product = {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null
}

export type ProductList = {
	total: number;
	items: Product[];
}