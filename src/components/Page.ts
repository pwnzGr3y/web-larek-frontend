export default class Page {
	private basketButton: HTMLElement | null = null;
	private basketCounter: HTMLElement | null = null;
	private galleryContainer: HTMLElement | null = null;
	private onBasketButtonClick?: () => void;

	constructor() {
		this.initializeElements();
		this.setupEventHandlers();
	}

	private initializeElements(): void {
		this.basketButton = document.querySelector('.header__basket');
		this.basketCounter = document.querySelector('.header__basket-counter');
		this.galleryContainer = document.querySelector('.gallery');
	}

	private setupEventHandlers(): void {
		if (this.basketButton) {
			this.basketButton.addEventListener('click', () => {
				this.onBasketButtonClick?.();
			});
		}
	}

	setBasketButtonClickHandler(handler: () => void): void {
		this.onBasketButtonClick = handler;
	}

	getGalleryContainer(): HTMLElement | null {
		return this.galleryContainer;
	}

	updateBasketCounter(count: number): void {
		if (this.basketCounter) {
			this.basketCounter.textContent = String(count);
		}
	}
}
