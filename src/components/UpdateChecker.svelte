<script lang="ts">
  import { onMount } from 'svelte';
  import Modal from './Modal.svelte';

  let newVersion = $state<{ newVersion: string; thisVersion: string; url: string }>();
  let isOpen = $state(false);

  /**
   * Check for a new version of the given project
   * @param {string} projectName - Project name (e.g. 'globey')
   * @param {string} startingAt - Version to start checking at (e.g. '1.0.0')
   */
  async function newVersionCheck(projectName = '', startingAt = '') {
    console.log('checking for new version of', projectName, { startingAt });
    const baseUrl = `https://www.abc.net.au/res/sites/news-projects/${projectName}/`;
    let newVersion;
    let latestVersion = startingAt;
    let i = 0;
    do {
      if (i++ > 30) {
        // just in case something messes up
        break;
      }
      const [major, minor, patch] = latestVersion.split('.');
      const nextVersions = [
        [1 + Number(major), 0, 0],
        [major, 1 + Number(minor), 0],
        [major, minor, 1 + Number(patch)]
      ].map(version => version.join('.'));
      const newVersions = await Promise.all(
        nextVersions.map(version => {
          const url = `${baseUrl}${version}/index.html`;
          console.info('checking new version at', url);
          return fetch(url, { cache: 'no-store' })
            .then(response => (response.status !== 200 ? false : version))
            .catch(() => false);
        })
      );

      // @ts-ignore - there is no way for latestVersion to be `true`, only truthy.
      latestVersion = newVersions.find(Boolean) || '';
      if (latestVersion) {
        newVersion = latestVersion;
      }
    } while (latestVersion);

    return { thisVersion: startingAt, newVersion, url: `${baseUrl}${newVersion}` };
  }

  async function check() {
    if (newVersion?.newVersion) {
      return;
    }
    const [projectName, thisVersion] =
      window.location.pathname.match(/\/news-projects\/([^/]+)\/(\d+\.\d+\.\d+)/)?.slice(1) || [];
    if (!thisVersion) {
      return;
    }
    const result = await newVersionCheck(projectName, thisVersion);

    if (result.newVersion) {
      newVersion = result;
      isOpen = true;
    }
  }

  onMount(() => {
    check();
    window.addEventListener('focus', check);
    const timeout = setInterval(check, 1000 * 60 * 10);
    return () => {
      window.removeEventListener('focus', check);
      clearInterval(timeout);
    };
  });

  function onClick() {
    // @ts-ignore
    window.location = `${newVersion.url}/${window.location.hash}`;
  }

  function onClose() {
    isOpen = false;
  }
</script>

{#snippet Buttons()}
  <button onclick={onClick}>Open new builder</button>
{/snippet}

{#if isOpen && newVersion?.newVersion}
  <Modal title="New version available" {onClose} footerChildren={Buttons}>
    <p>You are using <code>{newVersion.thisVersion}</code> but <code>{newVersion.newVersion}</code> is available.</p>

    <p>
      Your current state will be brought across to the new version, and you can always click back to return to this
      page.
    </p>
  </Modal>
{/if}

<style lang="scss">
  p {
    max-width: 32em;
  }
</style>
