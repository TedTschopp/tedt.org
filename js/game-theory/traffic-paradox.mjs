import { loadSettings, settingValue } from './shared.mjs';

const CONGESTION = 1 / 100;
const FIXED_TIME = 45;
const clamp = (number, minimum, maximum) => Math.min(maximum, Math.max(minimum, number));

/** Symmetric, nonatomic path allocation. Tolls are generalized minutes, not delay. */
export function trafficAllocation({ demand = 4000, shortcutFlow = 0, toll = 0 } = {}) {
  if (!Number.isFinite(demand) || demand <= 0 || !Number.isFinite(shortcutFlow) || shortcutFlow < 0 || shortcutFlow > demand || !Number.isFinite(toll) || toll < 0) {
    throw new RangeError('Demand must be positive; shortcut flow must be between zero and demand; toll must be nonnegative.');
  }
  const outer = (demand - shortcutFlow) / 2;
  const edgeFlow = outer + shortcutFlow;
  const congestedTime = CONGESTION * edgeFlow;
  const flows = { top: outer, bottom: outer, shortcut: shortcutFlow };
  const times = { top: congestedTime + FIXED_TIME, bottom: congestedTime + FIXED_TIME, shortcut: 2 * congestedTime };
  const generalized = { ...times, shortcut: times.shortcut + toll };
  const totalTravel = 2 * CONGESTION * edgeFlow ** 2 + FIXED_TIME * (demand - shortcutFlow);
  const averageTravel = totalTravel / demand;
  return { demand, flows, edgeFlow, congestedTime, times, generalized, totalTravel, averageTravel,
    averageGeneralized: averageTravel + toll * shortcutFlow / demand };
}

export function solveTraffic({ demand = 4000, toll = 0, open = true } = {}) {
  const closed = trafficAllocation({ demand, toll });
  const equilibriumFlow = open ? clamp(2 * (FIXED_TIME - toll) / CONGESTION - demand, 0, demand) : 0;
  const optimumFlow = open ? clamp(FIXED_TIME / CONGESTION - demand, 0, demand) : 0;
  const equilibrium = trafficAllocation({ demand, shortcutFlow: equilibriumFlow, toll });
  const optimum = trafficAllocation({ demand, shortcutFlow: optimumFlow, toll });
  return { closed, equilibrium, optimum, open, toll,
    travelRatio: equilibrium.averageTravel / optimum.averageTravel,
    coordinatingToll: open ? Math.max(0, FIXED_TIME - CONGESTION * (demand + optimumFlow) / 2) : 0 };
}

export function mount(root) {
  loadSettings(root);
  const find = key => root.querySelector(`[data-traffic-${key}]`);
  const fmt = number => Number(number).toLocaleString('en-US', { maximumFractionDigits: 2 });
  const minutes = number => `${fmt(number)} min`;
  const routeNames = { top: 'upper route (S → A → T)', bottom: 'lower route (S → B → T)', shortcut: 'shortcut route (S → A → B → T)' };
  let model;
  let animationTimer;

  function settings() {
    root.querySelectorAll('input[data-setting]').forEach(control => {
      control.value = settingValue(control, control.value) ?? control.defaultValue;
    });
    return { demand: Number(find('demand').value), toll: Number(find('toll').value), open: find('open').value === 'open' };
  }

  function draw(allocation, after) {
    const svg = find('network');
    svg.setAttribute('data-closed', String(!model.open));
    find('edge-upper').textContent = `${fmt(allocation.edgeFlow)} ÷ 100 = ${minutes(allocation.congestedTime)}`;
    find('edge-lower').textContent = `${fmt(allocation.edgeFlow)} ÷ 100 = ${minutes(allocation.congestedTime)}`;
    find('shortcut-label').textContent = model.open ? `0 min + ${fmt(model.toll)} toll` : 'Closed';
    find('network-description').textContent = `${after ? 'After route adjustment' : 'Initial split'}. ${fmt(allocation.flows.top)} drivers use S to A to T; ${fmt(allocation.flows.bottom)} use S to B to T; ${fmt(allocation.flows.shortcut)} use S to A to B to T. Each congested edge takes ${minutes(allocation.congestedTime)}. Each outer fixed edge takes 45 minutes. The shortcut is ${model.open ? `open, with a toll equivalent to ${fmt(model.toll)} minutes` : 'closed'}.`;
    find('diagram-caption').textContent = `${after ? 'After drivers adjust their routes.' : 'Before drivers adjust: half start on each outer route.'} ${fmt(allocation.flows.top)} upper; ${fmt(allocation.flows.bottom)} lower; ${fmt(allocation.flows.shortcut)} shortcut. S → A and B → T each take ${minutes(allocation.congestedTime)}; A → T and S → B each take 45 min. The A → B shortcut is ${model.open ? `open (0 min, plus a ${fmt(model.toll)}-minute-value toll)` : 'closed'}.`;
  }

  function stopAnimation() {
    clearTimeout(animationTimer);
    find('network').classList.remove('is-running');
  }

  function animate(allocation) {
    stopAnimation();
    if (globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    find('network').classList.add('is-running');
    ['top', 'bottom', 'shortcut'].forEach(route => {
      find(`dot-${route}`).setAttribute('visibility', allocation.flows[route] > 0 ? 'visible' : 'hidden');
      find(`motion-${route}`).beginElement?.();
    });
    animationTimer = setTimeout(stopAnimation, 2400);
  }

  function reset() {
    stopAnimation();
    model = solveTraffic(settings());
    find('prediction').value = '';
    find('results').hidden = true;
    find('result').textContent = 'Make a prediction, then choose a route. Your choice represents a tiny share of all traffic.';
    find('choose-shortcut').disabled = !model.open;
    find('coordinating-toll').disabled = !model.open;
    find('math-values').textContent = `D = ${fmt(model.equilibrium.demand)}. Equilibrium shortcut flow z = ${fmt(model.equilibrium.flows.shortcut)}; coordinated shortcut flow z* = ${fmt(model.optimum.flows.shortcut)}. Equilibrium total travel is ${fmt(model.equilibrium.totalTravel)} driver-minutes, versus ${fmt(model.optimum.totalTravel)} under coordination. ${model.open ? `A shortcut toll of ${fmt(model.coordinatingToll)} generalized minutes supports the coordinated flow.` : 'With the shortcut closed, the equal outer-route split is both equilibrium and optimal.'}`;
    draw(model.closed, false);
  }

  function play(route) {
    const prediction = find('prediction').value;
    if (!prediction) {
      find('result').textContent = 'Choose your prediction first, then select a route.';
      find('prediction').focus();
      return;
    }
    const equilibrium = model.equilibrium;
    const delta = equilibrium.averageTravel - model.closed.averageTravel;
    const actual = Math.abs(delta) < 1e-8 ? 'same' : delta > 0 ? 'slower' : 'faster';
    const predictionText = prediction === actual ? 'Your prediction matches the result.' : `The result is ${actual}, compared with keeping the shortcut closed.`;
    find('result').textContent = `You chose the ${routeNames[route]}. Before others adjusted, that route took ${minutes(model.closed.times[route])}. After adjustment, your chosen route takes ${minutes(equilibrium.times[route])}${route === 'shortcut' && model.toll > 0 ? `, plus a toll valued at ${fmt(model.toll)} minutes` : ''}. Everyone’s average travel time is ${minutes(equilibrium.averageTravel)}. ${predictionText} ${Math.abs(equilibrium.generalized[route] - Math.min(...Object.entries(equilibrium.generalized).filter(([key]) => model.open || key !== 'shortcut').map(([, value]) => value))) > 1e-8 ? 'Your chosen route is more costly than the routes drivers use at equilibrium; you have an incentive to switch.' : 'Your route is a best response once the others have adjusted.'}`;
    find('results').hidden = false;
    find('closed-time').textContent = minutes(model.closed.averageTravel);
    find('equilibrium-time').textContent = minutes(equilibrium.averageTravel);
    find('optimum-time').textContent = minutes(model.optimum.averageTravel);
    find('ratio').textContent = `${fmt(model.travelRatio)}×`;
    for (const routeName of ['top', 'bottom', 'shortcut']) {
      find(`flow-${routeName}`).textContent = !model.open && routeName === 'shortcut' ? 'Closed' : fmt(equilibrium.flows[routeName]);
      find(`time-${routeName}`).textContent = !model.open && routeName === 'shortcut' ? '—' : minutes(equilibrium.times[routeName]);
      find(`cost-${routeName}`).textContent = !model.open && routeName === 'shortcut' ? '—' : minutes(equilibrium.generalized[routeName]);
      find(`optimum-${routeName}`).textContent = !model.open && routeName === 'shortcut' ? 'Closed' : fmt(model.optimum.flows[routeName]);
    }
    const bestCost = Math.min(...Object.entries(equilibrium.generalized).filter(([key]) => model.open || key !== 'shortcut').map(([, value]) => value));
    find('incentives').textContent = `Every route drivers use has the same lowest time-plus-toll value: ${minutes(bestCost)}. One driver cannot do better by switching alone. This is called an equilibrium. ${model.toll > 0 ? `Drivers count the fee as well as the drive. The average time-plus-toll value is ${minutes(equilibrium.averageGeneralized)}, but the fee adds no driving time.` : 'With no toll, drivers simply choose the quickest trip.'} The best shared plan makes the sum of everyone’s driving minutes as small as possible. Some people may have a longer trip to make that happen. The comparison is ${fmt(model.travelRatio)} times the best-plan average (about ${fmt((model.travelRatio - 1) * 100)}% longer).`;
    draw(equilibrium, true);
    animate(equilibrium);
  }

  for (const route of ['top', 'bottom', 'shortcut']) find(`choose-${route}`).addEventListener('click', () => play(route));
  find('coordinating-toll').addEventListener('click', () => {
    find('toll').value = model.coordinatingToll;
    find('toll').dispatchEvent(new Event('change', { bubbles: true }));
    find('result').textContent = `The toll now feels as costly as ${fmt(model.toll)} extra minutes, although it adds no driving time. Predict again, then choose a route to see whether drivers reach the best shared plan.`;
  });
  root.querySelectorAll('[data-setting]').forEach(control => control.addEventListener('change', reset));
  reset();
  return { reset };
}
