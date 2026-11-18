import assert from 'node:assert/strict';
import test from 'node:test';
import { parseRiotId, formatKd } from '../src/lib/player.ts';

test('Riot ID mantém espaços internos e exige nome e tag', () => {
  assert.deepEqual(parseRiotId('  Nome Com Espaço # BR1  '), { name: 'Nome Com Espaço', tag: 'BR1' });
  for (const invalid of ['nome', 'nome#', '#tag', 'a#b#c', 'a\nb#tag']) {
    assert.equal(parseRiotId(invalid), null);
  }
});

test('K/D usa o total de abates e mortes e distingue a falta de partidas', () => {
  assert.equal(formatKd([{ kills: 20, deaths: 10 }, { kills: 5, deaths: 15 }]), '1,00');
  assert.equal(formatKd([{ kills: 3, deaths: 0 }]), '∞');
  assert.equal(formatKd([{ kills: 0, deaths: 0 }]), '—');
  assert.equal(formatKd([]), '—');
});
