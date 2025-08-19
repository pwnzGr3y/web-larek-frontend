import { HTTP_METHODS } from '@/shared/utils';

export type HttpMethods = typeof HTTP_METHODS;
export type HttpMethod = HttpMethods[keyof HttpMethods];