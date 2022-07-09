import mergeDeepRight from 'ramda/src/mergeDeepRight.js';
import advanceRunners from './bases/advanceRunners';
import { forcedRunner } from './bases/leadRunner';
import batterUp from './batters/batterUp';
import { NEW_COUNT } from './factory';
import nextInning from './inning/nextInning';
import lastPitch from './history/lastPitch';
import logPitch from './pitches/logPitch';
import { awayScore, homeScore } from './score/score';
import logStats from './stats/logStats';
import { defenseStats, offenseStats } from './stats/statsReducer';
import { getDefense, getDefenseKey, getOffense, getOffenseKey } from './teams/getTeams';
import { Bases, GameMoment, InningHalf, OptionalRules, GameEvent, Pitches } from './types';

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
    return countReducer({
        ...state,
        count: {
            ...state.count,
            strikes: Math.min(state.count.strikes + 1, state.configuration.maxStrikes - 1),
        }
    }).next;
}

const out = (state: GameMoment): ChainingReducer => {
    return outsReducer({
        ...state,
        outs: state.outs + 1,
        count: NEW_COUNT,
    });
}

export function start(initial: GameMoment): GameMoment {
    return batterUp({
        ...initial,
        gameStarted: true,
        atBat: initial.awayTeam.lineup[initial.awayTeam.lineup.length - 1],
        nextHalfAtBat: initial.homeTeam.lineup[0],
        [getOffenseKey(initial)]: offenseStats(getOffense(initial), initial, GameEvent.START),
        [getDefenseKey(initial)]: defenseStats(getDefense(initial), initial, GameEvent.START),
    });
};

// state transitions, this is just a reducer
export function pitch(initial: GameMoment, pitch: Pitches): GameMoment {
    const state = logPitch(initial, pitch);
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
                    [getDefenseKey(state)]: defenseStats(getDefense(state), state, GameEvent.STRIKEOUT_LOOKING),
                    [getOffenseKey(state)]: offenseStats(getOffense(state), state, GameEvent.STRIKEOUT_LOOKING)
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
        // case Pitches.INTERFERENCE:
        //     throw new Error('interference');
        default:
    console.warn('PITCH NOT IMPLEMENTED', pitch);
    return state;
}
}

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
            [getOffenseKey(intermediate)]: offenseStats(getOffense(intermediate), intermediate, GameEvent.WALK),
            [getDefenseKey(intermediate)]: defenseStats(getDefense(intermediate), intermediate, GameEvent.WALK),
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
        const event = (lastPitch(intermediate) === Pitches.STRIKE_LOOKING) ? GameEvent.STRIKEOUT_LOOKING : GameEvent.STRIKEOUT_SWINGING;
        const withStats = {
            ...intermediate,
            [getDefenseKey(intermediate)]: defenseStats(getDefense(intermediate), intermediate, event),
            [getOffenseKey(intermediate)]: offenseStats(getOffense(intermediate), intermediate, event),
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
            [getOffenseKey(intermediate)]: offenseStats(getOffense(intermediate), intermediate, GameEvent.RBI),
            [getDefenseKey(intermediate)]: defenseStats(getDefense(intermediate), intermediate, GameEvent.RBI),
        };
        const newScore = withStats.boxScore.map((inning) => ({ ...inning }));
        newScore[withStats.inning.number - 1][getOffenseKey(withStats)] += withStats.bases[Bases.HOME];
        return runsReducer({ ...withStats, boxScore: newScore });
    }
    return { next: intermediate, proceed: true };
}

// function logLeadChange(intermediate: GameMoment): GameMoment {
//     const defenseKey = getDefenseKey(intermediate);
//     const defense = getDefense(intermediate);

// const runsThisInning = intermediate.inning.half === InningHalf.TOP
//     ? intermediate.boxScore[intermediate.inning.number - 1].awayTeam
//     : intermediate.boxScore[intermediate.inning.number - 1].homeTeam;
// const defenseScore = defenseScore(intermediate);
//     const offenseScoreBeforeInning = offenseScore(intermediate) - runsThisInning;

//     if (offenseScoreBeforeInning >= defenseScore) return intermediate;

//     if (offenseScoreBeforeInning + runsThisInning === defenseScore) {
//         return {
//             ...intermediate,
//             [defenseKey]: defenseStats(defense, intermediate, GameEvent.LEAD_LOST),
//         };
//     }

//     if (offenseScoreBeforeInning + runsThisInning > defenseScore) {
//         return {
//             ...intermediate,
//             [defenseKey]: defenseStats(defense, intermediate, GameEvent.LEAD_CHANGE),
//         };
//     }

//     return intermediate;
// }

function logRunStats(intermediate: GameMoment): GameMoment {
    // // TODO compute earned vs unearned runs
    // const next: GameMoment = {
    //     ...intermediate,
    //     [getDefenseKey(intermediate)]: defenseStats(getDefense(intermediate), intermediate, GameEvent.RUNS_SCORED),
    // };
    // return logLeadChange(next);
    return intermediate;
}

// runs can "overflow" and cascade into innings
function runsReducer(intermediate: GameMoment): ChainingReducer {
    // assumes runs have already been tallied, need to adjust if rules indicate
    const runsThisInning = intermediate.boxScore[intermediate.inning.number - 1][getOffenseKey(intermediate)];

    // hit max runs
    if (runsThisInning >= intermediate.configuration.maxRuns && intermediate.configuration.maxRuns > 0) {
        const shouldSetRunsToMax = !intermediate.configuration.rules[OptionalRules.AllowSinglePlayRunsToPassLimit];
        const newScore = shouldSetRunsToMax ? intermediate.configuration.maxRuns : runsThisInning;
        const newBoxes = [...intermediate.boxScore];
        newBoxes[intermediate.inning.number - 1][getOffenseKey(intermediate)] = newScore;

        const withRunsAdjusted: GameMoment = {
            ...intermediate,
            boxScore: newBoxes,
        };
        const withRunsStats: GameMoment = logRunStats(withRunsAdjusted);
        const needsBatterSwitch: GameMoment = {
            ...withRunsStats,
            ...nextInning(withRunsStats),
        }
        return { next: batterUp(needsBatterSwitch, true), proceed: false };
    }

    // walkoff
    if (
        intermediate.inning.number >= intermediate.configuration.maxInnings
        && intermediate.inning.half === InningHalf.BOTTOM
        && homeScore(intermediate) > awayScore(intermediate)
    ) {
        const withStats = logStats(logRunStats(intermediate));
        return {
            next: {
                ...withStats,
                [getOffenseKey(intermediate)]: offenseStats(getOffense(intermediate), intermediate, GameEvent.WALK_OFF),
                gameOver: true,
            },
            proceed: false,
        };
    }

    return { next: logRunStats(intermediate), proceed: true };
}

// outs can "overflow" and cascade into innings
function outsReducer(intermediate: GameMoment): ChainingReducer {
    if (intermediate.outs >= intermediate.configuration.maxOuts) {
        // end of inning, signal for LOB stats
        const withStats: GameMoment = {
            ...intermediate,
            [getOffenseKey(intermediate)]: offenseStats(getOffense(intermediate), intermediate, GameEvent.INNING_END),
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
