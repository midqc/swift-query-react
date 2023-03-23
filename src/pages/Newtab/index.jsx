import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';

import '../tailwind.css';
import './index.css';

const Newtab = lazy(() => import('./Newtab'));

const container = document.getElementById('app-container');
const root = createRoot(container); // createRoot(container!) if you use TypeScript

setTimeout(() => {
  root.render(
    <Suspense fallback={<div></div>}>
      <Newtab />
    </Suspense>
  );
}, 0);
