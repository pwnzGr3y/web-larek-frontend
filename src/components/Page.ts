export default class Page {
	private basketButton: HTMLElement | null = null;
	private basketCounter: HTMLElement | null = null;
	private galleryContainer: HTMLElement | null = null;

	constructor() {
		this.initializeElements();
	}

	private initializeElements(): void {
		this.basketButton = document.querySelector('.header__basket');
		this.basketCounter = document.querySelector('.header__basket-counter');
		this.galleryContainer = document.querySelector('.gallery');
	}

	getBasketButton(): HTMLElement | null {
		return this.basketButton;
	}

	getBasketCounter(): HTMLElement | null {
		return this.basketCounter;
	}

	getGalleryContainer(): HTMLElement | null {
		return this.galleryContainer;
	}

	setBasketCounterText(text: string): void {
		if (this.basketCounter) {
			this.basketCounter.textContent = text;
		}
	}
}
