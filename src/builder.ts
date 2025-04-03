import { whenDOMReady } from '@abcnews/env-utils';
import { selectMounts } from '@abcnews/mount-utils';
import type { Mount } from '@abcnews/mount-utils';
import App from './components/App.svelte';
import { mount } from 'svelte';

let appMountEl: Mount;

whenDOMReady.then(() => {
  [appMountEl] = selectMounts('electionternaryplots');
  if (appMountEl) {
    mount(App, {
      target: appMountEl
    });
  }
});

if (process.env.NODE_ENV === 'development') {
  console.debug(`[election-ternary-plots] public path: ${__webpack_public_path__}`);
}
