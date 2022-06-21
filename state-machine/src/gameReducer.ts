import { stat } from 'fs';
import mergeDeepRight from 'ramda/src/mergeDeepRight.js';
import { offenseStats } from './statsReducer';
import { Bases, Game, GameMoment, Inning, InningHalf, OptionalRules, StatEvent, Team } from './types';
import { Pitches } from './types';

const NEW_COUNT: GameMoment['count'] = {
    balls: 0,
    strikes: 0,
};

const EMPTY_BASES: GameMoment['bases'] = {
    [Bases.FIRST]: 0,
    [Bases.SECOND]: 0,
    [Bases.THIRD]: 0,
    [Bases.HOME]: 0,
};

const nextInning = (currentInning: Inning): Pick<GameMoment, 'inning' | 'outs' | 'count' | 'bases'> => ({
    inning: {
        number: currentInning.half === InningHalf.BOTTOM ? currentInning.number + 1 : currentInning.number,
        half: currentInning.half === InningHalf.BOTTOM ? InningHalf.TOP : InningHalf.BOTTOM,
    },
    outs: 0,
    count: NEW_COUNT,
    bases: EMPTY_BASES,
});

// moves runners on base forward `basesToAdvance` number of bases
const advanceRunners = (bases: GameMoment['bases'], basesToAdvance: number): GameMoment['bases'] => {
    switch (basesToAdvance) {
        case 1: {
            return {
                [Bases.HOME]: bases[Bases.HOME] + bases[Bases.THIRD],
                [Bases.THIRD]: bases[Bases.SECOND],
                [Bases.SECOND]: bases[Bases.FIRST],
                [Bases.FIRST]: 0,
            };
        }
        case 2: {
            return {
                [Bases.HOME]: bases[Bases.HOME] + bases[Bases.THIRD] + bases[Bases.SECOND],
                [Bases.THIRD]: bases[Bases.FIRST],
                [Bases.SECOND]: 0,
                [Bases.FIRST]: 0,
            };
        }
        case 3: {
            return {
                [Bases.HOME]:
                    bases[Bases.HOME] + bases[Bases.THIRD] + bases[Bases.SECOND] + bases[Bases.FIRST],
                [Bases.THIRD]: 0,
                [Bases.SECOND]: 0,
                [Bases.FIRST]: 0,
            };
        }
        case 4: {
            return {
                [Bases.HOME]:
                    bases[Bases.HOME] + bases[Bases.THIRD] + bases[Bases.SECOND] + bases[Bases.FIRST] + 1,
                [Bases.THIRD]: 0,
                [Bases.SECOND]: 0,
                [Bases.FIRST]: 0,
            };
        }
        default:
            return { ...bases };
    }
};

// runner furthest along the bases
// const leadRunner = (bases: GameMoment['bases']): Bases | undefined => {
//     if (bases[Bases.THIRD] > 0) return Bases.THIRD;
//     if (bases[Bases.SECOND] > 0) return Bases.SECOND;
//     if (bases[Bases.FIRST] > 0) return Bases.FIRST;
//     return undefined;
// }

// runner furthest along the bases, that is forced to advance
const forcedRunner = (bases: GameMoment['bases']): Bases | undefined => {
    if (bases[Bases.THIRD] > 0 && bases[Bases.SECOND] > 0 && bases[Bases.FIRST] > 0) return Bases.THIRD;
    if (bases[Bases.SECOND] > 0 && bases[Bases.FIRST] > 0) return Bases.SECOND;
    if (bases[Bases.FIRST] > 0) return Bases.FIRST;
    return undefined;
}

const strike = (state: GameMoment): GameMoment => {
    return countReducer({
        ...state,
        count: {
            ...state.count,
            strikes: state.count.strikes + 1
        }
    });
};

const foulBall = (state: GameMoment): GameMoment => {
    return {
        ...state,
        count: {
            ...state.count,
            strikes: Math.min(state.count.strikes + 1, state.configuration.maxStrikes - 1),
        }
    };
}

const out = (state: GameMoment): GameMoment => {
    return outsReducer({
        ...state,
        outs: state.outs + 1,
        count: NEW_COUNT,
    });
}

export const runnersOn = (state: GameMoment): number => {
    const { [Bases.FIRST]: first, [Bases.SECOND]: second, [Bases.THIRD]: third } = state.bases;
    return first + second + third;
};

// returns the next batter in the lineup for the offense, or the "next due up" for the defense
const whoisNextBatter = (state: GameMoment, offense: boolean = true): string => {
    const team = offense ? getOffense(state) : getDefense(state);
    const currentBatterOrder = team.lineup.indexOf(state.atBat);
    return currentBatterOrder >= 0 ? team.lineup[currentBatterOrder + (offense ? 1 : 0)] : team.lineup[0];
};

const batterUp = (state: GameMoment, inningChange: boolean = false): GameMoment => {
    const onDeck = inningChange ? state.nextHalfAtBat : whoisNextBatter(state);

    const next: GameMoment = {
        ...state,
        atBat: onDeck,
        nextHalfAtBat: inningChange ? whoisNextBatter(state, true) : state.nextHalfAtBat,
    };
    const offenseStatsTeam = inningChange ? getDefenseKey(next) : getOffenseKey(next)
    return {
        ...next,
        [offenseStatsTeam]: offenseStats(getOffense(state), state, StatEvent.PLATE_APPEARANCE),
    };
};

// state transitions, this is just a reducer
export function pitch(stateWithLoggedPitch: GameMoment, pitch: Pitches): GameMoment {
    const state = stateWithLoggedPitch;
    switch (pitch) {
        case Pitches.BALL:
            return countReducer({
                ...state,
                count: {
                    ...state.count,
                    balls: state.count.balls + 1
                }
            });
        case Pitches.BALL_WILD: {
            const notAWalk = state.configuration.rules[OptionalRules.RunnersAdvanceOnWildPitch]
                && state.count.balls < state.configuration.maxBalls - 1;
            // if isn't a walk, advance the runners (count reducer will handle walk simulation)
            return basesReducer(countReducer({
                ...state,
                bases: advanceRunners(state.bases, notAWalk ? 1 : 0),
                count: {
                    ...state.count,
                    balls: state.count.balls + 1
                }
            }));
        }
        case Pitches.STRIKE_SWINGING:
            return strike(state);
        case Pitches.STRIKE_LOOKING:
            // if enabled, acts as a strikeout
            if (state.configuration.rules[OptionalRules.CaughtLookingRule]) {
                return outsReducer({
                    ...state,
                    outs: state.outs + 1,
                    count: NEW_COUNT,
                });
            }
            // just another strike otherwise
            return strike(state);
        case Pitches.STRIKE_FOUL_ZONE:
            // if enabled, acts like a strikeout
            if (state.configuration.rules[OptionalRules.FoulToTheZoneIsStrikeOut]
                    && state.count.strikes === state.configuration.maxStrikes - 1) {
                return outsReducer({
                    ...state,
                    outs: state.outs + 1,
                    count: NEW_COUNT,
                });
            }
            // just another foul otherwise
            return foulBall(state);
        case Pitches.STRIKE_FOUL_CAUGHT:
        case Pitches.INPLAY_INFIELD_GRD_OUT:
        case Pitches.INPLAY_INFIELD_LINE_OUT:
            return out(state);
        case Pitches.INPLAY_OUTFIELD_OUT:
            const next = out(state);
            if (state.bases[Bases.THIRD] === 1 && state.outs < state.configuration.maxOuts - 1) {
                return basesReducer({
                    ...next,
                    bases: {
                        ...next.bases,
                        [Bases.THIRD]: 0,
                        [Bases.HOME]: next.bases[Bases.HOME] + 1
                    },
                });
            }
            return next;
        case Pitches.STRIKE_FOUL:
            return foulBall(state);
        case Pitches.INPLAY_INFIELD_OUT_DP_SUCCESS: {
            const forced = forcedRunner(state.bases);
            if (forced === undefined) {
                console.warn('double play attemped without a forced runner', state);
                return state;
            }
            return basesReducer(outsReducer({
                ...state,
                outs: state.outs + 2,
                count: NEW_COUNT,
                bases: {
                    ...advanceRunners(state.bases, 1),
                    [forced + 1]: 0,
                }
            }));
        }
        case Pitches.INPLAY_INFIELD_OUT_DP_FAIL: {
            const forced = forcedRunner(state.bases);
            if (forced === undefined) {
                console.warn('double play attemped without a forced runner', state);
                return state;
            }
            return basesReducer(outsReducer({
                ...state,
                outs: state.outs + 1,
                count: NEW_COUNT,
                bases: {
                    ...advanceRunners(state.bases, 1),
                    [forced + 1]: 0,
                    [Bases.FIRST]: 1,
                }
            }));
        }
        case Pitches.INPLAY_INFIELD_ERROR:
        case Pitches.INPLAY_INFIELD_SINGLE:
            return batterUp(basesReducer({
                ...state,
                count: NEW_COUNT,
                bases: {
                    ...advanceRunners(state.bases, 1),
                    [Bases.FIRST]: 1,
                },
            }));
        case Pitches.INPLAY_OUTFIELD_SINGLE: {
            const extraBase = state.configuration.rules[OptionalRules.RunnersAdvanceExtraOn2Outs]
                && state.outs === state.configuration.maxOuts - 1;
            return batterUp(basesReducer({
                ...state,
                count: NEW_COUNT,
                bases: {
                    ...advanceRunners(state.bases, extraBase ? 2 : 1),
                    [Bases.FIRST]: 1,
                },
            }));
        }
        case Pitches.INPLAY_DOUBLE: {
            const extraBase = state.configuration.rules[OptionalRules.RunnersAdvanceExtraOn2Outs]
                && state.outs === state.configuration.maxOuts - 1;
            return batterUp(basesReducer({
                ...state,
                count: NEW_COUNT,
                bases: {
                    ...advanceRunners(state.bases, extraBase ? 3 : 2),
                    [Bases.SECOND]: 1,
                },
            }));
        }
        case Pitches.INPLAY_TRIPLE:
            return batterUp(basesReducer({
                ...state,
                count: NEW_COUNT,
                bases: {
                    ...advanceRunners(state.bases, 3),
                    [Bases.THIRD]: 1,
                },
            }));
        case Pitches.INPLAY_HOMERUN: {
            return batterUp(basesReducer({
                ...state,
                count: NEW_COUNT,
                bases: advanceRunners(state.bases, 4),
            }));
        }
        default:
            console.warn('PITCH NOT IMPLEMENTED', pitch);
            return state;
    }
}

const getOffense = (game: GameMoment): Team => {
    return game.inning.half === InningHalf.TOP ? game.awayTeam : game.homeTeam;
};

const getOffenseKey = (game: GameMoment): keyof Pick<GameMoment, 'awayTeam' | 'homeTeam'> => {
    return game.inning.half === InningHalf.TOP ? 'awayTeam' : 'homeTeam';
};

const getDefense = (game: GameMoment): Team => {
    return game.inning.half === InningHalf.TOP ? game.homeTeam : game.awayTeam;
};

const getDefenseKey = (game: GameMoment): keyof Pick<GameMoment, 'awayTeam' | 'homeTeam'> => {
    return game.inning.half === InningHalf.TOP ? 'homeTeam' : 'awayTeam';
};

// **********************
//   SECONDARY REDUCERS
// **********************

// counts can "overflow" and cascade into outs and bases
function countReducer(intermediate: GameMoment): GameMoment {
    if (intermediate.count.balls >= intermediate.configuration.maxBalls) {
        const withStats = {
            ...intermediate,
            [getOffenseKey(intermediate)]: offenseStats(getOffense(intermediate), intermediate, StatEvent.WALK),
        };
        return batterUp(basesReducer(mergeDeepRight(withStats, {
            count: NEW_COUNT,
            bases: {
                ...advanceRunners(withStats.bases, 1),
                [Bases.FIRST]: 1,
            }
        })));
    }
    if (intermediate.count.strikes >= intermediate.configuration.maxStrikes) {
        return batterUp(outsReducer(mergeDeepRight(intermediate, { outs: intermediate.outs + 1, count: NEW_COUNT })));
    }
    return intermediate;
}

// bases can "overflow" and cascade into runs
function basesReducer(intermediate: GameMoment): GameMoment {
    if (intermediate.bases[Bases.HOME] > 0) {
        const withStats = {
            ...intermediate,
            [getOffenseKey(intermediate)]: offenseStats(getOffense(intermediate), intermediate, StatEvent.RBI),
        };
        const newScore = [...withStats.boxScore];
        const offense = withStats.inning.half === InningHalf.TOP ? 'away' : 'home';
        newScore[withStats.inning.number - 1][offense] += withStats.bases[Bases.HOME];
        return runsReducer(mergeDeepRight(withStats, {
            bases: {
                [Bases.HOME]: 0,
            },
        }));
    }
    return intermediate;
}

// runs can "overflow" and cascade into innings
function runsReducer(intermediate: GameMoment): GameMoment {
    // TODO implement run limit, next batter won't be up
    return intermediate;
}

// outs can "overflow" and cascade into innings
function outsReducer(intermediate: GameMoment): GameMoment {
    if (intermediate.outs >= intermediate.configuration.maxOuts) {
        // end of inning, signal for LOB stats
        const withStats = {
            ...intermediate,
            [getOffenseKey(intermediate)]: offenseStats(getOffense(intermediate), intermediate, StatEvent.INNING_END),
        };
        const needsBatterSwitch: GameMoment = mergeDeepRight(withStats, {
            ...nextInning(withStats.inning),
        });
        return batterUp(needsBatterSwitch, true);
    }
    return batterUp(intermediate);
}

// innings can "overflow" and casacde into `game over`
function inningsReducer(intermediate: GameMoment): GameMoment {
    // TODO calculate end of game
    const withStats = {
        ...intermediate,
        [getOffenseKey(intermediate)]: offenseStats(getOffense(intermediate), intermediate, StatEvent.PLATE_APPEARANCE),
    };
    return withStats;
}
