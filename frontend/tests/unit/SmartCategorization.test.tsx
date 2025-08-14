import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import SmartCategorization from '../../src/components/Documents/SmartCategorization';

it('fetches and applies suggestion', async () => {
  const fetchS = vi.fn(async () => ['الف', 'ب']);
  const apply = vi.fn(async () => {});
  render(<SmartCategorization documentId="doc-1" fetchSuggestions={fetchS} applyCategory={apply} />);
  await waitFor(() => expect(fetchS).toHaveBeenCalled());
  const btn = await screen.findByText('الف');
  await fireEvent.click(btn);
  expect(apply).toHaveBeenCalled();
});