import React from 'react';

export default function App() {
  return (
    <div style={{
      fontFamily: 'system-ui, sans-serif',
      padding: '2rem',
      maxWidth: '600px',
      margin: '0 auto',
      textAlign: 'center',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      marginTop: '10vh'
    }}>
      <h1 style={{ color: '#4F46E5' }}>Nx + Vite + Vercel</h1>
      <p style={{ color: '#4B5563', fontSize: '1.1rem' }}>
        This is a pre-configured monorepo template matching your workspace pattern!
      </p>
      <div style={{ margin: '2rem 0', padding: '1rem', background: '#fff', borderRadius: '4px', textAlign: 'left' }}>
        <h3 style={{ marginTop: 0 }}>Stack Highlights:</h3>
        <ul>
          <li><strong>Nx</strong> for monorepo workspaces and task execution</li>
          <li><strong>Vite</strong> for ultra-fast dev server and bundle speeds</li>
          <li><strong>Vercel</strong> configuration with SPA routing rules (<code>vercel.json</code>)</li>
          <li><strong>Bun</strong> as the default package manager</li>
        </ul>
      </div>
      <small style={{ color: '#9CA3AF' }}>Ready to develop.</small>
    </div>
  );
}
