import ProductClient from '@/shared/api/ProductClient';
import { API_URL } from '@/shared/utils';

const productClient = new ProductClient(API_URL);

const productList = await productClient.getProductList();

console.log(productList.items);