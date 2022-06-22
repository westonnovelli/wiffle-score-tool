import mergeDeepRight from 'ramda/src/mergeDeepRight.js';

import { GameMoment, DeepPartial, Pitches, InningHalf, Bases } from './types';
import { handlePitch } from './engine';
import { defaultGame } from './factory';
import { EMPTY_BASES } from './gameReducer';

type atBat = {
    pitch: Pitches,
    expected: DeepPartial<GameMoment>
}[];

let game: GameMoment = defaultGame();

test('1st batter: Lead off walk', () => {
    const atBat: atBat = [
        {
            pitch: Pitches.BALL,
            expected: { count: { balls: 1 }, pitches: [Pitches.BALL] }
        },
        {
            pitch: Pitches.BALL,
            expected: { count: { balls: 2 }, pitches: [Pitches.BALL, Pitches.BALL] }
        },
        {
            pitch: Pitches.BALL,
            expected: { count: { balls: 3 }, pitches: [Pitches.BALL, Pitches.BALL, Pitches.BALL] }
        },
        {
            pitch: Pitches.BALL,
            expected: {
                bases: { [Bases.FIRST]: 1 },
                atBat: 'away - playerB',
                awayTeam: {
                    roster: {
                        'away - playerA': {
                            offenseStats: {
                                plateAppearance: 1,
                                walks: 1,
                            }
                        },
                        'away - playerB': {
                            offenseStats: {
                                plateAppearance: 1,
                            }
                        }
                    }
                },
                pitches: [Pitches.BALL, Pitches.BALL, Pitches.BALL, Pitches.BALL]
            }
        },
    ];

    atBat.forEach(({ pitch, expected }) => {
        game = handlePitch(game, pitch);
        expect(game).toEqual(mergeDeepRight(defaultGame(), expected));
    });
});

test('2nd batter: single on 1,2 count', () => {
    const initial = { ...game };
    const atBat: atBat = [
        {
            pitch: Pitches.BALL,
            expected: { count: { balls: 1 }, bases: { [Bases.FIRST]: 1, }, pitches: [...initial.pitches, Pitches.BALL]}
        },
        {
            pitch: Pitches.STRIKE_FOUL,
            expected: { count: { balls: 1, strikes: 1 }, bases: { [Bases.FIRST]: 1, }, pitches: [...initial.pitches, Pitches.BALL, Pitches.STRIKE_FOUL] }
        },
        {
            pitch: Pitches.STRIKE_SWINGING,
            expected: { count: { balls: 1, strikes: 2 }, bases: { [Bases.FIRST]: 1, }, pitches: [...initial.pitches, Pitches.BALL, Pitches.STRIKE_FOUL, Pitches.STRIKE_SWINGING] }
        },
        {
            pitch: Pitches.INPLAY_OUTFIELD_SINGLE,
            expected: {
                bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, },
                atBat: 'away - playerC',
                awayTeam: {
                    roster: {
                        'away - playerB': {
                            offenseStats: {
                                atbats: 1,
                                hits: 1,
                                singles: 1,
                            }
                        },
                        'away - playerC': {
                            offenseStats: {
                                plateAppearance: 1,
                            }
                        },
                    }
                },
                pitches: [...initial.pitches, Pitches.BALL, Pitches.STRIKE_FOUL, Pitches.STRIKE_SWINGING, Pitches.INPLAY_OUTFIELD_SINGLE]
            }
        },
    ];

    atBat.forEach(({ pitch, expected }) => {
        game = handlePitch(game, pitch);
        expect(game).toEqual(mergeDeepRight(initial, expected));
    });
});

test('3rd batter: groud out on first pitch', () => {
    const initial = { ...game };
    const atBat: atBat = [
        {
            pitch: Pitches.INPLAY_INFIELD_GRD_OUT,
            expected: {
                outs: 1,
                bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, },
                atBat: 'away - playerD',
                awayTeam: {
                    roster: {
                        'away - playerC': {
                            offenseStats: {
                                plateAppearance: 1,
                                atbats: 1,
                                groundOuts: 1,
                            }
                        },
                        'away - playerD': {
                            offenseStats: {
                                plateAppearance: 1,
                            }
                        }
                    }
                },
                pitches: [...initial.pitches, Pitches.INPLAY_INFIELD_GRD_OUT] }
        },
    ];

    atBat.forEach(({ pitch, expected }) => {
        game = handlePitch(game, pitch);
        expect(game).toEqual(mergeDeepRight(initial, expected));
    });
});

test('4th batter: strikeout looking on 2,0 count', () => {
    const initial = { ...game };
    const atBat: atBat = [
        {
            pitch: Pitches.BALL,
            expected: { count: { balls: 1 }, outs: 1, bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, }, pitches: [...initial.pitches, Pitches.BALL ] }
        },
        {
            pitch: Pitches.BALL,
            expected: { count: { balls: 2 }, outs: 1, bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, }, pitches: [...initial.pitches, Pitches.BALL, Pitches.BALL ] }
        },
        {
            pitch: Pitches.STRIKE_LOOKING,
            expected: {
                outs: 2,
                bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1 },
                atBat: 'away - playerA',
                awayTeam: {
                    roster: {
                        'away - playerD': {
                            offenseStats: {
                                plateAppearance: 1,
                                atbats: 1,
                                strikeoutsLooking: 1,
                            }
                        },
                        'away - playerA': {
                            offenseStats: {
                                plateAppearance: 2,
                            }
                        }
                    }
                },
                pitches: [...initial.pitches, Pitches.BALL, Pitches.BALL, Pitches.STRIKE_LOOKING ] }
        },
    ];

    atBat.forEach(({ pitch, expected }) => {
        game = handlePitch(game, pitch);
        expect(game).toEqual(mergeDeepRight(initial, expected));
    });
});

test('5th batter: foul, foul, foul, infield error', () => {
    const initial = { ...game };
    const atBat: atBat = [
        {
            pitch: Pitches.STRIKE_FOUL,
            expected: { count: { strikes: 1 }, outs: 2, bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, }, pitches: [...initial.pitches, Pitches.STRIKE_FOUL] }
        },
        {
            pitch: Pitches.STRIKE_FOUL,
            expected: { count: { strikes: 2 }, outs: 2, bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, }, pitches: [...initial.pitches, Pitches.STRIKE_FOUL, Pitches.STRIKE_FOUL] }
        },
        {
            pitch: Pitches.STRIKE_FOUL,
            expected: { count: { strikes: 2 }, outs: 2, bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, }, pitches: [...initial.pitches, Pitches.STRIKE_FOUL, Pitches.STRIKE_FOUL, Pitches.STRIKE_FOUL] }
        },
        {
            pitch: Pitches.INPLAY_INFIELD_ERROR,
            expected: {
                outs: 2,
                bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, [Bases.THIRD]: 1, },
                atBat: 'away - playerB',
                awayTeam: {
                    roster: {
                        'away - playerA': {
                            offenseStats: {
                                plateAppearance: 2,
                                atbats: 1,
                                hits: 1,
                                singles: 1,
                            }
                        },
                        'away - playerB': {
                            offenseStats: {
                                plateAppearance: 2,
                            }
                        }
                    }
                },
                pitches: [...initial.pitches, Pitches.STRIKE_FOUL, Pitches.STRIKE_FOUL, Pitches.STRIKE_FOUL, Pitches.INPLAY_INFIELD_ERROR] }
        },
    ];

    atBat.forEach(({ pitch, expected }) => {
        game = handlePitch(game, pitch);
        expect(game).toEqual(mergeDeepRight(initial, expected));
    });
});

test('6th batter: grand slam! first pitch', () => {
    const initial = { ...game };
    const atBat: atBat = [
        {
            pitch: Pitches.INPLAY_HOMERUN,
            expected: {
                outs: 2,
                boxScore: [{ homeTeam: 0, awayTeam: 4 }],
                bases: { ...EMPTY_BASES },
                atBat: 'away - playerC',
                awayTeam: {
                    roster: {
                        'away - playerB': {
                            offenseStats: {
                                plateAppearance: 2,
                                atbats: 2,
                                hits: 2,
                                homeruns: 1,
                                grandslams: 1,
                                RBI: 4,
                                runs: 1,
                            }
                        },
                        'away - playerC': {
                            offenseStats: {
                                plateAppearance: 2,
                            }
                        }
                    }
                },
                pitches: [...initial.pitches, Pitches.INPLAY_HOMERUN]
            }
        },
    ];

    atBat.forEach(({ pitch, expected }) => {
        game = handlePitch(game, pitch);
        expect(game).toEqual(mergeDeepRight(initial, expected));
    });
});

test('7th batter: fly out on 1,0, ends the inning', () => {
    const initial = { ...game };
    const atBat: atBat = [
        {
            pitch: Pitches.BALL,
            expected: { count: { balls: 1 }, outs: 2, boxScore: [{ homeTeam: 0, awayTeam: 4 }], pitches: [...initial.pitches, Pitches.BALL] }

        },
        {
            pitch: Pitches.INPLAY_OUTFIELD_OUT,
            expected: {
                boxScore: [{ homeTeam: 0, awayTeam: 4 }],
                inning: { half: InningHalf.BOTTOM },
                outs: 0,
                atBat: 'home - playerA',
                nextHalfAtBat: 'away - playerD',
                awayTeam: {
                    roster: {
                        'away - playerC': {
                            offenseStats: {
                                atbats: 2,
                                flyOuts: 1,
                            }
                        },
                    }
                },
                pitches: [...initial.pitches, Pitches.BALL, Pitches.INPLAY_OUTFIELD_OUT]
            }
        },
    ];

    atBat.forEach(({ pitch, expected }) => {
        game = handlePitch(game, pitch);
        expect(game).toEqual(mergeDeepRight(initial, expected));
    });
});
