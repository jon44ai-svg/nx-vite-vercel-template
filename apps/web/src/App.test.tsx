import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import App from './App';

describe('App', () => {
  it('renders the template heading and stack details', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Nx + Vite + Vercel' })).toBeInTheDocument();
    expect(screen.getByText('for monorepo workspaces and task execution')).toBeInTheDocument();
  });

  it('switches to the changelog and admin views', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Changelog' }));
    expect(screen.getByRole('heading', { name: 'v0.2.0' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Admin' }));
    expect(screen.getByRole('heading', { name: 'Admin Panel' })).toBeInTheDocument();
  });
});
