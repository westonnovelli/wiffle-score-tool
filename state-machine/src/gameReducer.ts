import mergeDeepRight from 'ramda/src/mergeDeepRight.js';
import { offenseStats } from './statsReducer';
import { Bases, Game, GameMoment, Inning, InningHalf, OptionalRules, Score, StatEvent, Team } from './types';
import { Pitches } from './types';

const NEW_COUNT: GameMoment['count'] = {
    balls: 0,
    strikes: 0,
};

export const EMPTY_BASES: GameMoment['bases'] = {
    [Bases.FIRST]: 0,
    [Bases.SECOND]: 0,
    [Bases.THIRD]: 0,
    [Bases.HOME]: 0,
};

export const EMPTY_BOX: Score = {
    awayTeam: 0,
    homeTeam: 0,
};

const nextInning = (state: GameMoment): Pick<GameMoment, 'inning' | 'outs' | 'count' | 'bases' | 'boxScore'> => {
    const currentInning = state.inning;
    const boxScore = [...state.boxScore];
    if (currentInning.half === InningHalf.BOTTOM) {
        boxScore.push(EMPTY_BOX);
    }
    return {
        inning: {
            number: currentInning.half === InningHalf.BOTTOM ? currentInning.number + 1 : currentInning.number,
            half: currentInning.half === InningHalf.BOTTOM ? InningHalf.TOP : InningHalf.BOTTOM,
        },
        outs: 0,
        count: NEW_COUNT,
        bases: EMPTY_BASES,
        boxScore,
    };
};

// moves runners on base forward `basesToAdvance` number of bases
// advancing runners 4 assumes the batter moves (unique rule)
// if the runners are advancing 1 base, unforced runners might not move (ex: walk with runner on 3rd does not score the run)
// if runners are advancing more than 1 base, unforced runners advance the same as forced runners
// TODO: consider changing the implementation of the comment above
export const advanceRunners = (bases: GameMoment['bases'], basesToAdvance: 0 | 1 | 2 | 3 | 4, advanceUnforced: boolean = true): GameMoment['bases'] => {
    const leadForced = forcedRunner(bases);
    switch (basesToAdvance) {
        case 1: {
            return {
                [Bases.FIRST]: 0,
                [Bases.SECOND]: (advanceUnforced || leadForced === Bases.FIRST) ? bases[Bases.FIRST] : bases[Bases.SECOND],
                [Bases.THIRD]: (advanceUnforced || leadForced === Bases.SECOND) ? bases[Bases.SECOND] : bases[Bases.THIRD],
                [Bases.HOME]: (advanceUnforced || leadForced === Bases.THIRD) ? bases[Bases.HOME] + bases[Bases.THIRD] : bases[Bases.HOME],
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

const strike = (state: GameMoment): ChainingReducer => {
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

const out = (state: GameMoment): ChainingReducer => {
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
    return currentBatterOrder >= 0 ? team.lineup[currentBatterOrder + 1] : team.lineup[0];
};

const batterUp = (state: GameMoment, inningChange: boolean = false): GameMoment => {
    // if inningChange, assumes inning half has switched, but batters have not
    const onDeck = inningChange ? state.nextHalfAtBat : whoisNextBatter(state);
    const onDeckNextInning = inningChange ? whoisNextBatter(state, false) : state.nextHalfAtBat;

    const next: GameMoment = {
        ...state,
        atBat: onDeck,
        nextHalfAtBat: onDeckNextInning,
    };
    const offenseStatsTeam = inningChange ? getDefenseKey(next) : getOffenseKey(next);
    return {
        ...next,
        [offenseStatsTeam]: offenseStats(state[offenseStatsTeam], state, StatEvent.PLATE_APPEARANCE),
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
            }).next;
        case Pitches.BALL_WILD: {
            const notAWalk = state.configuration.rules[OptionalRules.RunnersAdvanceOnWildPitch]
                && state.count.balls < state.configuration.maxBalls - 1;
            // if isn't a walk, advance the runners (count reducer will handle walk simulation)
            const { next, proceed } = countReducer({
                ...state,
                bases: advanceRunners(state.bases, notAWalk ? 1 : 0),
                count: {
                    ...state.count,
                    balls: state.count.balls + 1
                }
            });
            return proceed ? basesReducer(next).next : next;
        }
        case Pitches.STRIKE_SWINGING:
            return strike(state).next;
        case Pitches.STRIKE_LOOKING: {
            // if enabled, acts as a strikeout
            if (state.configuration.rules[OptionalRules.CaughtLookingRule]) {
                return outsReducer({
                    ...state,
                    outs: state.outs + 1,
                    count: NEW_COUNT,
                }).next;
            }
            // just another strike otherwise
            return strike(state).next;
        }
        case Pitches.STRIKE_FOUL_ZONE: {
            // if enabled, acts like a strikeout
            if (state.configuration.rules[OptionalRules.FoulToTheZoneIsStrikeOut]
                && state.count.strikes === state.configuration.maxStrikes - 1) {
                return outsReducer({
                    ...state,
                    outs: state.outs + 1,
                    count: NEW_COUNT,
                }).next;
            }
            // just another foul otherwise
            return foulBall(state);
        }
        case Pitches.STRIKE_FOUL_CAUGHT:
        case Pitches.INPLAY_INFIELD_GRD_OUT:
        case Pitches.INPLAY_INFIELD_AIR_OUT:
            return out(state).next;
        case Pitches.INPLAY_OUTFIELD_OUT: {
            const { next, proceed } = out(state);
            if (proceed && state.bases[Bases.THIRD] === 1) {
                return basesReducer({
                    ...next,
                    bases: {
                        ...next.bases,
                        [Bases.THIRD]: 0,
                        [Bases.HOME]: next.bases[Bases.HOME] + 1
                    },
                }).next;
            }
            return next;
        }
        case Pitches.STRIKE_FOUL:
            return foulBall(state);
        case Pitches.INPLAY_INFIELD_OUT_DP_SUCCESS: {
            const forced = forcedRunner(state.bases);
            if (forced === undefined) {
                console.warn('double play attemped without a forced runner', state);
                return state;
            }
            const { next, proceed } = outsReducer({
                ...state,
                outs: state.outs + 2,
                count: NEW_COUNT,
                bases: {
                    ...advanceRunners(state.bases, 1),
                    [forced + 1]: 0,
                }
            });
            return proceed ? basesReducer(next).next : next;
        }
        case Pitches.INPLAY_INFIELD_OUT_DP_FAIL: {
            const forced = forcedRunner(state.bases);
            if (forced === undefined) {
                console.warn('double play attemped without a forced runner', state);
                return state;
            }
            const { next, proceed } = outsReducer({
                ...state,
                outs: state.outs + 1,
                count: NEW_COUNT,
                bases: {
                    ...advanceRunners(state.bases, 1),
                    [forced + 1]: 0,
                    [Bases.FIRST]: 1,
                }
            });
            return proceed ? basesReducer(next).next : next;
        }
        case Pitches.INPLAY_INFIELD_ERROR:
        case Pitches.INPLAY_INFIELD_SINGLE: {
            const { next, proceed } = basesReducer({
                ...state,
                count: NEW_COUNT,
                bases: {
                    ...advanceRunners(state.bases, 1),
                    [Bases.FIRST]: 1,
                },
            });
            return proceed ? batterUp(next) : next;
        }
        case Pitches.INPLAY_OUTFIELD_SINGLE: {
            const extraBase = state.configuration.rules[OptionalRules.RunnersAdvanceExtraOn2Outs]
                && state.outs === state.configuration.maxOuts - 1;
            const { next, proceed } = basesReducer({
                ...state,
                count: NEW_COUNT,
                bases: {
                    ...advanceRunners(state.bases, extraBase ? 2 : 1),
                    [Bases.FIRST]: 1,
                },
            });
            return proceed ? batterUp(next) : next;
        }
        case Pitches.INPLAY_DOUBLE: {
            const extraBase = state.configuration.rules[OptionalRules.RunnersAdvanceExtraOn2Outs]
                && state.outs === state.configuration.maxOuts - 1;
            const { next, proceed } = basesReducer({
                ...state,
                count: NEW_COUNT,
                bases: {
                    ...advanceRunners(state.bases, extraBase ? 3 : 2),
                    [Bases.SECOND]: 1,
                },
            });
            return proceed ? batterUp(next) : next;
        }
        case Pitches.INPLAY_TRIPLE: {
            const { next, proceed } = basesReducer({
                ...state,
                count: NEW_COUNT,
                bases: {
                    ...advanceRunners(state.bases, 3),
                    [Bases.THIRD]: 1,
                },
            });
            return proceed ? batterUp(next) : next;
        }
        case Pitches.INPLAY_HOMERUN: {
            const { next, proceed } = basesReducer({
                ...state,
                count: NEW_COUNT,
                bases: advanceRunners(state.bases, 4),
            });
            return proceed ? batterUp(next) : next;
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

interface ChainingReducer {
    next: GameMoment;
    proceed: boolean;
};

// counts can "overflow" and cascade into outs and bases
function countReducer(intermediate: GameMoment): ChainingReducer {
    if (intermediate.count.balls >= intermediate.configuration.maxBalls) {
        const withStats = {
            ...intermediate,
            [getOffenseKey(intermediate)]: offenseStats(getOffense(intermediate), intermediate, StatEvent.WALK),
        };
        const { next, proceed } = basesReducer(mergeDeepRight(withStats, {
            count: NEW_COUNT,
            bases: {
                ...advanceRunners(withStats.bases, 1, false),
                [Bases.FIRST]: 1,
            }
        }));
        return { next: proceed ? batterUp(next) : next, proceed };
    }
    if (intermediate.count.strikes >= intermediate.configuration.maxStrikes) {
        const { next, proceed } = outsReducer(mergeDeepRight(intermediate, { outs: intermediate.outs + 1, count: NEW_COUNT }));
        return { next: proceed ? batterUp(next) : next, proceed };
    }
    return { next: intermediate, proceed: true };
}

// bases can "overflow" and cascade into runs
function basesReducer(intermediate: GameMoment): ChainingReducer {
    if (intermediate.bases[Bases.HOME] > 0) {
        const withStats = {
            ...intermediate,
            [getOffenseKey(intermediate)]: offenseStats(getOffense(intermediate), intermediate, StatEvent.RBI),
        };
        const newScore = [...withStats.boxScore];
        newScore[withStats.inning.number - 1][getOffenseKey(withStats)] += withStats.bases[Bases.HOME];
        return runsReducer(mergeDeepRight(withStats, {
            bases: {
                [Bases.HOME]: 0,
            },
        }));
    }
    return { next: intermediate, proceed: true };
}

// runs can "overflow" and cascade into innings
function runsReducer(intermediate: GameMoment): ChainingReducer {
    // assumes runs have already been tallied, need to adjust if rules indicate
    const runsThisInning = intermediate.boxScore[intermediate.inning.number - 1][getOffenseKey(intermediate)];
    const shouldSetRunsToMax = !intermediate.configuration.rules[OptionalRules.AllowSinglePlayRunsToPassLimit];

    // hit max runs
    if (runsThisInning >= intermediate.configuration.maxRuns && intermediate.configuration.maxRuns > 0) {
        const newScore = shouldSetRunsToMax ? intermediate.configuration.maxRuns : runsThisInning;
        const newBoxes = [...intermediate.boxScore];
        newBoxes[intermediate.inning.number - 1][getOffenseKey(intermediate)] = newScore;

        const withRunsAdjusted: GameMoment = {
            ...intermediate,
            boxScore: newBoxes,
        };
        const needsBatterSwitch: GameMoment = {
            ...withRunsAdjusted,
            ...nextInning(withRunsAdjusted),
        }
        return { next: batterUp(needsBatterSwitch, true), proceed: false };
    }

    // walkoff
    if (
        intermediate.inning.number >= intermediate.configuration.maxInnings
        && intermediate.inning.half === InningHalf.BOTTOM
        && homeScore(intermediate) > awayScore(intermediate)
    ) {
        return {
            next: {
                ...intermediate,
                [getOffenseKey(intermediate)]: offenseStats(getOffense(intermediate), intermediate, StatEvent.WALK_OFF),
                gameOver: true,
            },
            proceed: false,
        };
    }

    return { next: intermediate, proceed: true };
}

// outs can "overflow" and cascade into innings
function outsReducer(intermediate: GameMoment): ChainingReducer {
    if (intermediate.outs >= intermediate.configuration.maxOuts) {
        // end of inning, signal for LOB stats
        const withStats: GameMoment = {
            ...intermediate,
            [getOffenseKey(intermediate)]: offenseStats(getOffense(intermediate), intermediate, StatEvent.INNING_END),
        };
        const needsBatterSwitch: GameMoment = {
            ...withStats,
            ...nextInning(withStats),
        };
        const { next, proceed } = inningsReducer(needsBatterSwitch);
        return { next: proceed ? batterUp(next, true) : next, proceed: false };
    }
    return { next: batterUp(intermediate), proceed: true };
}

const homeScore = (state: GameMoment): number => {
    return state.boxScore.reduce((total, inning) => total + inning.homeTeam, 0);
};

const awayScore = (state: GameMoment): number => {
    return state.boxScore.reduce((total, inning) => total + inning.awayTeam, 0);
};

const undoInningChange = (intermediate: GameMoment): GameMoment => {
    return {
        ...intermediate,
        // revert innning change
        inning: {
            number: intermediate.inning.number - 1,
            half: InningHalf.BOTTOM
        },
        // remove last boxScore entry
        boxScore: [...intermediate.boxScore.slice(0, intermediate.boxScore.length - 1)],
    };
}

// innings can "overflow" and casacde into `game over`
// assumes intermedite has new inning initialized
function inningsReducer(intermediate: GameMoment): ChainingReducer {
    const homeTotal = homeScore(intermediate);
    const awayTotal = awayScore(intermediate);

    const homeWinning = homeTotal > awayTotal;
    const lastInning = intermediate.inning.number === intermediate.configuration.maxInnings;
    if (lastInning && intermediate.inning.half === InningHalf.BOTTOM && homeWinning) {
        // game is over
        return {
            next: { ...intermediate, gameOver: true, },
            proceed: false
        };
    }

    // about to be or already in extra innings
    if (intermediate.inning.number > intermediate.configuration.maxInnings) {
        if (homeTotal !== awayTotal) {
            // game is over
            const next = {
                ...undoInningChange(intermediate),
                gameOver: true,
            };
            return { next, proceed: false };
        } else {
            // tie game:
            // if we have already determined no extras, end the game
            if (intermediate.configuration.allowExtras === false) {
                const next = {
                    ...undoInningChange(intermediate),
                    gameOver: true,
                };
                return { next, proceed: false };
            } else if (intermediate.configuration.allowExtras === undefined) {
                // if not, change nothing, prompt a user check
                // TODO emit user check event
            }
        }
    }

    return { next: intermediate, proceed: true };
}
