import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <main
      style={{
        fontFamily: 'system-ui, sans-serif',
        padding: '1.5rem',
        maxWidth: 720,
        margin: '0 auto',
      }}
    >
      <h1>Nx + TanStack Start</h1>
      <p>
        Optional full-stack SSR React frontend. Enable with{' '}
        <code>bun run setup --enable=tanstackStart</code>.
      </p>
    </main>
  );
}
