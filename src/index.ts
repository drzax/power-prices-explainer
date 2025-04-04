import { whenOdysseyLoaded } from '@abcnews/env-utils';
import { getMountValue, selectMounts } from '@abcnews/mount-utils';
import { mount } from 'svelte';
import { MARKER_NAME } from './lib/constants';
import { loadScrollyteller } from '@abcnews/svelte-scrollyteller';
import ScrollyWrapper from './components/ScrollyWrapper.svelte';

whenOdysseyLoaded.then(() => {
  const mounts = selectMounts('scrollyteller', { markAsUsed: false });
  mounts.forEach(appMountNode => {
    const configStr = getMountValue(appMountNode, 'scrollyteller');
    console.log('configStr :>> ', configStr);
    const id = configStr.match(/NAME([a-z0-9]+)/)?.[1];

    if (mounts.length > 1 && !id) {
      console.error(`IDs must be specified when multiple mounts are used. E.g. #${MARKER_NAME}1`);
      return;
    }

    try {
      console.log('id :>> ', id);
      const scrollyConfig = loadScrollyteller(id, 'u-full', 'mark');
      console.log('scrollyConfig  :>> ', scrollyConfig);
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

  // [appMountEl] = selectMounts('electionternaryplots');

  // if (appMountEl) {
  //   appProps = acto(getMountValue(appMountEl));

  //   mount(App, {
  //     target: appMountEl,
  //     props: appProps
  //   });
  // }
});

if (process.env.NODE_ENV === 'development') {
  console.debug(`[election-ternary-plots] public path: ${__webpack_public_path__}`);
}
