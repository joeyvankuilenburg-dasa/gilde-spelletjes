import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BackButton } from './BackButton';

const { navigate } = vi.hoisted(() => ({ navigate: vi.fn() }));

vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useNavigate: () => navigate,
}));

describe('BackButton', () => {
  beforeEach(() => {
    navigate.mockReset();
  });

  it('returns to the actual previous history entry', () => {
    window.history.replaceState({ idx: 2 }, '', '/spel');
    render(<BackButton />);

    fireEvent.click(screen.getByRole('button', { name: 'Terug naar vorige pagina' }));

    expect(navigate).toHaveBeenCalledWith(-1);
  });

  it('returns to the overview after a direct visit', () => {
    window.history.replaceState({ idx: 0 }, '', '/spel');
    render(<BackButton />);

    fireEvent.click(screen.getByRole('button', { name: 'Terug naar vorige pagina' }));

    expect(navigate).toHaveBeenCalledWith('/', { replace: true });
  });
});
