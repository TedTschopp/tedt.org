import { scenarioURL, settingValue } from './shared.mjs';

const modules = {
  'trust-machine': () => import('./trust-machine.mjs'),
  'equilibrium-explorer': () => import('./equilibrium-explorer.mjs'),
  'coordination-trap': () => import('./coordination-trap.mjs'),
  'mixed-strategy': () => import('./mixed-strategy.mjs'),
  'credible-threat': () => import('./credible-threat.mjs'),
  'traffic-paradox': () => import('./traffic-paradox.mjs'),
  'public-goods': () => import('./public-goods.mjs'),
  'last-fish': () => import('./last-fish.mjs'),
  'bargaining-room': () => import('./bargaining-room.mjs'),
  'auction-lab': () => import('./auction-lab.mjs'),
  'signaling-game': () => import('./signaling-game.mjs'),
  'expectations-game': () => import('./expectations-game.mjs'),
  'common-knowledge': () => import('./common-knowledge.mjs'),
  'evolution-arena': () => import('./evolution-arena.mjs'),
  'correlation-experiment': () => import('./correlation-experiment.mjs'),
  'stable-matching': () => import('./stable-matching.mjs'),
  'coalition-calculator': () => import('./coalition-calculator.mjs'),
  'voting-lab': () => import('./voting-lab.mjs'),
  'incentive-designer': () => import('./incentive-designer.mjs'),
  'mechanism-design': () => import('./mechanism-design.mjs')
};

const root = document.querySelector('#gt-experiment');
if (root && modules[root.dataset.experiment]) {
  const status = document.querySelector('#gt-status');
  // Normalize typed values before the experiment's own change handlers run.
  root.addEventListener('change', event => {
    const control = event.target;
    if (!control.matches('[data-setting]')) return;
    const value = settingValue(control, control.value);
    if (control.type !== 'checkbox') control.value = value ?? control.defaultValue;
    document.querySelector('#gt-share-output').hidden = true;
    status.textContent = 'Settings changed. The experiment has restarted.';
  }, true);
  try {
    const experiment = await modules[root.dataset.experiment]();
    const instance = experiment.mount(root);
    document.querySelector('#gt-reset').disabled = false;
    document.querySelector('#gt-share').disabled = false;
    document.querySelector('#gt-loading').hidden = true;
    root.dataset.ready = 'true';
    document.querySelector('#gt-reset').addEventListener('click', () => {
      instance.reset();
      status.textContent = 'Restarted with these settings. Repeat the same choices to replay a seeded experiment.';
    });
    document.querySelector('#gt-share').addEventListener('click', async () => {
      const url = scenarioURL(root);
      const output = document.querySelector('#gt-share-output');
      const field = document.querySelector('#gt-share-url');
      field.value = url;
      output.hidden = false;
      try {
        await navigator.clipboard.writeText(url);
        status.textContent = 'Scenario link copied. It includes settings and the seed, but not your play history.';
      } catch {
        field.focus();
        field.select();
        status.textContent = 'Your scenario link is ready below. Copy it to share these settings.';
      }
    });
  } catch (error) {
    document.querySelector('#gt-loading').textContent = 'The experiment could not load. Refresh to try again. The explanation and assumptions below are still available.';
    console.error('Game Theory Playground failed to load:', error);
  }
}
