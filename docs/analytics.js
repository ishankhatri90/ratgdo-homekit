const RELEASE_API = "https://api.github.com/repos/ishankhatri90/ratgdo-homekit/releases/tags/v2.2.5-1mb";
const RELEASE_DOWNLOAD = "https://github.com/ishankhatri90/ratgdo-homekit/releases/download/v2.2.5-1mb/";

document.addEventListener("click", (event) => {
  const trigger = event.composedPath().find(
    (node) => node instanceof HTMLElement && node.matches("[data-install-counter]"),
  );
  if (!trigger) return;

  const asset = trigger.dataset.installCounter;
  if (!/^[a-z0-9.-]+\.txt$/.test(asset)) return;

  // This request contains no site-assigned identifier, cookie, or page data.
  // GitHub increments the public release-asset download counter.
  fetch(`${RELEASE_DOWNLOAD}${asset}?attempt=${Date.now()}`, {
    mode: "no-cors",
    cache: "no-store",
    keepalive: true,
  }).catch(() => {});
}, { capture: true });

const analyticsRoot = document.querySelector("[data-analytics-dashboard]");

if (analyticsRoot) {
  const number = new Intl.NumberFormat();
  const tracked = {
    "homekit": {
      attempt: "install-homekit-2.2.5-1mb.txt",
      download: "ratgdo-homekit-2.2.5-esp8266-1mb.bin",
    },
    "esphome-secplus2": {
      attempt: "install-esphome-secplus2-1mb.txt",
      download: "esphome-ratgdo-v25-1mb-secplus2.bin",
    },
    "esphome-secplus1": {
      attempt: "install-esphome-secplus1-1mb.txt",
      download: "esphome-ratgdo-v25-1mb-secplus1.bin",
    },
  };

  fetch(RELEASE_API, { headers: { Accept: "application/vnd.github+json" } })
    .then((response) => {
      if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
      return response.json();
    })
    .then((release) => {
      const counts = new Map(release.assets.map((asset) => [asset.name, asset.download_count]));
      let attemptTotal = 0;
      let downloadTotal = 0;

      for (const [key, assets] of Object.entries(tracked)) {
        const attempts = counts.get(assets.attempt) ?? 0;
        const downloads = counts.get(assets.download) ?? 0;
        attemptTotal += attempts;
        downloadTotal += downloads;
        document.querySelector(`[data-count="${key}-attempts"]`).textContent = number.format(attempts);
        document.querySelector(`[data-count="${key}-downloads"]`).textContent = number.format(downloads);
      }

      document.querySelector('[data-count="total-attempts"]').textContent = number.format(attemptTotal);
      document.querySelector('[data-count="total-downloads"]').textContent = number.format(downloadTotal);
      document.querySelector("[data-analytics-updated]").textContent = `Live GitHub totals · refreshed ${new Date().toLocaleString()}`;
      analyticsRoot.dataset.state = "ready";
    })
    .catch((error) => {
      document.querySelector("[data-analytics-updated]").textContent = `Counts unavailable: ${error.message}`;
      analyticsRoot.dataset.state = "error";
    });
}
