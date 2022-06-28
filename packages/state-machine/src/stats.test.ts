import mergeDeepRight from "ramda/src/mergeDeepRight.js";
import { defaultGame, defaultTeam } from "./factory";
import { offenseStats } from "./statsReducer";
import { Bases, DeepPartial, GameMoment, Pitches, StatEvent, Team } from "./types";

describe('[offenseStats]', () => {
    describe('events', () => {
        test('a plate appearance updates the stat for the batter', () => {
            const game: GameMoment = defaultGame();
            const initial: Team = game.awayTeam;
            const event: StatEvent = StatEvent.PLATE_APPEARANCE;
            const diff: DeepPartial<Team> = {
                roster: {
                    '0': {
                        offenseStats: {
                            plateAppearance: 2, // game defaults lead off PA to 1 to simplify startup
                        }
                    }
                }
            };

            expect(offenseStats(initial, game, event)).toEqual(mergeDeepRight(initial, diff));
        });

        test('a walk updates the stat for the batter', () => {
            const game: GameMoment = defaultGame();
            const initial: Team = game.awayTeam;
            const event: StatEvent = StatEvent.WALK;
            const diff: DeepPartial<Team> = {
                roster: {
                    '0': {
                        offenseStats: {
                            walks: 1,
                        }
                    }
                }
            };

            expect(offenseStats(initial, game, event)).toEqual(mergeDeepRight(initial, diff));
        });

        test('an RBI updates the stat for the batter with the number of runs (currently at the plate)', () => {
            const game: GameMoment = defaultGame();
            const initial: Team = game.awayTeam;
            const event: StatEvent = StatEvent.RBI;
            const diff: DeepPartial<Team> = {
                roster: {
                    '0': {
                        offenseStats: {
                            RBI: 7,
                        }
                    }
                }
            };

            const state = mergeDeepRight(game, { bases: { [Bases.HOME]: 7  }});
            expect(offenseStats(initial, state, event)).toEqual(mergeDeepRight(initial, diff));
        });

        test('an inningEnd updates the LOB stat for the batter with the number of runners on)', () => {
            const game: GameMoment = defaultGame();
            const initial: Team = game.awayTeam;
            const event: StatEvent = StatEvent.INNING_END;
            const diff: DeepPartial<Team> = {
                roster: {
                    '0': {
                        offenseStats: {
                            LOB: 7,
                        }
                    }
                }
            };

            const state = mergeDeepRight(game, { bases: {
                [Bases.FIRST]: 5,
                [Bases.SECOND]: 1,
                [Bases.THIRD]: 1,
            }});
            expect(offenseStats(initial, state, event)).toEqual(mergeDeepRight(initial, diff));
        });

        test('a walk off updates the stat for the batter', () => {
            const game: GameMoment = defaultGame();
            const initial: Team = game.awayTeam;
            const event: StatEvent = StatEvent.WALK_OFF;
            const diff: DeepPartial<Team> = {
                roster: {
                    '0': {
                        offenseStats: {
                            walkoffs: 1,
                        }
                    }
                }
            };

            expect(offenseStats(initial, game, event)).toEqual(mergeDeepRight(initial, diff));
        });
    });

    describe('pitches', () => {
        test('a foul into the zone on 2 strikes is an out, updates the stats for the batter (AB, K)', () => {
            const game: GameMoment = defaultGame();
            const initial: Team = game.awayTeam;
            const state = mergeDeepRight(game, {
                count: {
                    strikes: 2,
                }
            });
            const thrown: Pitches = Pitches.STRIKE_FOUL_ZONE;
            const diff: DeepPartial<Team> = {
                roster: {
                    '0': {
                        offenseStats: {
                            atbats: 1,
                            strikeoutsSwinging: 1,
                        }
                    }
                }
            };

            expect(offenseStats(initial, state, thrown)).toEqual(mergeDeepRight(initial, diff));
        });

        test('a strikeout (swinging) updates for the batter (AB, K)', () => {
            const game: GameMoment = defaultGame();
            const initial: Team = game.awayTeam;
            const state = mergeDeepRight(game, {
                count: {
                    strikes: 3,
                }
            });
            const thrown: Pitches = Pitches.STRIKE_SWINGING;
            const diff: DeepPartial<Team> = {
                roster: {
                    '0': {
                        offenseStats: {
                            atbats: 1,
                            strikeoutsSwinging: 1,
                        }
                    }
                }
            };

            expect(offenseStats(initial, state, thrown)).toEqual(mergeDeepRight(initial, diff));
        });

        test('a strikeout (looking) updates for the batter (AB, _K)', () => {
            const game: GameMoment = defaultGame();
            const initial: Team = game.awayTeam;
            const state = mergeDeepRight(game, {
                count: {
                    strikes: 1,
                }
            });
            const thrown: Pitches = Pitches.STRIKE_LOOKING;
            const diff: DeepPartial<Team> = {
                roster: {
                    '0': {
                        offenseStats: {
                            atbats: 1,
                            strikeoutsLooking: 1,
                        }
                    }
                }
            };

            expect(offenseStats(initial, state, thrown)).toEqual(mergeDeepRight(initial, diff));
        });

        test('a foul does not updates any stats', () => {
            const game: GameMoment = defaultGame();
            const initial: Team = game.awayTeam;
            const thrown: Pitches = Pitches.STRIKE_FOUL;

            expect(offenseStats(initial, game, thrown)).toEqual(mergeDeepRight(initial, {}));
        });

        test('a foul, caught for an out, updates the batter (AB)', () => {
            const game: GameMoment = defaultGame();
            const initial: Team = game.awayTeam;
            const thrown: Pitches = Pitches.STRIKE_FOUL_CAUGHT;
            const diff: DeepPartial<Team> = {
                roster: {
                    '0': {
                        offenseStats: {
                            atbats: 1,
                            flyOuts: 1,
                        }
                    }
                }
            };

            expect(offenseStats(initial, game, thrown)).toEqual(mergeDeepRight(initial, diff));
        });

        test('a ground out updates for the batter (AB, Grd)', () => {
            const game: GameMoment = defaultGame();
            const initial: Team = game.awayTeam;
            const thrown: Pitches = Pitches.INPLAY_INFIELD_GRD_OUT;
            const diff: DeepPartial<Team> = {
                roster: {
                    '0': {
                        offenseStats: {
                            atbats: 1,
                            groundOuts: 1,
                        }
                    }
                }
            };

            expect(offenseStats(initial, game, thrown)).toEqual(mergeDeepRight(initial, diff));
        });

        test('a ground out into a doubleplay updates for the batter (AB, GrdDP)', () => {
            const game: GameMoment = defaultGame();
            const initial: Team = game.awayTeam;
            const state = mergeDeepRight(game, {
                bases: {
                    [Bases.FIRST]: 1
                }
            });
            const thrown: Pitches = Pitches.INPLAY_INFIELD_OUT_DP_SUCCESS;
            const diff: DeepPartial<Team> = {
                roster: {
                    '0': {
                        offenseStats: {
                            atbats: 1,
                            groundOuts: 1,
                            doublePlays: 1,
                        }
                    }
                }
            };

            expect(offenseStats(initial, state, thrown)).toEqual(mergeDeepRight(initial, diff));
        });

        test('a fielder\'s choice updates for the batter (AB)', () => {
            const game: GameMoment = defaultGame();
            const initial: Team = game.awayTeam;
            const state = mergeDeepRight(game, {
                bases: {
                    [Bases.FIRST]: 1
                }
            });
            const thrown: Pitches = Pitches.INPLAY_INFIELD_OUT_DP_FAIL;
            const diff: DeepPartial<Team> = {
                roster: {
                    '0': {
                        offenseStats: {
                            atbats: 1,
                            doublePlayFails: 1,
                        }
                    }
                }
            };

            expect(offenseStats(initial, state, thrown)).toEqual(mergeDeepRight(initial, diff));
        });

        test('a flyout updates the stats for the batter (AB, FLO)', () => {
            const game: GameMoment = defaultGame();
            const initial: Team = game.awayTeam;
            const thrown: Pitches = Pitches.INPLAY_OUTFIELD_OUT;
            const diff: DeepPartial<Team> = {
                roster: {
                    '0': {
                        offenseStats: {
                            atbats: 1,
                            flyOuts: 1,
                        }
                    }
                }
            };

            expect(offenseStats(initial, game, thrown)).toEqual(mergeDeepRight(initial, diff));
        });

        test('an infield lineout updates the stat for the batter (AB, FLO)', () => {
            const game: GameMoment = defaultGame();
            const initial: Team = game.awayTeam;
            const thrown: Pitches = Pitches.INPLAY_INFIELD_AIR_OUT;
            const diff: DeepPartial<Team> = {
                roster: {
                    '0': {
                        offenseStats: {
                            atbats: 1,
                            flyOuts: 1,
                        }
                    }
                }
            };

            expect(offenseStats(initial, game, thrown)).toEqual(mergeDeepRight(initial, diff));
        });

        test('an infield error (a single) updates for the batter (AB, H, 1B)', () => {
            const game: GameMoment = defaultGame();
            const initial: Team = game.awayTeam;
            const thrown: Pitches = Pitches.INPLAY_INFIELD_ERROR;
            const diff: DeepPartial<Team> = {
                roster: {
                    '0': {
                        offenseStats: {
                            atbats: 1,
                            hits: 1,
                            singles: 1,
                        }
                    }
                }
            };

            expect(offenseStats(initial, game, thrown)).toEqual(mergeDeepRight(initial, diff));
        });

        test('an infield single updates for the batter (AB, H, 1B)', () => {
            const game: GameMoment = defaultGame();
            const initial: Team = game.awayTeam;
            const thrown: Pitches = Pitches.INPLAY_INFIELD_SINGLE;
            const diff: DeepPartial<Team> = {
                roster: {
                    '0': {
                        offenseStats: {
                            atbats: 1,
                            hits: 1,
                            singles: 1,
                        }
                    }
                }
            };

            expect(offenseStats(initial, game, thrown)).toEqual(mergeDeepRight(initial, diff));
        });

        test('an outfield single updates for the batter (AB, H, 1B)', () => {
            const game: GameMoment = defaultGame();
            const initial: Team = game.awayTeam;
            const thrown: Pitches = Pitches.INPLAY_OUTFIELD_SINGLE;
            const diff: DeepPartial<Team> = {
                roster: {
                    '0': {
                        offenseStats: {
                            atbats: 1,
                            hits: 1,
                            singles: 1,
                        }
                    }
                }
            };

            expect(offenseStats(initial, game, thrown)).toEqual(mergeDeepRight(initial, diff));
        });

        test('a double updates for the batter (AB, H, 2B)', () => {
            const game: GameMoment = defaultGame();
            const initial: Team = game.awayTeam;
            const thrown: Pitches = Pitches.INPLAY_DOUBLE;
            const diff: DeepPartial<Team> = {
                roster: {
                    '0': {
                        offenseStats: {
                            atbats: 1,
                            hits: 1,
                            doubles: 1, 
                        }
                    }
                }
            };

            expect(offenseStats(initial, game, thrown)).toEqual(mergeDeepRight(initial, diff));
        });

        test('a triple updates for the batter (AB, H, 3B)', () => {
            const game: GameMoment = defaultGame();
            const initial: Team = game.awayTeam;
            const thrown: Pitches = Pitches.INPLAY_TRIPLE;
            const diff: DeepPartial<Team> = {
                roster: {
                    '0': {
                        offenseStats: {
                            atbats: 1,
                            hits: 1,
                            triples: 1, 
                        }
                    }
                }
            };

            expect(offenseStats(initial, game, thrown)).toEqual(mergeDeepRight(initial, diff));
        });

        test('a homerun updates for the batter (AB, H, HR, R)', () => {
            const game: GameMoment = defaultGame();
            const initial: Team = game.awayTeam;
            const thrown: Pitches = Pitches.INPLAY_HOMERUN;
            const diff: DeepPartial<Team> = {
                roster: {
                    '0': {
                        offenseStats: {
                            atbats: 1,
                            hits: 1,
                            homeruns: 1,
                            runs: 1,
                        }
                    }
                }
            };

            expect(offenseStats(initial, game, thrown)).toEqual(mergeDeepRight(initial, diff));
        });

        test('a grand slam updates for the batter (AB, H, HR, R)', () => {
            const game: GameMoment = defaultGame();
            const initial: Team = game.awayTeam;
            const state = mergeDeepRight(game, {
                bases: {
                    [Bases.HOME]: 4,
                }
            });
            const thrown: Pitches = Pitches.INPLAY_HOMERUN;
            const diff: DeepPartial<Team> = {
                roster: {
                    '0': {
                        offenseStats: {
                            atbats: 1,
                            hits: 1,
                            homeruns: 1,
                            runs: 1,
                            grandslams: 1,
                        }
                    }
                }
            };

            expect(offenseStats(initial, state, thrown)).toEqual(mergeDeepRight(initial, diff));
        });
    });
});

describe('[defenseStats]', () => {

});
