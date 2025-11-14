import { whenDOMReady } from '@abcnews/env-utils';
import { selectMounts } from '@abcnews/mount-utils';
import type { Mount } from '@abcnews/mount-utils';
import App from './components/builder/BuilderApp.svelte';
import { mount } from 'svelte';
import { proxy } from '@abcnews/dev-proxy';

let appMountEl: Mount;

Promise.all([whenDOMReady, proxy('election-ternary-plots')]).then(() => {
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
