export default class Basket {
	private items: any[] = [];
	private container: HTMLElement;
	private counter: HTMLElement;
	onCheckout?: () => void;

	constructor() {
		const template = document.querySelector<HTMLTemplateElement>('#basket')!;
		this.container = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

		this.counter = document.querySelector('.header__basket-counter')!;

		this.container.querySelector('.basket__button')?.addEventListener('click', () => {
			this.onCheckout?.();
		});
	}

	add(product: any) {
		this.items.push(product);
		this.render();
	}

	remove(productId: string) {
		this.items = this.items.filter(p => p.id !== productId);
		this.render();
	}

	getTotal() {
		return this.items.reduce((acc, p) => acc + p.price, 0);
	}

	getIds() {
		return this.items.map(p => p.id);
	}

	render() {
		const list = this.container.querySelector('.basket__list')!;
		list.innerHTML = '';

		this.items.forEach((item, index) => {
			const li = document.createElement('li');
			li.className = 'basket__item card card_compact';
			li.innerHTML = `
				<span class="basket__item-index">${index + 1}</span>
				<span class="card__title">${item.title}</span>
				<span class="card__price">${item.price} синапсов</span>
				<button class="basket__item-delete" aria-label="удалить"></button>
			`;
			li.querySelector('button')?.addEventListener('click', () => this.remove(item.id));
			list.append(li);
		});

		this.container.querySelector('.basket__price')!.textContent = `${this.getTotal()} синапсов`;
		this.counter.textContent = String(this.items.length);
	}

	getElement() {
		return this.container;
	}
}
