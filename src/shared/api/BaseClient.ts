import { HttpMethod } from '@/shared/types';
import { HTTP_METHODS } from '@/shared/utils';

class BaseClient {
	readonly baseUrl: string;
	protected options: RequestInit;

	constructor(baseUrl: string, options: RequestInit = {}) {
		this.baseUrl = baseUrl;
		this.options = {
			headers: {
				'Content-Type': 'application/json',
				...((options.headers as object) ?? {}),
			},
		};
	}

	protected async handleResponse<T extends object>(response: Response): Promise<T> {
		if (response.ok) {
			return response.json();
		} else {
			const data = await response.json();

			return await Promise.reject(data.error ?? response.statusText);
		}
	}

	async get<T extends object>(uri: string): Promise<T> {
		const response = await fetch(this.baseUrl + uri, {
			...this.options,
			method: HTTP_METHODS.GET,
		});
		return this.handleResponse(response);
	}

	async post<T extends object>(
		uri: string,
		data: object,
		method: HttpMethod = HTTP_METHODS.POST
	): Promise<object | Awaited<T>> {
		return await fetch(this.baseUrl + uri, {
			...this.options,
			method,
			body: JSON.stringify(data),
		}).then(this.handleResponse);
	}
}

export default BaseClient;