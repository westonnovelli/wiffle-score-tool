import findLast from 'ramda/src/findLast.js';
import mergeDeepRight from 'ramda/src/mergeDeepRight.js';
import { log } from './pitchLog';
import { defenseStats, offenseStats } from './statsReducer';
import { Bases, GameMoment, InningHalf, OptionalRules, Score, StatEvent, Team } from './types';
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
export const forcedRunner = (bases: GameMoment['bases']): Bases | undefined => {
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
    return currentBatterOrder >= 0 ? team.lineup[(currentBatterOrder + 1) % team.lineup.length] : team.lineup[0];
};

// future proofing for when GameMoment['pitches'] includes other types of events
const lastPitch = (state: GameMoment): Pitches => {
    return findLast((candidate) => {
        return Object.values(Pitches).includes(candidate)
    }, state.pitches) ?? -1;
};

// log stats from last pitch, assumes pitch last pitch is in log
const logStats = (state: GameMoment, inningChange: boolean = false): GameMoment => {
    const offenseStatsTeam = inningChange ? getDefenseKey(state) : getOffenseKey(state);
    const defenseStatsTeam = inningChange ? getOffenseKey(state) : getDefenseKey(state);
    const thrown = lastPitch(state);
    return {
        ...state,
        [offenseStatsTeam]: offenseStats(state[offenseStatsTeam], state, thrown),
        [defenseStatsTeam]: defenseStats(state[defenseStatsTeam], state, thrown),
    };
}

const batterUp = (state: GameMoment, inningChange: boolean = false): GameMoment => {
    // if inningChange, assumes inning half has switched, but batters have not
    const onDeck = inningChange ? state.nextHalfAtBat : whoisNextBatter(state);
    const onDeckNextInning = inningChange ? whoisNextBatter(state, false) : state.nextHalfAtBat;

    const next: GameMoment = mergeDeepRight({
        ...logStats(state, inningChange),
        // also switch batters
        atBat: onDeck,
        nextHalfAtBat: onDeckNextInning,
    }, {
        // and clear the play's runs scored
        bases: {
            [Bases.HOME]: 0,
        },
    });

    // update new batter with plate appearance stat
    const offenseStatsTeam = inningChange ? getDefenseKey(state) : getOffenseKey(state);
    return {
        ...next,
        [offenseStatsTeam]: offenseStats(next[offenseStatsTeam], next, StatEvent.PLATE_APPEARANCE),
    };
};

// state transitions, this is just a reducer
export function pitch(initial: GameMoment, pitch: Pitches): GameMoment {
    const state = log(initial, pitch);
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
            const { next: needsHomeCleared, proceed: notRunLimit } = proceed ? basesReducer(next) : { next, proceed };
            return notRunLimit ? mergeDeepRight(needsHomeCleared, { bases: { [Bases.HOME]: 0 } }) : needsHomeCleared;
        }
        case Pitches.STRIKE_SWINGING:
            return strike(state).next;
        case Pitches.STRIKE_LOOKING: {
            // if enabled, acts as a strikeout
            if (state.configuration.rules[OptionalRules.CaughtLookingRule]) {
                const { next, proceed } = outsReducer({
                    ...state,
                    outs: state.outs + 1,
                    count: NEW_COUNT,
                });
                return proceed ? batterUp(next) : next;
            }
            // just another strike otherwise
            return strike(state).next;
        }
        case Pitches.STRIKE_FOUL_ZONE: {
            // if enabled, acts like a strikeout
            if (state.configuration.rules[OptionalRules.FoulToTheZoneIsStrikeOut]
                && state.count.strikes === state.configuration.maxStrikes - 1) {
                const { next, proceed } = outsReducer({
                    ...state,
                    outs: state.outs + 1,
                    count: NEW_COUNT,
                });
                return proceed ? batterUp(next) : next;
            }
            // just another foul otherwise
            return foulBall(state);
        }
        case Pitches.STRIKE_FOUL_CAUGHT:
        case Pitches.INPLAY_INFIELD_GRD_OUT:
        case Pitches.INPLAY_INFIELD_AIR_OUT_INFIELD_FLY: // TODO does this actually do anything different
        case Pitches.INPLAY_INFIELD_AIR_OUT:
        case Pitches.INPLAY_OUTFIELD_OUT: {
            const { next, proceed } = out(state);
            return proceed ? batterUp(next) : next;
        }
        case Pitches.INPLAY_OUTFIELD_OUT_TAG_FAIL: {
            const { next, proceed } = outsReducer({
                ...state,
                outs: state.outs + 2,
                bases: {
                    ...state.bases,
                    [Bases.THIRD]: 0,
                },
            });
            return proceed ? batterUp(next) : next;
        }
        case Pitches.INPLAY_OUTFIELD_OUT_TAG_SUCCESS: {
            const { next: inningContinues, proceed: checkForRuns } = out(state);
            if (!checkForRuns) return inningContinues;
            const { next, proceed } = state.bases[Bases.THIRD] === 1
                ? basesReducer({
                    ...inningContinues,
                    bases: {
                        ...inningContinues.bases,
                        [Bases.THIRD]: 0,
                        [Bases.HOME]: inningContinues.bases[Bases.HOME] + 1
                    },
                })
                : { next: inningContinues, proceed: false };
            return proceed ? batterUp(next) : next;
        }   
        case Pitches.STRIKE_FOUL:
            return foulBall(state);
        case Pitches.INPLAY_INFIELD_OUT_DP_SUCCESS: {
            const forced = forcedRunner(state.bases);
            if (forced === undefined) {
                console.warn('double play attemped without a forced runner', state);
                return state;
            }
            const { next: inningContinues, proceed: checkForRuns } = outsReducer({
                ...state,
                outs: state.outs + 2,
                count: NEW_COUNT,
                bases: {
                    ...advanceRunners(state.bases, 1),
                    [forced + 1]: 0,
                }
            });
            const { next, proceed } = checkForRuns
                ? basesReducer(inningContinues)
                : { next: inningContinues, proceed: checkForRuns };
            return proceed ? batterUp(next) : next;
        }
        case Pitches.INPLAY_INFIELD_OUT_DP_FAIL: {
            const forced = forcedRunner(state.bases);
            if (forced === undefined) {
                console.warn('double play attemped without a forced runner', state);
                return state;
            }
            const { next: inningContinues, proceed: checkForRuns } = outsReducer({
                ...state,
                outs: state.outs + 1,
                count: NEW_COUNT,
                bases: {
                    ...advanceRunners(state.bases, 1),
                    [forced + 1]: 0,
                    [Bases.FIRST]: 1,
                }
            });
            const { next, proceed } = checkForRuns
                ? basesReducer(inningContinues)
                : { next: inningContinues, proceed: checkForRuns };
            return proceed ? batterUp(next) : next;
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

export const getOffense = (game: GameMoment): Team => {
    return game.inning.half === InningHalf.TOP ? game.awayTeam : game.homeTeam;
};

export const getOffenseKey = (game: GameMoment): keyof Pick<GameMoment, 'awayTeam' | 'homeTeam'> => {
    return game.inning.half === InningHalf.TOP ? 'awayTeam' : 'homeTeam';
};

export const getDefense = (game: GameMoment): Team => {
    return game.inning.half === InningHalf.TOP ? game.homeTeam : game.awayTeam;
};

export const getDefenseKey = (game: GameMoment): keyof Pick<GameMoment, 'awayTeam' | 'homeTeam'> => {
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
    // is walk
    if (intermediate.count.balls >= intermediate.configuration.maxBalls) {
        const withStats = {
            ...intermediate,
            [getOffenseKey(intermediate)]: offenseStats(getOffense(intermediate), intermediate, StatEvent.WALK),
            [getDefenseKey(intermediate)]: defenseStats(getDefense(intermediate), intermediate, StatEvent.WALK),
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
    // is strikeout
    if (intermediate.count.strikes >= intermediate.configuration.maxStrikes) {
        const lastPitch = intermediate.pitches[intermediate.pitches.length - 1];
        const event = (lastPitch === Pitches.STRIKE_LOOKING) ? StatEvent.STRIKE_LOOKING : StatEvent.STRIKEOUT_SWINGING;
        const withStats = {
            ...intermediate,
            [getDefenseKey(intermediate)]: defenseStats(getDefense(intermediate), intermediate, event),
        }
        const { next, proceed } = outsReducer(mergeDeepRight(withStats, { outs: withStats.outs + 1, count: NEW_COUNT }));
        return { next: proceed ? batterUp(next) : next, proceed };
    }
    // count continues
    return { next: logStats(intermediate), proceed: true };
}

// bases can "overflow" and cascade into runs
function basesReducer(intermediate: GameMoment): ChainingReducer {
    // runners have scored
    if (intermediate.bases[Bases.HOME] > 0) {
        const withStats = {
            ...intermediate,
            [getOffenseKey(intermediate)]: offenseStats(getOffense(intermediate), intermediate, StatEvent.RBI),
        };
        const newScore = [...withStats.boxScore];
        newScore[withStats.inning.number - 1][getOffenseKey(withStats)] += withStats.bases[Bases.HOME];
        return runsReducer(withStats);
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
        const withStats = logStats(intermediate);
        return {
            next: {
                ...withStats,
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
    return { next: intermediate, proceed: true };
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
            next: { ...logStats(intermediate), gameOver: true, },
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
