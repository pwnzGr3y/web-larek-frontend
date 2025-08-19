import ProductClient from '@/app/api/ProductClient';
import { API_URL } from '@/shared/utils';
import OrderClient from '@/app/api/OrderClient';

const productClient = new ProductClient(API_URL);
const orderClient = new OrderClient(API_URL);

const productList = await productClient.getProductList();
const testProduct = Object.values(productList.items).length ? productList.items[0].id : '';
const product = await productClient.getProductById(testProduct);
const createOrder = await orderClient.sendOrder({
	"payment": "online",
	"email": "test@test.ru",
	"phone": "+71234567890",
	"address": "Spb Vosstania 1",
	"total": 2200,
	"items": [
		"854cef69-976d-4c2a-a18c-2aa45046c390",
		"c101ab44-ed99-4a54-990d-47aa2bb4e7d9"
	]
})

console.log(productList.items);
console.log(product);
console.log(createOrder);