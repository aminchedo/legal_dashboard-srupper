import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDocumentsCursor } from '../../src/hooks/useDocumentsCursor';
import React from 'react';

function List() {
  const { items, loadNext, hasMore } = useDocumentsCursor({}, 2);
  return (
    <div>
      <button onClick={() => loadNext()}>Load</button>
      <ul>{items.map((it: any) => <li key={it.id}>{it.id}</li>)}</ul>
      {hasMore && <button onClick={() => loadNext()}>More</button>}
    </div>
  );
}

it('loads pages with cursor', async () => {
  const API = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';
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

  const qc = new QueryClient();
  render(<QueryClientProvider client={qc}><List /></QueryClientProvider>);
  await fireEvent.click(screen.getByText('Load'));
  expect(await screen.findByText('1')).toBeInTheDocument();
  await fireEvent.click(screen.getByText('More'));
  expect(await screen.findByText('4')).toBeInTheDocument();
});