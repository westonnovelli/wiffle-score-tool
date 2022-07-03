import mergeDeepRight from 'ramda/src/mergeDeepRight.js';
import { defaultPlayer } from '../factory';
import { record } from './statBuilder';
import { DeepPartial, Player } from '../types';

describe('basics', () => {
    test('statsBuilder returns the same player when not edited', () => {
        const initial = defaultPlayer();
        const builder = record(initial);
        expect(initial).toEqual(builder.done());
    });

    test('statsBuilder changes only the stat adjusted', () => {
        const initial = defaultPlayer();
        const builder = record(initial).offense('hits', 1);
        const diff: DeepPartial<Player> = { offenseStats: { hits: 1 } };
        expect(builder.done()).toEqual(mergeDeepRight(initial, diff));
    });

    test('statsBuilder changes multiple stats', () => {
        const initial = defaultPlayer();
        const builder = record(initial).offense('hits', 1).offense('singles', 1);
        const diff: DeepPartial<Player> = { offenseStats: { hits: 1, singles: 1 } };
        expect(builder.done()).toEqual(mergeDeepRight(initial, diff));
    });

    test('statsBuilder can change the same stat multiple times', () => {
        const initial = defaultPlayer();
        const builder = record(initial).offense('hits', 1).offense('hits', 1);
        const diff: DeepPartial<Player> = { offenseStats: { hits: 2, } };
        expect(builder.done()).toEqual(mergeDeepRight(initial, diff));
    });

    test('statsBuilder combo function chains stats changes together', () => {
        const initial = defaultPlayer();
        const builder = record(initial).single();
        const diff: DeepPartial<Player> = { offenseStats: { hits: 1, singles: 1, atbats: 1 } };
        expect(builder.done()).toEqual(mergeDeepRight(initial, diff));
    });
});

describe('combo functions', () => {
    test('[Single]: singles, hits', () => {
        const initial = defaultPlayer();
        const builder = record(initial).single();
        const diff: DeepPartial<Player> = { offenseStats: { hits: 1, singles: 1, atbats: 1 } };
        expect(builder.done()).toEqual(mergeDeepRight(initial, diff));
    });

    test('[Double]: doubles, hits', () => {
        const initial = defaultPlayer();
        const builder = record(initial).double();
        const diff: DeepPartial<Player> = { offenseStats: { hits: 1, doubles: 1, atbats: 1 } };
        expect(builder.done()).toEqual(mergeDeepRight(initial, diff));
    });

    test('[Triple]: triples, hits', () => {
        const initial = defaultPlayer();
        const builder = record(initial).triple();
        const diff: DeepPartial<Player> = { offenseStats: { hits: 1, triples: 1, atbats: 1 } };
        expect(builder.done()).toEqual(mergeDeepRight(initial, diff));
    });

    test('[Homerun]: homeruns, hits, runs', () => {
        const initial = defaultPlayer();
        const builder = record(initial).homerun();
        const diff: DeepPartial<Player> = { offenseStats: { hits: 1, homeruns: 1, runs: 1, atbats: 1 } };
        expect(builder.done()).toEqual(mergeDeepRight(initial, diff));
    });
});
