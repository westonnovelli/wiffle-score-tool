import mergeDeepRight from 'ramda/src/mergeDeepRight.js';

import { GameMoment, DeepPartial, Pitches, InningHalf, Bases } from './types';
import { pitch } from './gameReducer';
import { noStatsGame } from './factory';

describe('[5.02]', () => {
    test('a 3rd out ends an inning half (TOP becomes BOTTOM)', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { outs: 2 });
        const thrown: Pitches = Pitches.INPLAY_OUTFIELD_OUT;
        const diff: DeepPartial<GameMoment> = {
            outs: 0,
            inning: {
                number: 1,
                half: InningHalf.BOTTOM
            },
            atBat: 'playerA',
            nextHalfAtBat: 'playerB'
        };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('an ending of a inning bottom becomes the top of the next', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { outs: 2, inning: { half: InningHalf.BOTTOM } });
        const thrown: Pitches = Pitches.INPLAY_OUTFIELD_OUT;
        const diff: DeepPartial<GameMoment> = { outs: 0, inning: { number: 2, half: InningHalf.TOP }, atBat: 'playerA', nextHalfAtBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });
});

describe('[5.03]', () => {
    test('B: a ball increments ball count', () => {
        const initial: GameMoment = noStatsGame();
        const thrown: Pitches = Pitches.BALL;
        const diff: DeepPartial<GameMoment> = { count: { balls: 1 } };

        expect(pitch(initial, thrown).count).toEqual(mergeDeepRight(initial, diff).count);
    });

    test('W: a 4th ball is an walk, resets count', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { count: { balls: 3 } });
        const thrown: Pitches = Pitches.BALL;
        const diff: DeepPartial<GameMoment> = { count: { balls: 0 }, bases: { [Bases.FIRST]: 1 }, atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('S: a strike (swinging) increments strike count', () => {
        const initial: GameMoment = noStatsGame();
        const thrown: Pitches = Pitches.STRIKE_SWINGING;
        const diff: DeepPartial<GameMoment> = { count: { strikes: 1 } };

        expect(pitch(initial, thrown).count).toEqual(mergeDeepRight(initial, diff).count);
    });

    test('K: a 3rd strike (swinging) is an out, resets count', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { count: { strikes: 2 } });
        const thrown: Pitches = Pitches.STRIKE_SWINGING;
        const diff: DeepPartial<GameMoment> = { outs: 1, count: { strikes: 0, balls: 0 }, atBat: 'playerB' };

        expect(pitch(initial, thrown).count).toEqual(mergeDeepRight(initial, diff).count);
    });

    test('K: an strikeout with 2 outs ends an inning', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { outs: 2 });
        const thrown: Pitches = Pitches.STRIKE_LOOKING;
        const diff: DeepPartial<GameMoment> = { outs: 0, inning: { number: 1, half: InningHalf.BOTTOM }, atBat: 'playerA', nextHalfAtBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('F: a strike (foul) increments strike count', () => {
        const initial: GameMoment = noStatsGame();
        const thrown: Pitches = Pitches.STRIKE_FOUL;
        const diff: DeepPartial<GameMoment> = { count: { strikes: 1 } };

        expect(pitch(initial, thrown).count).toEqual(mergeDeepRight(initial, diff).count);
    });

    test('F: a strike (foul) maxes strike count at 2', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { count: { strikes: 2 } });
        const thrown: Pitches = Pitches.STRIKE_FOUL;
        const diff: DeepPartial<GameMoment> = {};

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('K*: with 2 strikes, a strike (foul into the zone) is an out, resets count', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { count: { strikes: 2 } });
        const thrown: Pitches = Pitches.STRIKE_FOUL_ZONE;
        const diff: DeepPartial<GameMoment> = { outs: 1, count: { strikes: 0, balls: 0 }, atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    describe('[5.03.01]', () => {
        test('K: a strike (looking) is an out, resets count', () => {
            const initial: GameMoment = noStatsGame();
            const thrown: Pitches = Pitches.STRIKE_LOOKING;
            const diff: DeepPartial<GameMoment> = { outs: 1, count: { strikes: 0, balls: 0 }, atBat: 'playerB' };

            expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
        });
    });

    describe('[5.03.02]', () => {
        test('WP: a ball (wild pitch) increments ball count', () => {
            const initial: GameMoment = noStatsGame();
            const thrown: Pitches = Pitches.BALL_WILD;
            const diff: DeepPartial<GameMoment> = { count: { balls: 1 } };

            expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
        });

        test('WP: all runners advance 1 base on a wild pitch, runners can score', () => {
            const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.FIRST]: 1 } });
            const thrown: Pitches = Pitches.BALL_WILD;
            const diff: DeepPartial<GameMoment> = { bases: { [Bases.FIRST]: 0, [Bases.SECOND]: 1 } };

            expect(pitch(initial, thrown).bases).toEqual(mergeDeepRight(initial, diff).bases);


            const initial2: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.THIRD]: 1 } });
            const thrown2: Pitches = Pitches.BALL_WILD;
            const diff2: DeepPartial<GameMoment> = { bases: { [Bases.THIRD]: 0 }, boxScore: [{ home: 0, away: 1 }], count: { balls: 1, strikes: 0 } };

            expect(pitch(initial2, thrown2)).toEqual(mergeDeepRight(initial2, diff2));
        });

        test('WP: that is a walk, runners only move the single base', () => {
            const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.FIRST]: 1 }, count: { balls: 3 } });
            const thrown: Pitches = Pitches.BALL_WILD;
            const diff: DeepPartial<GameMoment> = { bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1 }, atBat: 'playerB' };

            expect(pitch(initial, thrown).bases).toEqual(mergeDeepRight(initial, diff).bases);
        });
    });
});

describe('[6.01]', () => {
    test('O: an infield ground out, is an out, resets count', () => {
        const initial: GameMoment = noStatsGame();
        const thrown: Pitches = Pitches.INPLAY_INFIELD_GRD_OUT;
        const diff: DeepPartial<GameMoment> = { outs: 1, count: { strikes: 0, balls: 0 }, atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });
});

describe('[6.02]', () => {
    test('1.000: an infield error behaves as a single', () => {
        const initial: GameMoment = noStatsGame();
        const thrown: Pitches = Pitches.INPLAY_INFIELD_ERROR;
        const diff: DeepPartial<GameMoment> = { bases: { [Bases.FIRST]: 1 }, atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('1.100: an infield error advances all runners 1 base', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.FIRST]: 1 } });
        const thrown: Pitches = Pitches.INPLAY_INFIELD_ERROR;
        const diff: DeepPartial<GameMoment> = { bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1 }, atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('1.020: an infield error advances all runners 1 base', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.SECOND]: 1 } });
        const thrown: Pitches = Pitches.INPLAY_INFIELD_ERROR;
        const diff: DeepPartial<GameMoment> = { bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 0, [Bases.THIRD]: 1, }, atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('1.003: an infield error advances all runners 1 base', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.THIRD]: 1 } });
        const thrown: Pitches = Pitches.INPLAY_INFIELD_ERROR;
        const diff: DeepPartial<GameMoment> = { bases: { [Bases.FIRST]: 1, [Bases.THIRD]: 0, }, boxScore: [{ home: 0, away: 1 }], atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('1.120: an infield error advances all runners 1 base', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1 } });
        const thrown: Pitches = Pitches.INPLAY_INFIELD_ERROR;
        const diff: DeepPartial<GameMoment> = { bases: { [Bases.THIRD]: 1, }, atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('1.103: an infield error advances all runners 1 base', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.FIRST]: 1, [Bases.THIRD]: 1 } });
        const thrown: Pitches = Pitches.INPLAY_INFIELD_ERROR;
        const diff: DeepPartial<GameMoment> = { bases: { [Bases.SECOND]: 1, [Bases.THIRD]: 0, }, boxScore: [{ home: 0, away: 1 }], atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('1.023: an infield error advances all runners 1 base', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.SECOND]: 1, [Bases.THIRD]: 1 } });
        const thrown: Pitches = Pitches.INPLAY_INFIELD_ERROR;
        const diff: DeepPartial<GameMoment> = { bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 0, }, boxScore: [{ home: 0, away: 1 }], atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('1.123: an infield error advances all runners 1 base', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, [Bases.THIRD]: 1 } });
        const thrown: Pitches = Pitches.INPLAY_INFIELD_ERROR;
        const diff: DeepPartial<GameMoment> = { boxScore: [{ home: 0, away: 1 }], atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });
});

describe('[6.03]', () => {
    test('1.000: an infield single behaves as a single', () => {
        const initial: GameMoment = noStatsGame();
        const thrown: Pitches = Pitches.INPLAY_INFIELD_SINGLE;
        const diff: DeepPartial<GameMoment> = { bases: { [Bases.FIRST]: 1 }, atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('1.100: an infield single advances all runners 1 base', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.FIRST]: 1 } });
        const thrown: Pitches = Pitches.INPLAY_INFIELD_SINGLE;
        const diff: DeepPartial<GameMoment> = { bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1 }, atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('1.020: an infield single advances all runners 1 base', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.SECOND]: 1 } });
        const thrown: Pitches = Pitches.INPLAY_INFIELD_SINGLE;
        const diff: DeepPartial<GameMoment> = { bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 0, [Bases.THIRD]: 1, }, atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('1.003: an infield single advances all runners 1 base', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.THIRD]: 1 } });
        const thrown: Pitches = Pitches.INPLAY_INFIELD_SINGLE;
        const diff: DeepPartial<GameMoment> = { bases: { [Bases.FIRST]: 1, [Bases.THIRD]: 0, }, boxScore: [{ home: 0, away: 1 }], atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('1.120: an infield single advances all runners 1 base', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1 } });
        const thrown: Pitches = Pitches.INPLAY_INFIELD_SINGLE;
        const diff: DeepPartial<GameMoment> = { bases: { [Bases.THIRD]: 1, }, atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('1.103: an infield single advances all runners 1 base', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.FIRST]: 1, [Bases.THIRD]: 1 } });
        const thrown: Pitches = Pitches.INPLAY_INFIELD_SINGLE;
        const diff: DeepPartial<GameMoment> = { bases: { [Bases.SECOND]: 1, [Bases.THIRD]: 0, }, boxScore: [{ home: 0, away: 1 }], atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('1.023: an infield single advances all runners 1 base', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.SECOND]: 1, [Bases.THIRD]: 1 } });
        const thrown: Pitches = Pitches.INPLAY_INFIELD_SINGLE;
        const diff: DeepPartial<GameMoment> = { bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 0, }, boxScore: [{ home: 0, away: 1 }], atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('1.123: an infield single advances all runners 1 base', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, [Bases.THIRD]: 1 } });
        const thrown: Pitches = Pitches.INPLAY_INFIELD_SINGLE;
        const diff: DeepPartial<GameMoment> = { boxScore: [{ home: 0, away: 1 }], atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });
});

describe('[caught in the air]', () => {
    test('O: a strike (foul caught) is an out, resets count', () => {
        const initial: GameMoment = noStatsGame();
        const thrown: Pitches = Pitches.STRIKE_FOUL_CAUGHT;
        const diff: DeepPartial<GameMoment> = { outs: 1, count: { strikes: 0, balls: 0 }, atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('O: an infield line out, is an out, resets count', () => {
        const initial: GameMoment = noStatsGame();
        const thrown: Pitches = Pitches.INPLAY_INFIELD_LINE_OUT;
        const diff: DeepPartial<GameMoment> = { outs: 1, count: { strikes: 0, balls: 0 }, atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('O: an outfield out, is an out, resets count', () => {
        const initial: GameMoment = noStatsGame();
        const thrown: Pitches = Pitches.INPLAY_OUTFIELD_OUT;
        const diff: DeepPartial<GameMoment> = { outs: 1, count: { strikes: 0, balls: 0 }, atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });
});

describe('[6.04]', () => {
    test('1.000: a single (empty bases) puts a runner on first', () => {
        const initial: GameMoment = noStatsGame();
        const thrown: Pitches = Pitches.INPLAY_OUTFIELD_SINGLE;
        const diff: DeepPartial<GameMoment> = { bases: { [Bases.FIRST]: 1 }, atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });
});

describe('[6.06]', () => {
    test('2.000: a double (empty bases) puts a runner on second', () => {
        const initial: GameMoment = noStatsGame();
        const thrown: Pitches = Pitches.INPLAY_DOUBLE;
        const diff: DeepPartial<GameMoment> = { bases: { [Bases.SECOND]: 1 }, atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });
});

describe('[6.07]', () => {
    test('3.000: a triple (empty bases) puts a runner on third', () => {
        const initial: GameMoment = noStatsGame();
        const thrown: Pitches = Pitches.INPLAY_TRIPLE;
        const diff: DeepPartial<GameMoment> = { bases: { [Bases.THIRD]: 1 }, atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });
});

describe('[6.08]', () => {
    test('H.000: a homerun (empty bases) scores a run', () => {
        const initial: GameMoment = noStatsGame();
        const thrown: Pitches = Pitches.INPLAY_HOMERUN;
        const diff: DeepPartial<GameMoment> = { boxScore: [{ home: 0, away: 1 }], atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });
});

describe('[7.00]', () => {

    test('1.100: with a runner on 1st, a single puts runners on 1st and 2nd', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.FIRST]: 1 } });
        const thrown: Pitches = Pitches.INPLAY_OUTFIELD_SINGLE;
        const diff: DeepPartial<GameMoment> = {
            bases: {
                [Bases.FIRST]: 1,
                [Bases.SECOND]: 1
            },
            atBat: 'playerB'
        };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('1.020: with a runner on 2nd, a single puts runners on the corners', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.SECOND]: 1 } });
        const thrown: Pitches = Pitches.INPLAY_OUTFIELD_SINGLE;
        const diff: DeepPartial<GameMoment> = {
            bases: {
                [Bases.FIRST]: 1,
                [Bases.SECOND]: 0,
                [Bases.THIRD]: 1
            },
            atBat: 'playerB'
        };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('1.003: with a runner on 3rd, a single scores the runner, and puts a runner on 1st', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.THIRD]: 1 } });
        const thrown: Pitches = Pitches.INPLAY_OUTFIELD_SINGLE;
        const diff: DeepPartial<GameMoment> = {
            bases: {
                [Bases.FIRST]: 1,
                [Bases.THIRD]: 0
            },
            boxScore: [{ home: 0, away: 1 }],
            atBat: 'playerB'
        };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('2.100: with a runner on 1st, a double puts runners on 2nd and 3rd', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.FIRST]: 1 } });
        const thrown: Pitches = Pitches.INPLAY_DOUBLE;
        const diff: DeepPartial<GameMoment> = {
            bases: {
                [Bases.FIRST]: 0,
                [Bases.SECOND]: 1,
                [Bases.THIRD]: 1,
            },
            atBat: 'playerB'
        };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('2.020: with a runner on 2nd, a double scores the runner, and puts a runner on 2nd', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.SECOND]: 1 } });
        const thrown: Pitches = Pitches.INPLAY_DOUBLE;
        const diff: DeepPartial<GameMoment> = {
            bases: {
                [Bases.SECOND]: 1
            },
            atBat: 'playerB'
        };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('2.003: with a runner on 3rd, a double scores the runner, and puts a runner on 2nd', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.THIRD]: 1 } });
        const thrown: Pitches = Pitches.INPLAY_DOUBLE;
        const diff: DeepPartial<GameMoment> = {
            bases: {
                [Bases.SECOND]: 1,
                [Bases.THIRD]: 0
            },
            boxScore: [{ home: 0, away: 1 }],
            atBat: 'playerB'
        };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('3.100: with a runner on 1st, a triple scores the runner, and puts runners on 3rd', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.FIRST]: 1 } });
        const thrown: Pitches = Pitches.INPLAY_TRIPLE;
        const diff: DeepPartial<GameMoment> = {
            bases: {
                [Bases.FIRST]: 0,
                [Bases.SECOND]: 0,
                [Bases.THIRD]: 1,
            },
            boxScore: [{ home: 0, away: 1 }],
            atBat: 'playerB'
        };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('3.020: with a runner on 2nd, a triple scores the runner, and puts a runner on 3rd', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.SECOND]: 1 } });
        const thrown: Pitches = Pitches.INPLAY_TRIPLE;
        const diff: DeepPartial<GameMoment> = {
            bases: {
                [Bases.SECOND]: 0,
                [Bases.THIRD]: 1,
            },
            boxScore: [{ home: 0, away: 1 }],
            atBat: 'playerB'
        };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('3.003: with a runner on 3rd, a triple scores the runner, and puts a runner on 3rd', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.THIRD]: 1 } });
        const thrown: Pitches = Pitches.INPLAY_TRIPLE;
        const diff: DeepPartial<GameMoment> = {
            boxScore: [{ home: 0, away: 1 }],
            atBat: 'playerB'
        };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });


    test('H.100: with a runner on 1st, a homerun scores the runner and batter', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.FIRST]: 1 } });
        const thrown: Pitches = Pitches.INPLAY_HOMERUN;
        const diff: DeepPartial<GameMoment> = {
            bases: {
                [Bases.FIRST]: 0,
            },
            boxScore: [{ home: 0, away: 2 }],
            atBat: 'playerB'
        };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('H.020: with a runner on 2nd, a homerun scores the runner and batter', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.SECOND]: 1 } });
        const thrown: Pitches = Pitches.INPLAY_HOMERUN;
        const diff: DeepPartial<GameMoment> = {
            bases: {
                [Bases.SECOND]: 0,
            },
            boxScore: [{ home: 0, away: 2 }],
            atBat: 'playerB'
        };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('H.003: with a runner on 3rd, a homerun scores the runner and batter', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.THIRD]: 1 } });
        const thrown: Pitches = Pitches.INPLAY_HOMERUN;
        const diff: DeepPartial<GameMoment> = {
            bases: {
                [Bases.THIRD]: 0,
            },
            boxScore: [{ home: 0, away: 2 }],
            atBat: 'playerB'
        };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('1.120: with a runner on 1st and 2nd, a single loads the bases', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), {
            bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1 }
        });
        const thrown: Pitches = Pitches.INPLAY_OUTFIELD_SINGLE;
        const diff: DeepPartial<GameMoment> = {
            bases: {
                [Bases.THIRD]: 1,
            },
            atBat: 'playerB'
        };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('1.103: with a runner on 1st and 3rd, a single scores the runner on 3rd, and puts runners on 1st and 2nd', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), {
            bases: { [Bases.FIRST]: 1, [Bases.THIRD]: 1 }
        });
        const thrown: Pitches = Pitches.INPLAY_OUTFIELD_SINGLE;
        const diff: DeepPartial<GameMoment> = {
            bases: {
                [Bases.FIRST]: 1,
                [Bases.SECOND]: 1,
                [Bases.THIRD]: 0,
            },
            boxScore: [{ home: 0, away: 1 }],
            atBat: 'playerB'
        };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('1.023: with a runner on 2nd and 3rd, a single scores the runner on 3rd, and puts runners on the corners', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), {
            bases: { [Bases.SECOND]: 1, [Bases.THIRD]: 1 }
        });
        const thrown: Pitches = Pitches.INPLAY_OUTFIELD_SINGLE;
        const diff: DeepPartial<GameMoment> = {
            bases: {
                [Bases.FIRST]: 1,
                [Bases.SECOND]: 0,
                [Bases.THIRD]: 1
            },
            boxScore: [{ home: 0, away: 1 }],
            atBat: 'playerB'
        };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('1.123: with the bases loaded, a single scores the runner on 3rd, and loads the bases', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), {
            bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, [Bases.THIRD]: 1 }
        });
        const thrown: Pitches = Pitches.INPLAY_OUTFIELD_SINGLE;
        const diff: DeepPartial<GameMoment> = {
            bases: {
                [Bases.FIRST]: 1,
                [Bases.SECOND]: 1,
                [Bases.THIRD]: 1
            },
            boxScore: [{ home: 0, away: 1 }],
            atBat: 'playerB'
        };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('2.120: with a runner on 1st and 2nd, a double scores the runner on second, and puts runners on 2nd and 3rd', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), {
            bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1 }
        });
        const thrown: Pitches = Pitches.INPLAY_DOUBLE;
        const diff: DeepPartial<GameMoment> = {
            bases: {
                [Bases.FIRST]: 0,
                [Bases.SECOND]: 1,
                [Bases.THIRD]: 1,
            },
            boxScore: [{ home: 0, away: 1 }],
            atBat: 'playerB'
        };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('2.103: with a runner on 1st and 3rd, a double scores the runner on 3rd, and puts runners on 2nd and 3rd', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), {
            bases: { [Bases.FIRST]: 1, [Bases.THIRD]: 1 }
        });
        const thrown: Pitches = Pitches.INPLAY_DOUBLE;
        const diff: DeepPartial<GameMoment> = {
            bases: {
                [Bases.FIRST]: 0,
                [Bases.SECOND]: 1,
                [Bases.THIRD]: 1,
            },
            boxScore: [{ home: 0, away: 1 }],
            atBat: 'playerB'
        };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('2.023: with a runner on 2nd and 3rd, a double scores both runners, and puts a runner on 2nd', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), {
            bases: { [Bases.SECOND]: 1, [Bases.THIRD]: 1 }
        });
        const thrown: Pitches = Pitches.INPLAY_DOUBLE;
        const diff: DeepPartial<GameMoment> = {
            bases: {
                [Bases.THIRD]: 0
            },
            boxScore: [{ home: 0, away: 2 }],
            atBat: 'playerB'
        };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('2.123: with the bases loaded, a double scores the runner on 3rd, and puts runners on 2nd and 3rd', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), {
            bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, [Bases.THIRD]: 1 }
        });
        const thrown: Pitches = Pitches.INPLAY_DOUBLE;
        const diff: DeepPartial<GameMoment> = {
            bases: {
                [Bases.FIRST]: 0,
                [Bases.SECOND]: 1,
                [Bases.THIRD]: 1
            },
            boxScore: [{ home: 0, away: 2 }],
            atBat: 'playerB'
        };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('3.120: with a runner on 1st and 2nd, a triple scores both runners, and puts a runner on 3rd', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), {
            bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1 }
        });
        const thrown: Pitches = Pitches.INPLAY_TRIPLE;
        const diff: DeepPartial<GameMoment> = {
            bases: {
                [Bases.FIRST]: 0,
                [Bases.SECOND]: 0,
                [Bases.THIRD]: 1,
            },
            boxScore: [{ home: 0, away: 2 }],
            atBat: 'playerB'
        };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('3.103: with a runner on 1st and 3rd, a triple scores both runners, and puts a runner on 3rd', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), {
            bases: { [Bases.FIRST]: 1, [Bases.THIRD]: 1 }
        });
        const thrown: Pitches = Pitches.INPLAY_TRIPLE;
        const diff: DeepPartial<GameMoment> = {
            bases: {
                [Bases.FIRST]: 0,
            },
            boxScore: [{ home: 0, away: 2 }],
            atBat: 'playerB'
        };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('3.023: with a runner on 2nd and 3rd, a triple scores both runners, and puts a runner on 3rd', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), {
            bases: { [Bases.SECOND]: 1, [Bases.THIRD]: 1 }
        });
        const thrown: Pitches = Pitches.INPLAY_TRIPLE;
        const diff: DeepPartial<GameMoment> = {
            bases: {
                [Bases.SECOND]: 0
            },
            boxScore: [{ home: 0, away: 2 }],
            atBat: 'playerB'
        };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('3.123: with the bases loaded, a triple clears the bases, and puts a runner on 3rd', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), {
            bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, [Bases.THIRD]: 1 }
        });
        const thrown: Pitches = Pitches.INPLAY_TRIPLE;
        const diff: DeepPartial<GameMoment> = {
            bases: {
                [Bases.FIRST]: 0,
                [Bases.SECOND]: 0,
                [Bases.THIRD]: 1
            },
            boxScore: [{ home: 0, away: 3 }],
            atBat: 'playerB'
        };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });


    test('H.120: with a runner on 1st and 2nd, a homerun scores 3 runs', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), {
            bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1 }
        });
        const thrown: Pitches = Pitches.INPLAY_HOMERUN;
        const diff: DeepPartial<GameMoment> = {
            bases: {
                [Bases.FIRST]: 0,
                [Bases.SECOND]: 0,
            },
            boxScore: [{ home: 0, away: 3 }],
            atBat: 'playerB'
        };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('H.103: with a runner on 1st and 3rd, a homerun scores 3 runs', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), {
            bases: { [Bases.FIRST]: 1, [Bases.THIRD]: 1 }
        });
        const thrown: Pitches = Pitches.INPLAY_HOMERUN;
        const diff: DeepPartial<GameMoment> = {
            bases: {
                [Bases.FIRST]: 0,
                [Bases.THIRD]: 0
            },
            boxScore: [{ home: 0, away: 3 }],
            atBat: 'playerB'
        };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('H.023: with a runner on 2nd and 3rd, a homerun scores 3 runs', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), {
            bases: { [Bases.SECOND]: 1, [Bases.THIRD]: 1 }
        });
        const thrown: Pitches = Pitches.INPLAY_HOMERUN;
        const diff: DeepPartial<GameMoment> = {
            bases: {
                [Bases.SECOND]: 0,
                [Bases.THIRD]: 0
            },
            boxScore: [{ home: 0, away: 3 }],
            atBat: 'playerB'
        };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('H.123: with the bases loaded, a homerun scores 4 runs, a grand slam!', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), {
            bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, [Bases.THIRD]: 1 }
        });
        const thrown: Pitches = Pitches.INPLAY_HOMERUN;
        const diff: DeepPartial<GameMoment> = {
            bases: {
                [Bases.FIRST]: 0,
                [Bases.SECOND]: 0,
                [Bases.THIRD]: 0
            },
            boxScore: [{ home: 0, away: 4 }],
            atBat: 'playerB'
        };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });
});

describe('[count resets at new batter]', () => {

    test('1: a single resets the count', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { count: { balls: 1, strikes: 1 } });
        const thrown: Pitches = Pitches.INPLAY_OUTFIELD_SINGLE;
        const diff: DeepPartial<GameMoment> = { count: { balls: 0, strikes: 0 } };

        expect(pitch(initial, thrown).count).toEqual(mergeDeepRight(initial, diff).count);
    });

    test('2: a double resets the count', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { count: { balls: 1, strikes: 1 } });
        const thrown: Pitches = Pitches.INPLAY_DOUBLE;
        const diff: DeepPartial<GameMoment> = { count: { balls: 0, strikes: 0 } };

        expect(pitch(initial, thrown).count).toEqual(mergeDeepRight(initial, diff).count);
    });

    test('3: a triple resets the count', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { count: { balls: 1, strikes: 1 } });
        const thrown: Pitches = Pitches.INPLAY_TRIPLE;
        const diff: DeepPartial<GameMoment> = { count: { balls: 0, strikes: 0 } };

        expect(pitch(initial, thrown).count).toEqual(mergeDeepRight(initial, diff).count);
    });

    test('H: a homerun resets the count', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { count: { balls: 1, strikes: 1 } });
        const thrown: Pitches = Pitches.INPLAY_HOMERUN;
        const diff: DeepPartial<GameMoment> = { count: { balls: 0, strikes: 0 } };

        expect(pitch(initial, thrown).count).toEqual(mergeDeepRight(initial, diff).count);
    });

    test('E: an infield error resets the count', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { count: { balls: 1, strikes: 1 } });
        const thrown: Pitches = Pitches.INPLAY_INFIELD_ERROR;
        const diff: DeepPartial<GameMoment> = { count: { balls: 0, strikes: 0 } };

        expect(pitch(initial, thrown).count).toEqual(mergeDeepRight(initial, diff).count);
    });

    test('DP: a doubleplay resets the count', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.FIRST]: 1 }, count: { balls: 1, strikes: 1 } });
        const thrown: Pitches = Pitches.INPLAY_INFIELD_OUT_DP_SUCCESS;
        const diff: DeepPartial<GameMoment> = { count: { balls: 0, strikes: 0 } };

        expect(pitch(initial, thrown).count).toEqual(mergeDeepRight(initial, diff).count);
    });

    test('FC: a fielder\'s choice resets the count', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.FIRST]: 1 }, count: { balls: 1, strikes: 1 } });
        const thrown: Pitches = Pitches.INPLAY_INFIELD_OUT_DP_FAIL;
        const diff: DeepPartial<GameMoment> = { count: { balls: 0, strikes: 0 } };

        expect(pitch(initial, thrown).count).toEqual(mergeDeepRight(initial, diff).count);
    });
});

describe('[7.00 - 2 outs]', () => {
    test('1.100.2: with a runner on first and 2 outs, a single advances the runner 2 bases', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.FIRST]: 1 }, outs: 2 });
        const thrown: Pitches = Pitches.INPLAY_OUTFIELD_SINGLE;
        const diff: DeepPartial<GameMoment> = { bases: { [Bases.FIRST]: 1, [Bases.THIRD]: 1 }, atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('1.020.2: with a runner on 2nd and 2 outs, a single advances the runner 2 bases, scoring a run', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.SECOND]: 1 }, outs: 2 });
        const thrown: Pitches = Pitches.INPLAY_OUTFIELD_SINGLE;
        const diff: DeepPartial<GameMoment> = { bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 0 }, boxScore: [{ home: 0, away: 1 }], atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('1.003.2: with a runner on 3rd and 2 outs, a single advances the runner 2 bases, scoring a run', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.THIRD]: 1 }, outs: 2 });
        const thrown: Pitches = Pitches.INPLAY_OUTFIELD_SINGLE;
        const diff: DeepPartial<GameMoment> = { bases: { [Bases.FIRST]: 1, [Bases.THIRD]: 0 }, boxScore: [{ home: 0, away: 1 }], atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('1.120.2: with a runner on 1st and 2nd and 2 outs, a single advances the runners 2 bases, scoring a run', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1 }, outs: 2 });
        const thrown: Pitches = Pitches.INPLAY_OUTFIELD_SINGLE;
        const diff: DeepPartial<GameMoment> = { bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 0, [Bases.THIRD]: 1 }, boxScore: [{ home: 0, away: 1 }], atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('1.103.2: with a runner on 1st and 3rd and 2 outs, a single advances the runners 2 bases, scoring a run', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.FIRST]: 1, [Bases.THIRD]: 1 }, outs: 2 });
        const thrown: Pitches = Pitches.INPLAY_OUTFIELD_SINGLE;
        const diff: DeepPartial<GameMoment> = { boxScore: [{ home: 0, away: 1 }], atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('1.023.2: with a runner on 2nd and 3rd and 2 outs, a single advances the runners 2 bases, scoring 2 runs', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.SECOND]: 1, [Bases.THIRD]: 1 }, outs: 2 });
        const thrown: Pitches = Pitches.INPLAY_OUTFIELD_SINGLE;
        const diff: DeepPartial<GameMoment> = { bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 0, [Bases.THIRD]: 0 }, boxScore: [{ home: 0, away: 2 }], atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('2.123.2: with the bases loaded and 2 outs, a single advances the runners 2 bases, scoring 2 runs', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, [Bases.THIRD]: 1 }, outs: 2 });
        const thrown: Pitches = Pitches.INPLAY_OUTFIELD_SINGLE;
        const diff: DeepPartial<GameMoment> = { bases: { [Bases.SECOND]: 0 }, boxScore: [{ home: 0, away: 2 }], atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('2.100.2: with a runner on first and 2 outs, a double advances the runner 3 bases, scoring a run', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.FIRST]: 1 }, outs: 2 });
        const thrown: Pitches = Pitches.INPLAY_DOUBLE;
        const diff: DeepPartial<GameMoment> = { bases: { [Bases.FIRST]: 0, [Bases.SECOND]: 1, }, boxScore: [{ home: 0, away: 1 }], atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('2.020.2: with a runner on 2nd and 2 outs, a double advances the runner 3 bases, scoring a run', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.SECOND]: 1 }, outs: 2 });
        const thrown: Pitches = Pitches.INPLAY_DOUBLE;
        const diff: DeepPartial<GameMoment> = { boxScore: [{ home: 0, away: 1 }], atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('2.003.2: with a runner on 3rd and 2 outs, a double advances the runner 3 bases, scoring a run', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.THIRD]: 1 }, outs: 2 });
        const thrown: Pitches = Pitches.INPLAY_DOUBLE;
        const diff: DeepPartial<GameMoment> = { bases: { [Bases.SECOND]: 1, [Bases.THIRD]: 0, }, boxScore: [{ home: 0, away: 1 }], atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('2.120.2: with a runner on 1st and 2nd and 2 outs, a double advances the runners 3 bases, scoring 2 runs', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1 }, outs: 2 });
        const thrown: Pitches = Pitches.INPLAY_DOUBLE;
        const diff: DeepPartial<GameMoment> = { bases: { [Bases.FIRST]: 0, }, boxScore: [{ home: 0, away: 2 }], atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('2.103.2: with a runner on 1st and 3rd and 2 outs, a double advances the runners 3 bases, scoring 2 runs', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.FIRST]: 1, [Bases.THIRD]: 1 }, outs: 2 });
        const thrown: Pitches = Pitches.INPLAY_DOUBLE;
        const diff: DeepPartial<GameMoment> = { bases: { [Bases.FIRST]: 0, [Bases.SECOND]: 1, [Bases.THIRD]: 0, }, boxScore: [{ home: 0, away: 2 }], atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('2.023.2: with a runner on 2nd and 3rd and 2 outs, a double advances the runners 3 bases, scoring 2 runs', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.SECOND]: 1, [Bases.THIRD]: 1 }, outs: 2 });
        const thrown: Pitches = Pitches.INPLAY_DOUBLE;
        const diff: DeepPartial<GameMoment> = { bases: { [Bases.THIRD]: 0 }, boxScore: [{ home: 0, away: 2 }], atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('2.123.2: with the bases loaded and 2 outs, a double advances the runners 3 bases, scoring 3 runs', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, [Bases.THIRD]: 1 }, outs: 2 });
        const thrown: Pitches = Pitches.INPLAY_DOUBLE;
        const diff: DeepPartial<GameMoment> = { bases: { [Bases.FIRST]: 0, [Bases.THIRD]: 0 }, boxScore: [{ home: 0, away: 3 }], atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('3.100.2: with a runner on first and 2 outs, a triple advances the runner 4 bases, scoring a run', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.FIRST]: 1 }, outs: 2 });
        const thrown: Pitches = Pitches.INPLAY_TRIPLE;
        const diff: DeepPartial<GameMoment> = { bases: { [Bases.FIRST]: 0, [Bases.THIRD]: 1 }, boxScore: [{ home: 0, away: 1 }], atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('3.020.2: with a runner on 2nd and 2 outs, a triple advances the runner 4 bases, scoring a run', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.SECOND]: 1 }, outs: 2 });
        const thrown: Pitches = Pitches.INPLAY_TRIPLE;
        const diff: DeepPartial<GameMoment> = { bases: { [Bases.SECOND]: 0, [Bases.THIRD]: 1, }, boxScore: [{ home: 0, away: 1 }], atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('3.003.2: with a runner on 3rd and 2 outs, a triple advances the runner 4 bases, scoring a run', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.THIRD]: 1 }, outs: 2 });
        const thrown: Pitches = Pitches.INPLAY_TRIPLE;
        const diff: DeepPartial<GameMoment> = { boxScore: [{ home: 0, away: 1 }], atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('3.120.2: with a runner on 1st and 2nd and 2 outs, a triple advances the runners 4 bases, scoring 2 runs', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1 }, outs: 2 });
        const thrown: Pitches = Pitches.INPLAY_TRIPLE;
        const diff: DeepPartial<GameMoment> = { bases: { [Bases.FIRST]: 0, [Bases.SECOND]: 0, [Bases.THIRD]: 1 }, boxScore: [{ home: 0, away: 2 }], atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('3.103.2: with a runner on 1st and 3rd and 2 outs, a triple advances the runners 4 bases, scoring 2 runs', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.FIRST]: 1, [Bases.THIRD]: 1 }, outs: 2 });
        const thrown: Pitches = Pitches.INPLAY_TRIPLE;
        const diff: DeepPartial<GameMoment> = { bases: { [Bases.FIRST]: 0, }, boxScore: [{ home: 0, away: 2 }], atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('3.023.2: with a runner on 2nd and 3rd and 2 outs, a triple advances the runners 4 bases, scoring 2 runs', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.SECOND]: 1, [Bases.THIRD]: 1 }, outs: 2 });
        const thrown: Pitches = Pitches.INPLAY_TRIPLE;
        const diff: DeepPartial<GameMoment> = { bases: { [Bases.SECOND]: 0, }, boxScore: [{ home: 0, away: 2 }], atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('3.123.2: with the bases loaded and 2 outs, a triple advances the runners 3 bases, scoring 3 runs', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, [Bases.THIRD]: 1 }, outs: 2 });
        const thrown: Pitches = Pitches.INPLAY_TRIPLE;
        const diff: DeepPartial<GameMoment> = { bases: { [Bases.FIRST]: 0, [Bases.SECOND]: 0 }, boxScore: [{ home: 0, away: 3 }], atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });
});

describe('[7.01]', () => {
    test('G.103: an unforced runner will not advance on an infield ground out, the lead forced runner is out', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.FIRST]: 1, [Bases.THIRD]: 1 } });
        const thrown: Pitches = Pitches.INPLAY_INFIELD_GRD_OUT;
        const diff: DeepPartial<GameMoment> = { outs: 1, atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('G.020: an unforced runner will not advance on an infield ground out, the lead forced runner is out', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.SECOND]: 1 } });
        const thrown: Pitches = Pitches.INPLAY_INFIELD_GRD_OUT;
        const diff: DeepPartial<GameMoment> = { outs: 1, atBat: 'playerB' };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });
});

describe('[7.02]', () => {
    test('FLO.003: outfield fly out, with a runner on third, scores the runner', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.THIRD]: 1 } });
        const thrown: Pitches = Pitches.INPLAY_OUTFIELD_OUT;
        const diff: DeepPartial<GameMoment> = {
            outs: 1,
            bases: { [Bases.THIRD]: 0, },
            boxScore: [{ home: 0, away: 1 }],
            atBat: 'playerB'
        };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });
});

describe('[7.03]', () => {
    test('DP.100: with a runner on first, a successful doubleplay, results in 2 outs', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.FIRST]: 1 } });
        const thrown: Pitches = Pitches.INPLAY_INFIELD_OUT_DP_SUCCESS;
        const diff: DeepPartial<GameMoment> = {
            bases: {
                [Bases.FIRST]: 0,
            },
            outs: 2,
            atBat: 'playerB'
        };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('FC.100: with a runner on first, a failed doubleplay (fielder\'s choice), results in the lead runner out, a runner on 1st', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.FIRST]: 1 } });
        const thrown: Pitches = Pitches.INPLAY_INFIELD_OUT_DP_FAIL;
        const diff: DeepPartial<GameMoment> = {
            outs: 1,
            atBat: 'playerB'
        };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('DP.120: with a runner on 1st and 2nd, a successful doubleplay, results in the lead runner out and batter out, a runner on 2nd', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1 } });
        const thrown: Pitches = Pitches.INPLAY_INFIELD_OUT_DP_SUCCESS;
        const diff: DeepPartial<GameMoment> = {
            bases: {
                [Bases.FIRST]: 0,
            },
            outs: 2,
            atBat: 'playerB'
        };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('FC.120: with a runner on 1st and 2nd, a failed doubleplay (fielder\'s choice), results in the lead runner out, a runner on 1st and 2nd', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1 } });
        const thrown: Pitches = Pitches.INPLAY_INFIELD_OUT_DP_FAIL;
        const diff: DeepPartial<GameMoment> = {
            outs: 1,
            atBat: 'playerB'
        };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('DP.123: with the bases loaded, a successful doubleplay, results in the lead runner out and batter out, a runner on 2nd and 3rd', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, [Bases.THIRD]: 1 } });
        const thrown: Pitches = Pitches.INPLAY_INFIELD_OUT_DP_SUCCESS;
        const diff: DeepPartial<GameMoment> = {
            bases: {
                [Bases.FIRST]: 0,
            },
            outs: 2,
            atBat: 'playerB'
        };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('FC.123: with the bases loaded, a failed doubleplay (fielder\'s choice), results in the lead runner out, the bases loaded', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, [Bases.THIRD]: 1 } });
        const thrown: Pitches = Pitches.INPLAY_INFIELD_OUT_DP_FAIL;
        const diff: DeepPartial<GameMoment> = {
            outs: 1,
            atBat: 'playerB'
        };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('DP.103: with a runner on 1st and 3rd, a successful doubleplay, results in the runner on 1st out and batter out, runner on 3rd run scores', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.FIRST]: 1, [Bases.THIRD]: 1 } });
        const thrown: Pitches = Pitches.INPLAY_INFIELD_OUT_DP_SUCCESS;
        const diff: DeepPartial<GameMoment> = {
            bases: {
                [Bases.FIRST]: 0,
                [Bases.THIRD]: 0
            },
            outs: 2,
            boxScore: [{ home: 0, away: 1 }],
            atBat: 'playerB'
        };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });

    test('FC.103: with a runner on 1st and 3rd, a failed doubleplay (fielder\'s choice), results in the runner on 1st out, a runner on 1st, runner on 3rd run scores', () => {
        const initial: GameMoment = mergeDeepRight(noStatsGame(), { bases: { [Bases.FIRST]: 1, [Bases.THIRD]: 1 } });
        const thrown: Pitches = Pitches.INPLAY_INFIELD_OUT_DP_FAIL;
        const diff: DeepPartial<GameMoment> = {
            bases: {
                [Bases.THIRD]: 0
            },
            outs: 1,
            boxScore: [{ home: 0, away: 1 }],
            atBat: 'playerB'
        };

        expect(pitch(initial, thrown)).toEqual(mergeDeepRight(initial, diff));
    });
});
