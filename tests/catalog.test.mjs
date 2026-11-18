import assert from 'node:assert/strict';
import test from 'node:test';
import { plainCatalogText } from '../src/lib/catalog.ts';

test('remove a marcação visual da Valorant-API preservando o texto', () => {
  assert.equal(plainCatalogText('EQUIPE <whitebold>Incendiário</>. Causa <debuffred>dano</> e dá <teal>aceleração</>.'), 'EQUIPE Incendiário. Causa dano e dá aceleração.');
  assert.equal(plainCatalogText('Use quando a distância for < 10 m.'), 'Use quando a distância for < 10 m.');
});
