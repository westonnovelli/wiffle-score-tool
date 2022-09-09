import mergeDeepRight from 'ramda/src/mergeDeepRight.js';

import { GameMoment, DeepPartial, Pitches, InningHalf, Bases, Position } from './types';
import hydrateGame from './history/hydrate';
import { defaultGame, defaultTeam, EMPTY_BASES } from './factory';
import { pitch as handlePitch, start } from './gameReducer';
import { deserializeGame, serializeGame } from './io';
import manualEdit from './edits/manualEdit';

type atBat = {
    pitch: Pitches,
    expected: DeepPartial<GameMoment>
}[];

let game: GameMoment = start(defaultGame(defaultTeam('1', 'away'), defaultTeam('2', 'home')));

function getBaseGame() {
    return start(defaultGame(defaultTeam(game.awayTeam.id, game.awayTeam.name), defaultTeam(game.homeTeam.id, game.homeTeam.name)));
}

test('1st batter: Lead off walk', () => {
    const atBat: atBat = [
        {
            pitch: Pitches.BALL,
            expected: {
                count: { balls: 1 },
                homeTeam: {
                    roster: {
                        '4': {
                            defenseStats: {
                                pitching: {
                                    balls: 1,
                                }
                            }
                        }
                    }
                },
                pitches: [Pitches.BALL]
            }
        },
        {
            pitch: Pitches.BALL,
            expected: {
                count: { balls: 2 },
                homeTeam: {
                    roster: {
                        '4': {
                            defenseStats: {
                                pitching: {
                                    balls: 2,
                                    battersFaced: 1,
                                }
                            }
                        }
                    }
                },
                pitches: [Pitches.BALL, Pitches.BALL]
            }
        },
        {
            pitch: Pitches.BALL,
            expected: {
                count: { balls: 3 },
                homeTeam: {
                    roster: {
                        '4': {
                            defenseStats: {
                                pitching: {
                                    balls: 3,
                                    battersFaced: 1,
                                }
                            }
                        }
                    }
                },
                pitches: [Pitches.BALL, Pitches.BALL, Pitches.BALL]
            }
        },
        {
            pitch: Pitches.BALL,
            expected: {
                bases: { [Bases.FIRST]: 1 },
                atBat: '1',
                awayTeam: {
                    roster: {
                        '0': {
                            offenseStats: {
                                plateAppearance: 1,
                                walks: 1,
                            }
                        },
                        '1': {
                            offenseStats: {
                                plateAppearance: 1,
                            }
                        }
                    }
                },
                homeTeam: {
                    roster: {
                        '4': {
                            defenseStats: {
                                pitching: {
                                    balls: 4,
                                    walks: 1,
                                    battersFaced: 2,
                                }
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
        expect(game).toEqual(mergeDeepRight(getBaseGame(), expected));
    });
});

test('2nd batter: single on 1,2 count', () => {
    const initial = { ...game };
    const atBat: atBat = [
        {
            pitch: Pitches.BALL,
            expected: {
                count: { balls: 1 },
                bases: { [Bases.FIRST]: 1, },
                homeTeam: {
                    roster: {
                        '4': {
                            defenseStats: {
                                pitching: {
                                    balls: 5,
                                }
                            }
                        }
                    }
                },
                pitches: [...initial.pitches, Pitches.BALL]
            }
        },
        {
            pitch: Pitches.STRIKE_FOUL,
            expected: {
                count: { balls: 1, strikes: 1 },
                bases: { [Bases.FIRST]: 1, },
                homeTeam: {
                    roster: {
                        '4': {
                            defenseStats: {
                                pitching: {
                                    balls: 5,
                                    strikes: 1,
                                    battersFaced: 2,
                                }
                            }
                        }
                    }
                },
                pitches: [...initial.pitches, Pitches.BALL, Pitches.STRIKE_FOUL]
            }
        },
        {
            pitch: Pitches.STRIKE_SWINGING,
            expected: {
                count: { balls: 1, strikes: 2 },
                bases: { [Bases.FIRST]: 1, },
                homeTeam: {
                    roster: {
                        '4': {
                            defenseStats: {
                                pitching: {
                                    balls: 5,
                                    strikes: 2,
                                    battersFaced: 2,
                                }
                            }
                        }
                    }
                },
                pitches: [...initial.pitches, Pitches.BALL, Pitches.STRIKE_FOUL, Pitches.STRIKE_SWINGING]
            }
        },
        {
            pitch: Pitches.INPLAY_OUTFIELD_SINGLE,
            expected: {
                bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, },
                atBat: '2',
                awayTeam: {
                    roster: {
                        '1': {
                            offenseStats: {
                                atbats: 1,
                                hits: 1,
                                singles: 1,
                            }
                        },
                        '2': {
                            offenseStats: {
                                plateAppearance: 1,
                            }
                        },
                    }
                },
                homeTeam: {
                    roster: {
                        '4': {
                            defenseStats: {
                                pitching: {
                                    balls: 5,
                                    strikes: 2,
                                    singles: 1,
                                    battersFaced: 3,
                                }
                            }
                        }
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

test('3rd batter: ground out on first pitch', () => {
    const initial = { ...game };
    const atBat: atBat = [
        {
            pitch: Pitches.INPLAY_INFIELD_GRD_OUT,
            expected: {
                outs: 1,
                bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, },
                atBat: '3',
                awayTeam: {
                    roster: {
                        '2': {
                            offenseStats: {
                                plateAppearance: 1,
                                atbats: 1,
                                groundOuts: 1,
                            }
                        },
                        '3': {
                            offenseStats: {
                                plateAppearance: 1,
                            }
                        }
                    }
                },
                homeTeam: {
                    roster: {
                        '4': {
                            defenseStats: {
                                pitching: {
                                    groundOuts: 1,
                                    battersFaced: 4,
                                }
                            }
                        }
                    }
                },
                pitches: [...initial.pitches, Pitches.INPLAY_INFIELD_GRD_OUT]
            }
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
            expected: {
                count: { balls: 1 },
                outs: 1,
                bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, },
                homeTeam: {
                    roster: {
                        '4': {
                            defenseStats: {
                                pitching: {
                                    balls: 6,
                                }
                            }
                        }
                    }
                },
                pitches: [...initial.pitches, Pitches.BALL] }
        },
        {
            pitch: Pitches.BALL,
            expected: {
                count: { balls: 2 },
                outs: 1,
                bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, },
                homeTeam: {
                    roster: {
                        '4': {
                            defenseStats: {
                                pitching: {
                                    balls: 7,
                                    battersFaced: 4,
                                }
                            }
                        }
                    }
                },
                pitches: [...initial.pitches, Pitches.BALL, Pitches.BALL]
            }
        },
        {
            pitch: Pitches.STRIKE_LOOKING,
            expected: {
                outs: 2,
                bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1 },
                atBat: '0',
                awayTeam: {
                    roster: {
                        '3': {
                            offenseStats: {
                                plateAppearance: 1,
                                atbats: 1,
                                strikeoutsLooking: 1,
                            }
                        },
                        '0': {
                            offenseStats: {
                                plateAppearance: 2,
                            }
                        }
                    }
                },
                homeTeam: {
                    roster: {
                        '4': {
                            defenseStats: {
                                pitching: {
                                    balls: 7,
                                    strikes: 3,
                                    strikeoutsLooking: 1,
                                    battersFaced: 5,
                                }
                            }
                        }
                    }
                },
                pitches: [...initial.pitches, Pitches.BALL, Pitches.BALL, Pitches.STRIKE_LOOKING]
            }
        },
    ];

    atBat.forEach(({ pitch, expected }) => {
        game = handlePitch(game, pitch);
        expect(game).toEqual(mergeDeepRight(initial, expected));
    });
});

test('5th batter: foul, foul, foul, infield single', () => {
    const initial = { ...game };
    const atBat: atBat = [
        {
            pitch: Pitches.STRIKE_FOUL,
            expected: {
                count: { strikes: 1 },
                outs: 2,
                bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, },
                homeTeam: {
                    roster: {
                        '4': {
                            defenseStats: {
                                pitching: {
                                    strikes: 4,
                                }
                            }
                        }
                    }
                },
                pitches: [...initial.pitches, Pitches.STRIKE_FOUL] }
        },
        {
            pitch: Pitches.STRIKE_FOUL,
            expected: {
                count: { strikes: 2 },
                outs: 2,
                bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, },
                homeTeam: {
                    roster: {
                        '4': {
                            defenseStats: {
                                pitching: {
                                    strikes: 5,
                                    battersFaced: 5,
                                }
                            }
                        }
                    }
                },
                pitches: [...initial.pitches, Pitches.STRIKE_FOUL, Pitches.STRIKE_FOUL]
            }
        },
        {
            pitch: Pitches.STRIKE_FOUL,
            expected: {
                count: { strikes: 2 },
                outs: 2,
                bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, },
                homeTeam: {
                    roster: {
                        '4': {
                            defenseStats: {
                                pitching: {
                                    strikes: 6,
                                    battersFaced: 5,
                                }
                            }
                        }
                    }
                },
                pitches: [...initial.pitches, Pitches.STRIKE_FOUL, Pitches.STRIKE_FOUL, Pitches.STRIKE_FOUL]
            }
        },
        {
            pitch: Pitches.INPLAY_INFIELD_SINGLE,
            expected: {
                outs: 2,
                bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, [Bases.THIRD]: 1, },
                atBat: '1',
                awayTeam: {
                    roster: {
                        '0': {
                            offenseStats: {
                                plateAppearance: 2,
                                atbats: 1,
                                hits: 1,
                                singles: 1,
                            }
                        },
                        '1': {
                            offenseStats: {
                                plateAppearance: 2,
                            }
                        }
                    }
                },
                homeTeam: {
                    roster: {
                        '4': {
                            defenseStats: {
                                pitching: {
                                    strikes: 6,
                                    singles: 2,
                                    battersFaced: 6,
                                }
                            }
                        }
                    }
                },
                pitches: [...initial.pitches, Pitches.STRIKE_FOUL, Pitches.STRIKE_FOUL, Pitches.STRIKE_FOUL, Pitches.INPLAY_INFIELD_SINGLE]
            }
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
                atBat: '2',
                awayTeam: {
                    roster: {
                        '1': {
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
                        '2': {
                            offenseStats: {
                                plateAppearance: 2,
                            }
                        }
                    }
                },
                homeTeam: {
                    roster: {
                        '4': {
                            defenseStats: {
                                pitching: {
                                    homeruns: 1,
                                    runsAllowed: 4,
                                    battersFaced: 7,
                                }
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
            expected: {
                count: { balls: 1 },
                outs: 2,
                boxScore: [{ homeTeam: 0, awayTeam: 4 }],
                homeTeam: {
                    roster: {
                        '4': {
                            defenseStats: {
                                pitching: {
                                    balls: 8,
                                }
                            }
                        }
                    }
                },
                pitches: [...initial.pitches, Pitches.BALL]
            }
        },
        {
            pitch: Pitches.INPLAY_OUTFIELD_OUT,
            expected: {
                boxScore: [{ homeTeam: 0, awayTeam: 4 }],
                inning: { half: InningHalf.BOTTOM },
                outs: 0,
                atBat: '4',
                nextHalfAtBat: '3',
                awayTeam: {
                    roster: {
                        '0': {
                            defenseStats: {
                                pitching: {
                                    battersFaced: 1,
                                }
                            }
                        },
                        '2': {
                            offenseStats: {
                                atbats: 2,
                                flyOuts: 1,
                            }
                        },
                    }
                },
                homeTeam: {
                    roster: {
                        '4': {
                            offenseStats: {
                                plateAppearance: 1,
                            },
                            defenseStats: {
                                pitching: {
                                    balls: 8,
                                    flyOuts: 1,
                                    battersFaced: 7,
                                }
                            }
                        }
                    }
                },
                // TODO this probably needs to have a plate appearance for the homeTeam at the end of this
                // and a batter faced for the next pitcher
                pitches: [...initial.pitches, Pitches.BALL, Pitches.INPLAY_OUTFIELD_OUT]
            }
        },
    ];

    atBat.forEach(({ pitch, expected }) => {
        game = handlePitch(game, pitch);
        expect(game).toEqual(mergeDeepRight(initial, expected));
    });
});


test('next inning - batter 1: triple, first pitch', () => {
    const initial = { ...game };
    const atBat: atBat = [
        {
            pitch: Pitches.INPLAY_TRIPLE,
            expected: {
                atBat: '5',
                bases: { [Bases.THIRD]: 1 },
                homeTeam: {
                    roster: {
                        '4': {
                            offenseStats: {
                                plateAppearance: 1,
                                atbats: 1,
                                hits: 1,
                                triples: 1,
                            }
                        },
                        '5': {
                            offenseStats: {
                                plateAppearance: 1,
                            }
                        }
                    }
                },
                awayTeam: {
                    roster: {
                        '0': {
                            defenseStats: {
                                pitching: {
                                    triples: 1,
                                    battersFaced: 2,
                                }
                            }
                        }
                    }
                },
                pitches: [...initial.pitches, Pitches.INPLAY_TRIPLE]
            }
        },
    ];

    atBat.forEach(({ pitch, expected }) => {
        game = handlePitch(game, pitch);
        expect(game).toEqual(mergeDeepRight(initial, expected));
    });
});

test('batter 2: sac fly, runner tags', () => {
    const initial = { ...game };
    const atBat: atBat = [
        {
            pitch: Pitches.INPLAY_OUTFIELD_OUT_TAG_SUCCESS,
            expected: {
                atBat: '6',
                bases: { [Bases.THIRD]: 0 },
                outs: 1,
                boxScore: [{ awayTeam: 4, homeTeam: 1 }],
                homeTeam: {
                    roster: {
                        '5': {
                            offenseStats: {
                                atbats: 1,
                                flyOuts: 1,
                                sacrificeFly: 1,
                                RBI: 1
                            }
                        },
                        '6': {
                            offenseStats: {
                                plateAppearance: 1,
                            }
                        }
                    }
                },
                awayTeam: {
                    roster: {
                        '0': {
                            defenseStats: {
                                pitching: {
                                    flyOuts: 1,
                                    runsAllowed: 1,
                                    battersFaced: 3,
                                }
                            }
                        }
                    }
                },
                pitches: [...initial.pitches, Pitches.INPLAY_OUTFIELD_OUT_TAG_SUCCESS]
            }
        },
    ];

    atBat.forEach(({ pitch, expected }) => {
        game = handlePitch(game, pitch);
        expect(game).toEqual(mergeDeepRight(initial, expected));
    });
});

test('manual edit adjusts the game state', () => {
    const initial = { ...game };
    const edit: DeepPartial<GameMoment> = { bases: { [Bases.FIRST]: 1 } };
    game = manualEdit(game, edit);
    const expected = {
        bases: { [Bases.FIRST]: 1 },
        pitches: [...initial.pitches, -1],
        manualEdits: [{ ...edit }],
    }
    expect(game).toEqual(mergeDeepRight(initial, expected));
});

test('saving and loading the game results in the same state', () => {
    const initial = { ...game };
    const saved = serializeGame(game);
    expect(hydrateGame(deserializeGame(saved))).toEqual(initial);
});

test('saving and loading the game in the same state with multiple roster edits', () => {
    const initial = manualEdit(game, {
        homeTeam: {
            roster: {
                '4': {
                    id: '4',
                    name: 'billy',
                }
            }
        }
    });

    const edit: DeepPartial<GameMoment> = {
        awayTeam: {
            defense: {
                '0': Position.Bench,
                '1': Position.Pitcher,
                '3': Position.Infield,
            }
        }
    };
    const next = manualEdit(initial, edit);
    const diff = {
        ...edit,
        pitches: [...initial.pitches, -1],
        manualEdits: [...initial.manualEdits, edit],
    };
    expect(next).toEqual(mergeDeepRight(initial, diff));

    const saved = serializeGame(next);
    expect(hydrateGame(deserializeGame(saved))).toEqual(next);
});
