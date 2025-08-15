import { render, screen, fireEvent } from '@testing-library/react';
import SmartRating from '../../src/components/Documents/SmartRating';

it('submits rating on star click', async () => {
  const submit = vi.fn(async () => {});
  render(<SmartRating documentId="doc-1" submitRating={submit} initialScore={0} />);
  const stars = screen.getAllByLabelText(/امتیاز|ثبت امتیاز/);
  await fireEvent.click(stars[4]);
  expect(submit).toHaveBeenCalled();
});