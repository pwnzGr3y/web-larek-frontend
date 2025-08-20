export function changeImageExtensionToPng(imageUrl: string): string {
	if (!imageUrl) return imageUrl;
	
	if (imageUrl.toLowerCase().endsWith('.svg')) {
		return imageUrl.replace(/\.svg$/i, '.png');
	}
	
	return imageUrl;
}

export function buildImageUrl(baseUrl: string, imagePath: string): string {
	// Убираем слеш в конце baseUrl если он есть
	const cleanBaseUrl = baseUrl.replace(/\/$/, '');
	// Убираем слеш в начале imagePath если он есть
	const cleanImagePath = imagePath.replace(/^\//, '');
	
	return `${cleanBaseUrl}/${cleanImagePath}`;
}
