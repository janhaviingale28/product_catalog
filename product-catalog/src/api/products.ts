import type { Product, ProductsResponse } from '../types';

const BASE_URL: string = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'https://fakestoreapi.noksha.dev/api';

/** Error with a user-friendly message and optional HTTP status. */
export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// In-memory cache so the detail page can show something instantly
// (and keep working if the detail request fails).
let productsCache: Product[] | null = null;

export const getCachedProducts = (): Product[] | null => productsCache;
export const getCachedProduct = (id: string | number): Product | undefined =>
  productsCache?.find((p) => String(p._id) === String(id));

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, { signal });
  } catch (err) {
    if ((err as Error).name === 'AbortError') throw err; // let callers ignore cancellations
    throw new ApiError('Could not reach the server. Check your connection and try again.');
  }

  if (!res.ok) {
    throw new ApiError(
      res.status === 404 ? 'We could not find that item.' : `The server returned an error (${res.status}).`,
      res.status,
    );
  }

  try {
    return (await res.json()) as T;
  } catch {
    throw new ApiError('The server sent a response we could not read.');
  }
}

/** Fetches every page of /products and merges them (de-duplicated by id). */
export async function fetchAllProducts(signal?: AbortSignal): Promise<Product[]> {
  const first = await request<ProductsResponse>('/products', signal);
  if (!Array.isArray(first?.data)) throw new ApiError('Unexpected response from the products API.');

  const totalPages = Math.max(Number(first.totalPages) || 1, 1);
  const rest = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, i) =>
      request<ProductsResponse>(`/products?page=${i + 2}`, signal),
    ),
  );

  const byId = new Map<number, Product>();
  [first, ...rest].forEach((page) => page.data?.forEach((p) => byId.set(p._id, p)));
  productsCache = [...byId.values()];
  return productsCache;
}

/** Accepts `{ data: product }`, `{ product }` or a bare product object. */
export function normalizeProduct(json: unknown): Product {
  const obj = json as Record<string, unknown> | null;
  const candidate = (obj && (obj.data ?? obj.product ?? obj)) as Partial<Product> | null;
  if (!candidate || typeof candidate !== 'object' || candidate._id == null || !candidate.title) {
    throw new ApiError('We could not find that item.', 404);
  }
  return candidate as Product;
}

export async function fetchProduct(id: string, signal?: AbortSignal): Promise<Product> {
  const json = await request<unknown>(`/products/${encodeURIComponent(id)}`, signal);
  return normalizeProduct(json);
}
