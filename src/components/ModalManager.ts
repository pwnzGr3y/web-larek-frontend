export default class ModalManager {
	private container: HTMLElement;

	constructor() {
		this.container = document.getElementById('modal-container')!;
		this.container.querySelector('.modal__close')?.addEventListener('click', () => this.close());

		// закрытие по клику на фон
		this.container.addEventListener('click', (e) => {
			if (e.target === this.container) {
				this.close();
			}
		});
	}

	open(content: HTMLElement) {
		const modalContent = this.container.querySelector('.modal__content')!;
		modalContent.innerHTML = '';
		modalContent.append(content);
		this.container.classList.add('modal_active');
	}

	close() {
		this.container.classList.remove('modal_active');
	}
}
