# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
 ## Основные сущности и типы данных
### Товар (Item)
```typescript
export interface IItem {
id: string;
index: number: //порядковый номер в каталоге
title: string;
description: string;
category: TItemCategory;
image: string;
price: number | null
}
```
### Категории товаров
```typescript
export type TItemCategory = 'софт-скил' | 'хард-скил' | 'другое' | 'кнопка' | 'дополнительное';

export const categoryType: Record<TItemCategory, string> = {
	'софт-скил': 'soft',
	'хард-скил': 'hard',
	'другое': 'other',
	'кнопка': 'button',
	'дополнительное': 'additional',
};
```


