import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDocumentsCursor } from '../../src/hooks/useDocumentsCursor';

function Wrapper({ children }: any) {
  const qc = new QueryClient();
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

describe('useDocumentsCursor', () => {
  const API = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

  beforeEach(() => {
    // @ts-ignore
    global.fetch = vi.fn(async (url: string) => {
      const u = String(url);
      if (u.startsWith(`${API}/documents/cursor`)) {
        const hasCursor = u.includes('cursor=');
        const items = hasCursor ? [{ id: '3' }, { id: '4' }] : [{ id: '1' }, { id: '2' }];
        const body = JSON.stringify({ items, next_cursor: hasCursor ? undefined : 'NEXT', has_more: !hasCursor });
        return new Response(body, { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      return new Response('{}', { status: 200 });
    });
  });

  it('fetches initial page and next page', async () => {
    const { result } = renderHook(() => useDocumentsCursor({}, 2), { wrapper: Wrapper as any });
    await act(async () => { await result.current.loadNext(); });
    expect(result.current.items.map((i: any) => i.id)).toEqual(['1','2']);
    expect(result.current.hasMore).toBe(true);

    await act(async () => { await result.current.loadNext(); });
    expect(result.current.items.map((i: any) => i.id)).toEqual(['1','2','3','4']);
    expect(result.current.hasMore).toBe(false);
  });
});