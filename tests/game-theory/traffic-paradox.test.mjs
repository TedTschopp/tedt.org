import test from 'node:test';
import assert from 'node:assert/strict';
import { trafficAllocation, solveTraffic } from '../../js/game-theory/traffic-paradox.mjs';

const close = (actual, expected, message = '') => assert.ok(Math.abs(actual - expected) < 1e-8, `${message}: ${actual} ≠ ${expected}`);

test('classic Braess example has 65-minute closed and 80-minute open equilibrium', () => {
  const result = solveTraffic();
  close(result.closed.averageTravel, 65);
  close(result.equilibrium.averageTravel, 80);
  assert.deepEqual(result.equilibrium.flows, { top: 0, bottom: 0, shortcut: 4000 });
  close(result.equilibrium.times.top, 85);
});

test('coordinated optimum retains some shortcut traffic and beats closing the road', () => {
  const result = solveTraffic();
  assert.deepEqual(result.optimum.flows, { top: 1750, bottom: 1750, shortcut: 500 });
  close(result.optimum.averageTravel, 64.6875);
  close(result.optimum.totalTravel, 258750);
  assert.ok(result.optimum.averageTravel < result.closed.averageTravel);
});

test('coordinating toll supports optimum but tolls remain separate from travel time', () => {
  const result = solveTraffic({ toll: 22.5 });
  assert.deepEqual(result.equilibrium.flows, result.optimum.flows);
  close(result.equilibrium.averageTravel, 64.6875);
  close(result.equilibrium.averageGeneralized, 67.5);
  close(result.equilibrium.times.shortcut, 45);
  close(result.equilibrium.generalized.shortcut, 67.5);
  close(result.travelRatio, 1);
});

test('closure removes shortcut even if it would otherwise be cheaper', () => {
  const result = solveTraffic({ open: false, demand: 1000 });
  close(result.equilibrium.averageTravel, 50);
  close(result.equilibrium.flows.shortcut, 0);
  close(result.travelRatio, 1);
});

test('a shortcut helps at low demand and a high toll leaves it unused', () => {
  const low = solveTraffic({ demand: 1000 });
  close(low.equilibrium.averageTravel, 20);
  assert.ok(low.equilibrium.averageTravel < low.closed.averageTravel);
  const highToll = solveTraffic({ toll: 60 });
  close(highToll.equilibrium.flows.shortcut, 0);
  close(highToll.equilibrium.averageTravel, 65);
});

test('conservation, equilibrium incentives and optimality hold across sandbox bounds', () => {
  for (let demand = 1000; demand <= 8000; demand += 100) {
    for (let toll = 0; toll <= 60; toll += 0.5) {
      const result = solveTraffic({ demand, toll });
      const eq = result.equilibrium;
      close(Object.values(eq.flows).reduce((sum, value) => sum + value, 0), demand);
      const minimumCost = Math.min(...Object.values(eq.generalized));
      for (const route of Object.keys(eq.flows)) {
        assert.ok(eq.flows[route] >= 0);
        if (eq.flows[route] > 1e-8) close(eq.generalized[route], minimumCost);
      }
      assert.ok(result.optimum.averageTravel <= eq.averageTravel + 1e-8);
      assert.ok(result.optimum.averageTravel <= result.closed.averageTravel + 1e-8);
      for (const offset of [-100, -1, 1, 100]) {
        const z = result.optimum.flows.shortcut + offset;
        if (z >= 0 && z <= demand) assert.ok(trafficAllocation({ demand, shortcutFlow: z }).averageTravel >= result.optimum.averageTravel - 1e-8);
      }
    }
    const optimum = solveTraffic({ demand });
    const implemented = solveTraffic({ demand, toll: optimum.coordinatingToll });
    close(implemented.equilibrium.averageTravel, optimum.optimum.averageTravel);
  }
});

test('invalid flow and demand are rejected instead of producing meaningless averages', () => {
  for (const options of [{ demand: 0 }, { demand: -1 }, { demand: NaN }, { shortcutFlow: 5000 }, { shortcutFlow: -1 }, { toll: -1 }]) {
    assert.throws(() => trafficAllocation(options), RangeError);
  }
});
