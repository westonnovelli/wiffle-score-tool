import mergeDeepRight from 'ramda/src/mergeDeepRight.js';
import { defaultPlayer } from './factory';
import { record } from './StatBuilder';
import { DeepPartial, Player } from './types';

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
        expect(mergeDeepRight(initial, diff)).toEqual(builder.done());
    });

    test('statsBuilder changes multiple stats', () => {
        const initial = defaultPlayer();
        const builder = record(initial).offense('hits', 1).offense('singles', 1);
        const diff: DeepPartial<Player> = { offenseStats: { hits: 1, singles: 1 } };
        expect(mergeDeepRight(initial, diff)).toEqual(builder.done());
    });

    test('statsBuilder can change the same stat multiple times', () => {
        const initial = defaultPlayer();
        const builder = record(initial).offense('hits', 1).offense('hits', 1);
        const diff: DeepPartial<Player> = { offenseStats: { hits: 2, } };
        expect(mergeDeepRight(initial, diff)).toEqual(builder.done());
    });

    test('statsBuilder combo function chains stats changes together', () => {
        const initial = defaultPlayer();
        const builder = record(initial).single();
        const diff: DeepPartial<Player> = { offenseStats: { hits: 1, singles: 1, atbats: 1 } };
        expect(mergeDeepRight(initial, diff)).toEqual(builder.done());
    });
});

describe('combo functions', () => {
    test('[Single]: singles, hits, rbis (none)', () => {
        const initial = defaultPlayer();
        const builder = record(initial).single();
        const diff: DeepPartial<Player> = { offenseStats: { hits: 1, singles: 1, atbats: 1 } };
        expect(mergeDeepRight(initial, diff)).toEqual(builder.done());
    });

    test('[Single]: singles, hits, rbis (1)', () => {
        const initial = defaultPlayer();
        const builder = record(initial).single(1);
        const diff: DeepPartial<Player> = { offenseStats: { hits: 1, singles: 1, RBI: 1, atbats: 1 } };
        expect(mergeDeepRight(initial, diff)).toEqual(builder.done());
    });

    test('[Double]: doubles, hits, rbis (none)', () => {
        const initial = defaultPlayer();
        const builder = record(initial).double();
        const diff: DeepPartial<Player> = { offenseStats: { hits: 1, doubles: 1, atbats: 1 } };
        expect(mergeDeepRight(initial, diff)).toEqual(builder.done());
    });

    test('[Double]: doubles, hits, rbis (1)', () => {
        const initial = defaultPlayer();
        const builder = record(initial).double(1);
        const diff: DeepPartial<Player> = { offenseStats: { hits: 1, doubles: 1, RBI: 1, atbats: 1 } };
        expect(mergeDeepRight(initial, diff)).toEqual(builder.done());
    });

    test('[Triple]: triples, hits, rbis (none)', () => {
        const initial = defaultPlayer();
        const builder = record(initial).triple();
        const diff: DeepPartial<Player> = { offenseStats: { hits: 1, triples: 1, atbats: 1 } };
        expect(mergeDeepRight(initial, diff)).toEqual(builder.done());
    });

    test('[Triple]: triples, hits, rbis (1)', () => {
        const initial = defaultPlayer();
        const builder = record(initial).triple(1);
        const diff: DeepPartial<Player> = { offenseStats: { hits: 1, triples: 1, RBI: 1, atbats: 1 } };
        expect(mergeDeepRight(initial, diff)).toEqual(builder.done());
    });

    test('[Homerun]: homeruns, hits, rbis (none), runs', () => {
        const initial = defaultPlayer();
        const builder = record(initial).homerun();
        const diff: DeepPartial<Player> = { offenseStats: { hits: 1, homeruns: 1, RBI: 1, runs: 1, atbats: 1 } };
        expect(mergeDeepRight(initial, diff)).toEqual(builder.done());
    });

    test('[Homerun]: homeruns, hits, rbis (1), runs', () => {
        const initial = defaultPlayer();
        const builder = record(initial).homerun(2);
        const diff: DeepPartial<Player> = { offenseStats: { hits: 1, homeruns: 1, RBI: 2, runs: 1, atbats: 1 } };
        expect(mergeDeepRight(initial, diff)).toEqual(builder.done());
    });
});
