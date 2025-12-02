import { whenDOMReady } from '@abcnews/env-utils';
import { selectMounts } from '@abcnews/mount-utils';
import type { Mount } from '@abcnews/mount-utils';
import App from './components/builder/BuilderApp.svelte';
import { mount } from 'svelte';
import { proxy } from '@abcnews/dev-proxy';
import { MARKER_NAME } from './lib/constants';

let appMountEl: Mount;

Promise.all([whenDOMReady, proxy('power-prices-explainer')]).then(() => {
  [appMountEl] = selectMounts(MARKER_NAME);
  if (appMountEl) {
    mount(App, {
      target: appMountEl
    });
  }
});

if (process.env.NODE_ENV === 'development') {
  console.debug(`[power-prices-explainer] public path: ${__webpack_public_path__}`);
}
