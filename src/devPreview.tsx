/**
 * DEV-ONLY verification harness — NOT part of the Storybook deliverable.
 *
 * This exists purely because this sandbox's network egress policy blocks the
 * npm registry, so Storybook itself can't be installed/booted here to prove
 * the components actually work before handing them off. It bundles the real
 * component source with esbuild (vendored inside a pre-installed dev
 * dependency) and mounts it with react-dom/client so it can be exercised in
 * a real headless browser (Playwright) — same component code, no shortcuts.
 */
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { DataGrid } from './components/DataGrid';
import { Row } from './components/Row';
import { sampleRows } from './sampleData';

function Harness() {
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', gap: 8 }} id="dev-controls">
        <button id="btn-loading" onClick={() => setLoading((v) => !v)}>Toggle loading</button>
        <button id="btn-error" onClick={() => setShowError((v) => !v)}>Toggle error</button>
        <button id="btn-empty" onClick={() => setShowEmpty((v) => !v)}>Toggle empty</button>
      </div>
      <div id="grid-under-test">
        <DataGrid
          rows={showEmpty ? [] : sampleRows}
          loading={loading}
          error={showError ? 'Could not load accounts. Check your connection and try again.' : null}
        />
      </div>
      <h2>Row variants (Figma 1:1)</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, width: 960 }}>
        {(['default', 'hover', 'selected', 'disabled', 'error'] as const).map((state) => (
          <Row key={state} row={sampleRows[0]} state={state} selected={state === 'selected'} />
        ))}
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<Harness />);
