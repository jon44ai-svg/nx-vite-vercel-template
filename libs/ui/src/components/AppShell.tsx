import type { ReactNode } from 'react';

import { Button } from './Button';

export interface NavItem {
  id: string;
  label: string;
}

export interface AppShellProps {
  brand: string;
  navItems: readonly NavItem[];
  activeNavId: string;
  onSelectNav: (id: string) => void;
  children: ReactNode;
}

export function AppShell({ brand, navItems, activeNavId, onSelectNav, children }: AppShellProps) {
  return (
    <div className="ui-shell">
      <header className="ui-header">
        <div className="ui-header-inner">
          <div className="ui-brand">{brand}</div>
          <nav className="ui-nav" aria-label="Primary navigation">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={item.id === activeNavId ? 'primary' : 'ghost'}
                aria-current={item.id === activeNavId ? 'page' : undefined}
                onClick={() => onSelectNav(item.id)}
              >
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      </header>
      <main className="ui-main">{children}</main>
    </div>
  );
}
