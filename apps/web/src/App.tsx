import { useMemo, useState } from 'react';

import { parseChangelogMarkdown } from '@nx-vite-vercel/dal';
import { AppShell, ChangelogList, type NavItem } from '@nx-vite-vercel/ui';

import changelogMarkdown from '../../../CHANGELOG.md?raw';
import { AdminPanel } from './components/AdminPanel';
import { OverviewSection } from './components/OverviewSection';
import { getTemplateFeatures } from './config/features';

export default function App() {
  const features = getTemplateFeatures();
  const [activeTab, setActiveTab] = useState<'overview' | 'changelog' | 'admin'>('overview');

  const navItems = useMemo<NavItem[]>(() => {
    const items: NavItem[] = [
      { id: 'overview', label: 'Overview' },
      { id: 'changelog', label: 'Changelog' },
    ];
    if (features.admin) {
      items.push({ id: 'admin', label: 'Admin' });
    }
    return items;
  }, [features.admin]);

  const changelogEntries = useMemo(() => parseChangelogMarkdown(changelogMarkdown), []);

  return (
    <AppShell
      brand="Nx + Vite + Vercel"
      navItems={navItems}
      activeNavId={activeTab}
      onSelectNav={(id) => {
        if (id === 'overview' || id === 'changelog' || id === 'admin') {
          setActiveTab(id);
        }
      }}
    >
      {activeTab === 'overview' ? <OverviewSection features={features} /> : null}
      {activeTab === 'changelog' ? <ChangelogList entries={changelogEntries} /> : null}
      {activeTab === 'admin' && features.admin ? <AdminPanel features={features} /> : null}
    </AppShell>
  );
}
