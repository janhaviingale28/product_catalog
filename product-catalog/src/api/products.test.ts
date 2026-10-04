import { ApiError, fetchAllProducts, fetchProduct, normalizeProduct } from './products';

const item = (id: number) => ({ _id: id, title: `P${id}` });
const ok = (body: unknown) => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(body) } as Response);

afterEach(() => vi.restoreAllMocks());

describe('products API', () => {
  it('merges every page and removes duplicates', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation((url) =>
      String(url).includes('page=2')
        ? ok({ data: [item(2), item(3)], totalPages: 2 })
        : ok({ data: [item(1), item(2)], totalPages: 2 }),
    );
    const all = await fetchAllProducts();
    expect(all.map((p) => p._id)).toEqual([1, 2, 3]);
  });

  it('turns network failures into a friendly ApiError', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));
    await expect(fetchAllProducts()).rejects.toBeInstanceOf(ApiError);
  });

  it('reports 404s for a missing product', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false, status: 404 } as Response);
    await expect(fetchProduct('999')).rejects.toMatchObject({ status: 404 });
  });

  it('normalizes wrapped and bare product payloads', () => {
    expect(normalizeProduct({ data: item(1) })._id).toBe(1);
    expect(normalizeProduct(item(2))._id).toBe(2);
    expect(() => normalizeProduct({ data: null })).toThrow(ApiError);
  });
});
