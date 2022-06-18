import { mergeDeepRight } from 'ramda';
import { Bases, GameMoment, Inning, InningHalf } from './types';
import { Pitches } from './types';

export const MAX_BALLS = 4;
export const MAX_STRIKES = 3;
export const MAX_OUTS = 3;

enum OptionalRules {
    RunnersAdvanceOnWildPitch,
    RunnersAdvanceExtraOn2Outs,
    CaughtLookingRule,
    FoulToTheZoneIsStrikeOut,
}

const Rules: Record<OptionalRules, boolean> = {
    [OptionalRules.RunnersAdvanceOnWildPitch]: true,
    [OptionalRules.RunnersAdvanceExtraOn2Outs]: true,
    [OptionalRules.CaughtLookingRule]: true,
    [OptionalRules.FoulToTheZoneIsStrikeOut]: true,
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

// state transitions, this is just a reducer
export function pitch(state: GameMoment, pitch: Pitches): GameMoment {
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
            const notAWalk = Rules[OptionalRules.RunnersAdvanceOnWildPitch] && state.count.balls < MAX_BALLS - 1;
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
            if (Rules[OptionalRules.CaughtLookingRule]) {
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
            if (Rules[OptionalRules.FoulToTheZoneIsStrikeOut] && state.count.strikes === MAX_STRIKES - 1) {
                return outsReducer({
                    ...state,
                    outs: state.outs + 1,
                    count: NEW_COUNT,
                });
            }
            // just another foul otherwise
            return foulBall(state);
        case Pitches.STRIKE_FOUL_CAUGHT:
        case Pitches.INPLAY_INFIELD_OUT:
        case Pitches.INPLAY_OUTFIELD_OUT:
            return outsReducer({
                ...state,
                outs: state.outs + 1,
                count: NEW_COUNT,
            });
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
            return basesReducer({
                ...state,
                count: NEW_COUNT,
                bases: {
                    ...advanceRunners(state.bases, 1),
                    [Bases.FIRST]: 1,
                },
            });
        case Pitches.INPLAY_OUTFIELD_SINGLE: {
            const extraBase = Rules[OptionalRules.RunnersAdvanceExtraOn2Outs] && state.outs === 2;
            return basesReducer({
                ...state,
                count: NEW_COUNT,
                bases: {
                    ...advanceRunners(state.bases, extraBase ? 2 : 1),
                    [Bases.FIRST]: 1,
                },
            });
        }
        case Pitches.INPLAY_DOUBLE: {
            const extraBase = Rules[OptionalRules.RunnersAdvanceExtraOn2Outs] && state.outs === 2;
            return basesReducer({
                ...state,
                count: NEW_COUNT,
                bases: {
                    ...advanceRunners(state.bases, extraBase ? 3 : 2),
                    [Bases.SECOND]: 1,
                },
            });
        }
        case Pitches.INPLAY_TRIPLE:
            return basesReducer({
                ...state,
                count: NEW_COUNT,
                bases: {
                    ...advanceRunners(state.bases, 3),
                    [Bases.THIRD]: 1,
                },
            });
        case Pitches.INPLAY_HOMERUN: {
            return basesReducer({
                ...state,
                count: NEW_COUNT,
                bases: advanceRunners(state.bases, 4),
            });
        }
        default:
            console.warn('PITCH NOT IMPLEMENTED', pitch);
            return state;
    }
}

// counts can "overflow" and cascade into outs and bases
function countReducer(state: GameMoment): GameMoment {
    if (state.count.balls >= MAX_BALLS) {
        return basesReducer(mergeDeepRight(state, {
            count: NEW_COUNT, bases: {
                ...advanceRunners(state.bases, 1),
                [Bases.FIRST]: 1,
            }
        }));
    }
    if (state.count.strikes >= MAX_STRIKES) {
        return outsReducer(mergeDeepRight(state, { outs: state.outs + 1, count: NEW_COUNT }));
    }
    return state;
}

// bases can "overflow" and cascade into runs
function basesReducer(state: GameMoment): GameMoment {
    if (state.bases[Bases.HOME] > 0) {
        const newScore = [...state.boxScore];
        const offense = state.inning.half === InningHalf.TOP ? 'away' : 'home';
        newScore[state.inning.number - 1][offense] += state.bases[Bases.HOME];
        return runsReducer(mergeDeepRight(state, {
            bases: {
                [Bases.HOME]: 0,
            },
        }));
    }
    return state;
}

// runs can "overflow" and cascade into innings
function runsReducer(state: GameMoment): GameMoment {
    return state;
}

// outs can "overflow" and cascade into innings
function outsReducer(state: GameMoment): GameMoment {
    if (state.outs >= MAX_OUTS) {
        return inningsReducer(mergeDeepRight(state, nextInning(state.inning)));
    }
    return state;
}

// innings can "overflow" and casacde into `game over`
function inningsReducer(state: GameMoment): GameMoment {
    return state;
}
