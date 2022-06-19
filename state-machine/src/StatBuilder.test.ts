import mergeDeepRight from 'ramda/src/mergeDeepRight.js';
import { record } from './StatBuilder';
import { DeepPartial, Player } from './types';

const defaultPlayer = (): Player => {
    return {
        name: 'test',
        offenseStats: {
            atbats: 0,
            hits: 0,
            strikeoutsSwinging: 0,
            strikeoutsLooking: 0,
            walks: 0,
            singles: 0,
            doubles: 0,
            triples: 0,
            homeruns: 0,
            RBI: 0,
            runs: 0,
        },
        defenseStats: {
            strikeoutsSwinging: 0,
            strikeoutsLooking: 0,
            walks: 0,
            saves: 0,
            earnedRuns: 0,
            inningsPitched: 0,
            infieldErrors: 0,
            groundOuts: 0,
            flyOuts: 0,
            DPA: 0,
            DPSuccess: 0,
        }
    };
};

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
        const diff: DeepPartial<Player> = { offenseStats: { hits: 1, singles: 1 } };
        expect(mergeDeepRight(initial, diff)).toEqual(builder.done());
    });
});

describe('combo functions', () => {
    test('[Single]: singles, hits, rbis (none)', () => {
        const initial = defaultPlayer();
        const builder = record(initial).single();
        const diff: DeepPartial<Player> = { offenseStats: { hits: 1, singles: 1 } };
        expect(mergeDeepRight(initial, diff)).toEqual(builder.done());
    });

    test('[Single]: singles, hits, rbis (1)', () => {
        const initial = defaultPlayer();
        const builder = record(initial).single(1);
        const diff: DeepPartial<Player> = { offenseStats: { hits: 1, singles: 1, RBI: 1 } };
        expect(mergeDeepRight(initial, diff)).toEqual(builder.done());
    });

    test('[Double]: doubles, hits, rbis (none)', () => {
        const initial = defaultPlayer();
        const builder = record(initial).double();
        const diff: DeepPartial<Player> = { offenseStats: { hits: 1, doubles: 1 } };
        expect(mergeDeepRight(initial, diff)).toEqual(builder.done());
    });

    test('[Double]: doubles, hits, rbis (1)', () => {
        const initial = defaultPlayer();
        const builder = record(initial).double(1);
        const diff: DeepPartial<Player> = { offenseStats: { hits: 1, doubles: 1, RBI: 1 } };
        expect(mergeDeepRight(initial, diff)).toEqual(builder.done());
    });

    test('[Triple]: triples, hits, rbis (none)', () => {
        const initial = defaultPlayer();
        const builder = record(initial).triple();
        const diff: DeepPartial<Player> = { offenseStats: { hits: 1, triples: 1 } };
        expect(mergeDeepRight(initial, diff)).toEqual(builder.done());
    });

    test('[Triple]: triples, hits, rbis (1)', () => {
        const initial = defaultPlayer();
        const builder = record(initial).triple(1);
        const diff: DeepPartial<Player> = { offenseStats: { hits: 1, triples: 1, RBI: 1 } };
        expect(mergeDeepRight(initial, diff)).toEqual(builder.done());
    });

    test('[Homerun]: homeruns, hits, rbis (none), runs', () => {
        const initial = defaultPlayer();
        const builder = record(initial).homerun();
        const diff: DeepPartial<Player> = { offenseStats: { hits: 1, homeruns: 1, RBI: 1, runs: 1 } };
        expect(mergeDeepRight(initial, diff)).toEqual(builder.done());
    });

    test('[Homerun]: homeruns, hits, rbis (1), runs', () => {
        const initial = defaultPlayer();
        const builder = record(initial).homerun(2);
        const diff: DeepPartial<Player> = { offenseStats: { hits: 1, homeruns: 1, RBI: 2, runs: 1 } };
        expect(mergeDeepRight(initial, diff)).toEqual(builder.done());
    });
});
