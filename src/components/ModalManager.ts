export default class ModalManager {
	private readonly container: HTMLElement;
	private readonly scrollbarWidth: number = 0;

	constructor() {
		const container = document.getElementById('modal-container');
		if (!container) {
			throw new Error('Modal container not found');
		}
		this.container = container;
		this.container.querySelector('.modal__close')?.addEventListener('click', () => this.close());

		this.container.addEventListener('click', (e) => {
			if (e.target === this.container) {
				this.close();
			}
		});

		this.scrollbarWidth = this.getScrollbarWidth();
	}

	private getScrollbarWidth(): number {
		const outer = document.createElement('div');
		outer.style.visibility = 'hidden';
		outer.style.overflow = 'scroll';
		document.body.appendChild(outer);

		const inner = document.createElement('div');
		outer.appendChild(inner);

		const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
		outer.parentNode?.removeChild(outer);

		return scrollbarWidth;
	}

	open(content: HTMLElement): void {
		const modalContent = this.container.querySelector('.modal__content');
		if (!modalContent) {
			console.error('Modal content element not found');
			return;
		}
		modalContent.innerHTML = '';
		modalContent.append(content);
		this.container.classList.add('modal_active');
		
		document.body.style.paddingRight = `${this.scrollbarWidth}px`;
		document.body.style.overflow = 'hidden';
	}

	close(): void {
		this.container.classList.remove('modal_active');
		document.body.style.paddingRight = '';
		document.body.style.overflow = '';
	}
}
