import { describe, expect, it, vi } from 'vitest';
import { ApiClient, ApiError, api, createApiClient } from './api';

describe('ApiClient', () => {
  it('instantiates with default configuration', () => {
    expect(api.getBaseURL()).toBe('/api');
  });

  it('allows custom baseURL and update', () => {
    const client = createApiClient({ baseURL: 'https://example.com/api/v1/' });
    expect(client.getBaseURL()).toBe('https://example.com/api/v1/');
    client.setBaseURL('/custom-api');
    expect(client.getBaseURL()).toBe('/custom-api');
  });

  it('performs GET request and parses JSON', async () => {
    const mockData = { id: '123', name: 'Health App' };
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      text: async () => JSON.stringify(mockData),
    });

    const client = new ApiClient({ baseURL: '/api', fetch: mockFetch as unknown as typeof fetch });
    const result = await client.get<{ id: string; name: string }>('/dashboard');

    expect(mockFetch).toHaveBeenCalledWith('/api/dashboard', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      body: undefined,
    });
    expect(result).toEqual(mockData);
  });

  it('serializes JSON body and sets Content-Type for POST request', async () => {
    const payload = { title: 'Lunch', kcal: 500 };
    const responseData = { success: true };
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      statusText: 'Created',
      text: async () => JSON.stringify(responseData),
    });

    const client = new ApiClient({ baseURL: '/api', fetch: mockFetch as unknown as typeof fetch });
    const result = await client.post('/food/meals', payload);

    expect(mockFetch).toHaveBeenCalledWith('/api/food/meals', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    expect(result).toEqual(responseData);
  });

  it('supports PUT, PATCH, and DELETE requests', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      text: async () => JSON.stringify({ ok: true }),
    });

    const client = new ApiClient({ baseURL: '/api', fetch: mockFetch as unknown as typeof fetch });

    await client.put('/item/1', { name: 'updated' });
    expect(mockFetch).toHaveBeenLastCalledWith(
      '/api/item/1',
      expect.objectContaining({ method: 'PUT', body: JSON.stringify({ name: 'updated' }) })
    );

    await client.patch('/item/1', { active: true });
    expect(mockFetch).toHaveBeenLastCalledWith(
      '/api/item/1',
      expect.objectContaining({ method: 'PATCH', body: JSON.stringify({ active: true }) })
    );

    await client.delete('/item/1');
    expect(mockFetch).toHaveBeenLastCalledWith(
      '/api/item/1',
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('encodes query params in the URL', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      text: async () => JSON.stringify([]),
    });

    const client = new ApiClient({ baseURL: '/api', fetch: mockFetch as unknown as typeof fetch });
    await client.get('/stats', { params: { range: '30d', limit: 10, skipNull: null } });

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/stats?range=30d&limit=10',
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('handles 204 No Content response properly', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
      statusText: 'No Content',
      text: async () => '',
    });

    const client = new ApiClient({ baseURL: '/api', fetch: mockFetch as unknown as typeof fetch });
    const result = await client.delete('/item/123');

    expect(result).toBeUndefined();
  });

  it('throws ApiError on non-ok HTTP responses with parsed error payload', async () => {
    const errorPayload = { message: 'Workout not found', code: 'ERR_NOT_FOUND' };
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      text: async () => JSON.stringify(errorPayload),
    });

    const client = new ApiClient({ baseURL: '/api', fetch: mockFetch as unknown as typeof fetch });

    try {
      await client.get('/workouts/unknown');
      expect.unreachable('Should have thrown ApiError');
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      const apiErr = err as ApiError;
      expect(apiErr.status).toBe(404);
      expect(apiErr.statusText).toBe('Not Found');
      expect(apiErr.message).toBe('Workout not found');
      expect(apiErr.data).toEqual(errorPayload);
    }
  });

  it('throws ApiError with default statusText when error body is not JSON', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: async () => 'Fatal server crash',
    });

    const client = new ApiClient({ baseURL: '/api', fetch: mockFetch as unknown as typeof fetch });

    await expect(client.get('/crash')).rejects.toThrow('HTTP 500: Internal Server Error');
  });
});
