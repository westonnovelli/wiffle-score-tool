import { stat } from 'fs';
import mergeDeepRight from 'ramda/src/mergeDeepRight.js';
import { offenseStats } from './statsReducer';
import { Bases, Game, GameMoment, Inning, InningHalf, StatEvent, Team } from './types';
import { Pitches } from './types';

export const MAX_BALLS = 4;
export const MAX_STRIKES = 3;
export const MAX_OUTS = 3;

export enum OptionalRules {
    RunnersAdvanceOnWildPitch,
    RunnersAdvanceExtraOn2Outs,
    CaughtLookingRule,
    FoulToTheZoneIsStrikeOut,
    ThirdBaseCanTag,
}

export const Rules: Record<OptionalRules, boolean> = {
    [OptionalRules.RunnersAdvanceOnWildPitch]: true,
    [OptionalRules.RunnersAdvanceExtraOn2Outs]: true,
    [OptionalRules.CaughtLookingRule]: true,
    [OptionalRules.FoulToTheZoneIsStrikeOut]: true,
    [OptionalRules.ThirdBaseCanTag]: true,
};

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
            strikes: Math.min(state.count.strikes + 1, MAX_STRIKES - 1),
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

const whoisNextBatter = (state: GameMoment): string => {
    const offense = getOffense(state);
    const currentBatterOrder = offense.lineup.indexOf(state.atBat);
    return currentBatterOrder >= 0 ? offense.lineup[currentBatterOrder + 1] : offense.lineup[0];
};

const batterUp = (state: GameMoment, inningChange: boolean = false): GameMoment => {
    const onDeck = inningChange ? state.nextHalfAtBat : whoisNextBatter(state);
    offenseStats(getOffense(state), state, StatEvent.PLATE_APPEARANCE);
    return {
        ...state,
        atBat: onDeck,
    };
}

// state transitions, this is just a reducer
export function pitch(stateWithLoggedPitch: GameMoment, pitch: Pitches): GameMoment {
    switch (pitch) {
        case Pitches.BALL:
            return countReducer({
                ...stateWithLoggedPitch,
                count: {
                    ...stateWithLoggedPitch.count,
                    balls: stateWithLoggedPitch.count.balls + 1
                }
            });
        case Pitches.BALL_WILD: {
            const notAWalk = Rules[OptionalRules.RunnersAdvanceOnWildPitch] && stateWithLoggedPitch.count.balls < MAX_BALLS - 1;
            // if isn't a walk, advance the runners (count reducer will handle walk simulation)
            return basesReducer(countReducer({
                ...stateWithLoggedPitch,
                bases: advanceRunners(stateWithLoggedPitch.bases, notAWalk ? 1 : 0),
                count: {
                    ...stateWithLoggedPitch.count,
                    balls: stateWithLoggedPitch.count.balls + 1
                }
            }));
        }
        case Pitches.STRIKE_SWINGING:
            return strike(stateWithLoggedPitch);
        case Pitches.STRIKE_LOOKING:
            // if enabled, acts as a strikeout
            if (Rules[OptionalRules.CaughtLookingRule]) {
                return batterUp(outsReducer({
                    ...stateWithLoggedPitch,
                    outs: stateWithLoggedPitch.outs + 1,
                    count: NEW_COUNT,
                }));
            }
            // just another strike otherwise
            return strike(stateWithLoggedPitch);
        case Pitches.STRIKE_FOUL_ZONE:
            // if enabled, acts like a strikeout
            if (Rules[OptionalRules.FoulToTheZoneIsStrikeOut] && stateWithLoggedPitch.count.strikes === MAX_STRIKES - 1) {
                return batterUp(outsReducer({
                    ...stateWithLoggedPitch,
                    outs: stateWithLoggedPitch.outs + 1,
                    count: NEW_COUNT,
                }));
            }
            // just another foul otherwise
            return foulBall(stateWithLoggedPitch);
        case Pitches.STRIKE_FOUL_CAUGHT:
        case Pitches.INPLAY_INFIELD_GRD_OUT:
        case Pitches.INPLAY_INFIELD_LINE_OUT:
            return batterUp(out(stateWithLoggedPitch));
        case Pitches.INPLAY_OUTFIELD_OUT:
            const next = out(stateWithLoggedPitch);
            if (stateWithLoggedPitch.bases[Bases.THIRD] === 1 && stateWithLoggedPitch.outs < MAX_OUTS - 1) {
                return batterUp(basesReducer({
                    ...next,
                    bases: {
                        ...next.bases,
                        [Bases.THIRD]: 0,
                        [Bases.HOME]: next.bases[Bases.HOME] + 1
                    },
                }));
            }
            return batterUp(next);
        case Pitches.STRIKE_FOUL:
            return foulBall(stateWithLoggedPitch);
        case Pitches.INPLAY_INFIELD_OUT_DP_SUCCESS: {
            const forced = forcedRunner(stateWithLoggedPitch.bases);
            if (forced === undefined) {
                console.warn('double play attemped without a forced runner', stateWithLoggedPitch);
                return stateWithLoggedPitch;
            }
            return batterUp(basesReducer(outsReducer({
                ...stateWithLoggedPitch,
                outs: stateWithLoggedPitch.outs + 2,
                count: NEW_COUNT,
                bases: {
                    ...advanceRunners(stateWithLoggedPitch.bases, 1),
                    [forced + 1]: 0,
                }
            })));
        }
        case Pitches.INPLAY_INFIELD_OUT_DP_FAIL: {
            const forced = forcedRunner(stateWithLoggedPitch.bases);
            if (forced === undefined) {
                console.warn('double play attemped without a forced runner', stateWithLoggedPitch);
                return stateWithLoggedPitch;
            }
            return batterUp(basesReducer(outsReducer({
                ...stateWithLoggedPitch,
                outs: stateWithLoggedPitch.outs + 1,
                count: NEW_COUNT,
                bases: {
                    ...advanceRunners(stateWithLoggedPitch.bases, 1),
                    [forced + 1]: 0,
                    [Bases.FIRST]: 1,
                }
            })));
        }
        case Pitches.INPLAY_INFIELD_ERROR:
        case Pitches.INPLAY_INFIELD_SINGLE:
            return batterUp(basesReducer({
                ...stateWithLoggedPitch,
                count: NEW_COUNT,
                bases: {
                    ...advanceRunners(stateWithLoggedPitch.bases, 1),
                    [Bases.FIRST]: 1,
                },
            }));
        case Pitches.INPLAY_OUTFIELD_SINGLE: {
            const extraBase = Rules[OptionalRules.RunnersAdvanceExtraOn2Outs] && stateWithLoggedPitch.outs === 2;
            return batterUp(basesReducer({
                ...stateWithLoggedPitch,
                count: NEW_COUNT,
                bases: {
                    ...advanceRunners(stateWithLoggedPitch.bases, extraBase ? 2 : 1),
                    [Bases.FIRST]: 1,
                },
            }));
        }
        case Pitches.INPLAY_DOUBLE: {
            const extraBase = Rules[OptionalRules.RunnersAdvanceExtraOn2Outs] && stateWithLoggedPitch.outs === 2;
            return batterUp(basesReducer({
                ...stateWithLoggedPitch,
                count: NEW_COUNT,
                bases: {
                    ...advanceRunners(stateWithLoggedPitch.bases, extraBase ? 3 : 2),
                    [Bases.SECOND]: 1,
                },
            }));
        }
        case Pitches.INPLAY_TRIPLE:
            return batterUp(basesReducer({
                ...stateWithLoggedPitch,
                count: NEW_COUNT,
                bases: {
                    ...advanceRunners(stateWithLoggedPitch.bases, 3),
                    [Bases.THIRD]: 1,
                },
            }));
        case Pitches.INPLAY_HOMERUN: {
            return batterUp(basesReducer({
                ...stateWithLoggedPitch,
                count: NEW_COUNT,
                bases: advanceRunners(stateWithLoggedPitch.bases, 4),
            }));
        }
        default:
            console.warn('PITCH NOT IMPLEMENTED', pitch);
            return stateWithLoggedPitch;
    }
}

const getOffense = (game: GameMoment): Team => {
    return game.inning.half === InningHalf.TOP ? game.awayTeam : game.homeTeam;
}

// **********************
//   SECONDARY REDUCERS
// **********************

// counts can "overflow" and cascade into outs and bases
function countReducer(intermediate: GameMoment): GameMoment {
    if (intermediate.count.balls >= MAX_BALLS) {
        offenseStats(getOffense(intermediate), intermediate, StatEvent.WALK);
        return batterUp(basesReducer(mergeDeepRight(intermediate, {
            count: NEW_COUNT,
            bases: {
                ...advanceRunners(intermediate.bases, 1),
                [Bases.FIRST]: 1,
            }
        })));
    }
    if (intermediate.count.strikes >= MAX_STRIKES) {
        return outsReducer(mergeDeepRight(intermediate, { outs: intermediate.outs + 1, count: NEW_COUNT }));
    }
    return intermediate;
}

// bases can "overflow" and cascade into runs
function basesReducer(intermediate: GameMoment): GameMoment {
    if (intermediate.bases[Bases.HOME] > 0) {
        offenseStats(getOffense(intermediate), intermediate, StatEvent.RBI);
        const newScore = [...intermediate.boxScore];
        const offense = intermediate.inning.half === InningHalf.TOP ? 'away' : 'home';
        newScore[intermediate.inning.number - 1][offense] += intermediate.bases[Bases.HOME];
        return runsReducer(mergeDeepRight(intermediate, {
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
    if (intermediate.outs >= MAX_OUTS) {
        // end of inning, signal for LOB stats
        offenseStats(getOffense(intermediate), intermediate, StatEvent.INNING_END);
        const needsBatterSwitch: GameMoment = mergeDeepRight(intermediate, {
             ...nextInning(intermediate.inning),
        });
        return batterUp(needsBatterSwitch, true);
    }
    return intermediate;
}

// innings can "overflow" and casacde into `game over`
function inningsReducer(intermediate: GameMoment): GameMoment {
    // TODO calculate end of game
    offenseStats(getOffense(intermediate), intermediate, StatEvent.PLATE_APPEARANCE);
    return intermediate;
}
