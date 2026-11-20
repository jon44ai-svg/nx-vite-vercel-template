import { useRef, useState, type FormEvent } from 'react';

import { createApiDal } from '@nx-vite-vercel/dal';
import type {
  AdminStatsResponse,
  TemplateFeatureFlags,
  UserProfile,
} from '@nx-vite-vercel/shared-types';
import { Badge, Button, Card } from '@nx-vite-vercel/ui';

export interface AdminPanelProps {
  features: TemplateFeatureFlags;
}

const DEMO_USERS: readonly UserProfile[] = [
  {
    id: 'demo-admin',
    email: 'admin@example.com',
    name: 'Template Admin',
    role: 'admin',
    createdAt: '2026-11-20T00:00:00.000Z',
  },
];

export function AdminPanel({ features }: AdminPanelProps) {
  const [apiBaseUrl, setApiBaseUrl] = useState('http://localhost:3000');
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('Admin123!');
  const tokenRef = useRef<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [users, setUsers] = useState<readonly UserProfile[]>(DEMO_USERS);
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
  const [statusMessage, setStatusMessage] = useState(
    'Connect to NestJS (:3000) or FastAPI (:8000) to sign in with JWT.',
  );
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setStatusMessage('Signing in...');

    try {
      const dal = createApiDal({
        baseUrl: apiBaseUrl,
        getToken: () => tokenRef.current,
      });
      const response = await dal.auth.login({ email, password });
      tokenRef.current = response.accessToken;
      setCurrentUser(response.user);

      const [nextStats, nextUsers] = await Promise.all([
        dal.admin.getStats(),
        dal.admin.listUsers(),
      ]);
      setStats(nextStats);
      setUsers(nextUsers);
      setStatusMessage(`Signed in as ${response.user.email} (${nextStats.service}).`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to reach API';
      setStatusMessage(`API unavailable or login failed: ${message}. Showing demo preview.`);
    } finally {
      setIsLoading(false);
    }
  }

  function handleLogout() {
    tokenRef.current = null;
    setCurrentUser(null);
    setStats(null);
    setUsers(DEMO_USERS);
    setStatusMessage('Signed out.');
  }

  return (
    <div className="ui-stack">
      <Card
        title="Admin Panel"
        subtitle="Mobile-friendly operations console compatible with both NestJS and FastAPI backends."
      >
        <div className="ui-grid ui-grid-3">
          <div className="ui-card" style={{ boxShadow: 'none' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--ui-text-muted)' }}>Auth Status</div>
            <div style={{ marginTop: '0.35rem' }}>
              <Badge tone={currentUser ? 'success' : 'warning'}>
                {currentUser ? `${currentUser.role}: ${currentUser.email}` : 'Demo Mode'}
              </Badge>
            </div>
          </div>
          <div className="ui-card" style={{ boxShadow: 'none' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--ui-text-muted)' }}>Users</div>
            <strong style={{ fontSize: '1.35rem' }}>{stats?.totalUsers ?? users.length}</strong>
          </div>
          <div className="ui-card" style={{ boxShadow: 'none' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--ui-text-muted)' }}>Active API</div>
            <strong style={{ fontSize: '1.05rem' }}>{stats?.service ?? 'Disconnected'}</strong>
          </div>
        </div>
      </Card>

      {features.auth ? (
        <Card title="JWT Authentication" subtitle={statusMessage}>
          <form className="ui-stack" onSubmit={handleLogin}>
            <div className="ui-grid ui-grid-2">
              <label className="ui-stack" style={{ gap: '0.3rem' }}>
                <span>API Base URL</span>
                <input
                  className="ui-input"
                  value={apiBaseUrl}
                  onChange={(event) => setApiBaseUrl(event.target.value)}
                  placeholder="http://localhost:3000"
                />
              </label>
              <label className="ui-stack" style={{ gap: '0.3rem' }}>
                <span>Email</span>
                <input
                  className="ui-input"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </label>
            </div>
            <label className="ui-stack" style={{ gap: '0.3rem' }}>
              <span>Password</span>
              <input
                className="ui-input"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
              <Button variant="secondary" onClick={() => setApiBaseUrl('http://localhost:3000')}>
                Use NestJS (:3000)
              </Button>
              <Button variant="secondary" onClick={() => setApiBaseUrl('http://localhost:8000')}>
                Use FastAPI (:8000)
              </Button>
              {currentUser ? (
                <Button variant="ghost" onClick={handleLogout}>
                  Sign out
                </Button>
              ) : null}
            </div>
          </form>
        </Card>
      ) : null}

      <Card title="Users Directory" subtitle="Synced from GET /admin/users when authenticated.">
        <div className="ui-table-wrap">
          <table className="ui-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Badge tone={user.role === 'admin' ? 'success' : 'neutral'}>{user.role}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
