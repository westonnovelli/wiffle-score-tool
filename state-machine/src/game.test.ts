import mergeDeepRight from 'ramda/src/mergeDeepRight.js';

import { GameMoment, DeepPartial, Pitches, InningHalf, Bases } from './types';
import { pitch as simPitch } from './gameReducer';
import { defaultGame } from './factory';

type atBat = {
    pitch: Pitches,
    expected: DeepPartial<GameMoment>
}[];

let game: GameMoment = defaultGame();

test('1st batter: Lead off walk', () => {
    const atBat: atBat = [
        {
            pitch: Pitches.BALL,
            expected: { count: { balls: 1 }}
        },
        {
            pitch: Pitches.BALL,
            expected: { count: { balls: 2 }}
        },
        {
            pitch: Pitches.BALL,
            expected: { count: { balls: 3 }}
        },
        {
            pitch: Pitches.BALL,
            expected: { bases: { [Bases.FIRST]: 1 }}
        },
    ];

    atBat.forEach(({ pitch, expected }) => {
        game = simPitch(game, pitch);
        expect(game).toEqual(mergeDeepRight(defaultGame(), expected));
    });
});

test('2nd batter: single on 1,2 count', () => {
    const atBat: atBat = [
        {
            pitch: Pitches.BALL,
            expected: { count: { balls: 1 }, bases: { [Bases.FIRST]: 1, }}
        },
        {
            pitch: Pitches.STRIKE_FOUL,
            expected: { count: { balls: 1, strikes: 1 }, bases: { [Bases.FIRST]: 1, }}
        },
        {
            pitch: Pitches.STRIKE_SWINGING,
            expected: { count: { balls: 1, strikes: 2 }, bases: { [Bases.FIRST]: 1, }}
        },
        {
            pitch: Pitches.INPLAY_OUTFIELD_SINGLE,
            expected: { bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, } }
        },
    ];

    atBat.forEach(({ pitch, expected }) => {
        game = simPitch(game, pitch);
        expect(game).toEqual(mergeDeepRight(defaultGame(), expected));
    });
});

test('3rd batter: groud out on first pitch', () => {
    const atBat: atBat = [
        {
            pitch: Pitches.INPLAY_INFIELD_GRD_OUT,
            expected: { outs: 1, bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, }}
        },
    ];

    atBat.forEach(({ pitch, expected }) => {
        game = simPitch(game, pitch);
        expect(game).toEqual(mergeDeepRight(defaultGame(), expected));
    });
});

test('4th batter: strikeout looking on 2,0 count', () => {
    const atBat: atBat = [
        {
            pitch: Pitches.BALL,
            expected: { count: { balls: 1 }, outs: 1, bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, }}
        },
        {
            pitch: Pitches.BALL,
            expected: { count: { balls: 2 }, outs: 1, bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, }}
        },
        {
            pitch: Pitches.STRIKE_LOOKING,
            expected: { outs: 2, bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, }}
        },
    ];

    atBat.forEach(({ pitch, expected }) => {
        game = simPitch(game, pitch);
        expect(game).toEqual(mergeDeepRight(defaultGame(), expected));
    });
});

test('5th batter: foul, foul, foul, infield error', () => {
    const atBat: atBat = [
        {
            pitch: Pitches.STRIKE_FOUL,
            expected: { count: { strikes: 1 }, outs: 2, bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, }}
        },
        {
            pitch: Pitches.STRIKE_FOUL,
            expected: { count: { strikes: 2 }, outs: 2, bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, }}
        },
        {
            pitch: Pitches.STRIKE_FOUL,
            expected: { count: { strikes: 2 }, outs: 2, bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, }}
        },
        {
            pitch: Pitches.INPLAY_INFIELD_ERROR,
            expected: { outs: 2, bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, [Bases.THIRD]: 1, }}
        },
    ];

    atBat.forEach(({ pitch, expected }) => {
        game = simPitch(game, pitch);
        expect(game).toEqual(mergeDeepRight(defaultGame(), expected));
    });
});

test('6th batter: grand slam! first pitch', () => {
    const atBat: atBat = [
        {
            pitch: Pitches.INPLAY_HOMERUN,
            expected: { outs: 2, boxScore: [{ home: 0, away: 4 }] }
        },
    ];

    atBat.forEach(({ pitch, expected }) => {
        game = simPitch(game, pitch);
        expect(game).toEqual(mergeDeepRight(defaultGame(), expected));
    });
});

test('7th batter: fly out on 1,0, ends the inning', () => {
    const atBat: atBat = [
        {
            pitch: Pitches.BALL,
            expected: { count: { balls: 1 }, outs: 2, boxScore: [{ home: 0, away: 4 }]}

        },
        {
            pitch: Pitches.INPLAY_OUTFIELD_OUT,
            expected: { inning: { half: InningHalf.BOTTOM }, boxScore: [{ home: 0, away: 4 }] }
        },
    ];

    atBat.forEach(({ pitch, expected }) => {
        game = simPitch(game, pitch);
        expect(game).toEqual(mergeDeepRight(defaultGame(), expected));
    });
});
