import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { API_VERSION } from './bootstrap';

export type ServiceResult<T = unknown> = {
  status: number;
  data: T;
};

@Injectable()
export class ServiceClient {
  async send<T = unknown>(input: {
    baseUrl: string;
    service: string;
    method: string;
    path: string;
    body?: unknown;
    query?: Record<string, string | undefined>;
    headers?: Record<string, string | undefined>;
  }): Promise<ServiceResult<T>> {
    const url = new URL(versionedPath(input.path), withSlash(input.baseUrl));
    for (const [key, value] of Object.entries(input.query ?? {})) {
      if (value) url.searchParams.set(key, value);
    }

    const headers = new Headers();
    if (input.body !== undefined) {
      headers.set('content-type', 'application/json');
    }
    for (const [key, value] of Object.entries(input.headers ?? {})) {
      if (value) headers.set(key, value);
    }

    try {
      const response = await fetch(url, {
        method: input.method,
        headers,
        body: input.body === undefined ? undefined : JSON.stringify(input.body),
      });
      const text = await response.text();
      const data = text ? (parseJson(text) as T) : (null as T);
      return { status: response.status, data };
    } catch {
      throw new ServiceUnavailableException(`${input.service} is unavailable`);
    }
  }
}

function versionedPath(path: string) {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (normalized === '/health' || normalized.startsWith('/health/')) {
    return normalized;
  }
  const prefix = `/v${API_VERSION}`;
  if (normalized === prefix || normalized.startsWith(`${prefix}/`)) {
    return normalized;
  }
  return `${prefix}${normalized}`;
}

function withSlash(baseUrl: string) {
  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
}

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { message: text };
  }
}
