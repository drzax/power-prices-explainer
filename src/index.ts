import { whenOdysseyLoaded } from '@abcnews/env-utils';
import { getMountValue, selectMounts } from '@abcnews/mount-utils';
import { mount } from 'svelte';
import { loadScrollyteller } from '@abcnews/svelte-scrollyteller';
import ScrollyWrapper from './components/ScrollyWrapper.svelte';
import { proxy } from '@abcnews/dev-proxy';

Promise.all([whenOdysseyLoaded, proxy('election-ternary-plots')]).then(() => {
  const mounts = selectMounts('scrollyteller', { markAsUsed: false });
  mounts.forEach(appMountNode => {
    const id = getMountValue(appMountNode, 'scrollyteller').match(/NAME([a-z0-9]+)/)?.[1];

    try {
      const scrollyConfig = loadScrollyteller(id, 'u-full', 'mark');
      mount(ScrollyWrapper, {
        target: scrollyConfig.mountNode,
        props: { panels: scrollyConfig.panels }
      });
    } catch (e) {
      const errorMessage = 'Unable to load interactive.';
      console.error(errorMessage, e);
      appMountNode.innerHTML = `<p style="border:1px solid red;padding:1rem;">${errorMessage}</p>`;
    }
  });
});

if (process.env.NODE_ENV === 'development') {
  console.debug(`[election-ternary-plots] public path: ${__webpack_public_path__}`);
}
