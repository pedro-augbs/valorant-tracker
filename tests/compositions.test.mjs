import assert from 'node:assert/strict';
import test from 'node:test';
import { compositions, alternatives } from '../src/lib/compositions.ts';

test('cada mapa tem duas formações distintas com cinco agentes e suas contribuições', () => {
  assert.equal(Object.keys(compositions).length, 13);
  assert.deepEqual(Object.keys(alternatives).sort(), Object.keys(compositions).sort());
  for (const [id, primary] of Object.entries(compositions)) {
    const alternative = alternatives[id];
    assert.ok(alternative.title);
    for (const picks of [primary, alternative.picks]) {
      assert.equal(picks.length, 5);
      assert.equal(new Set(picks.map(([agent]) => agent)).size, 5);
      assert.ok(picks.every(([agent, contribution]) => agent && contribution));
    }
    assert.notDeepEqual(primary.map(([agent]) => agent).sort(), alternative.picks.map(([agent]) => agent).sort());
  }
});
