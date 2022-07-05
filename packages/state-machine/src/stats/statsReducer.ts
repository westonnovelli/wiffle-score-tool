import { Bases, GameMoment, GameEvent, Team, Pitches, OptionalRules } from '../types';
import { getPitcher } from '../defense/getPosition';
import { runnersOn } from '../bases/runnersOn';
import { record } from './statBuilder';

export function offenseStats(team: Team, game: GameMoment, pitch: Pitches | GameEvent): Team {
    if (!game.configuration.recordingStats) return team;

    const playerAtBat = team.roster[game.atBat];
    if (!playerAtBat) return team;

    const batter = playerAtBat.id;

    switch (pitch) {
        case GameEvent.PLATE_APPEARANCE:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [batter]: record(team.roster[batter])
                        .plateAppearance()
                        .done(),
                }
            };
        case GameEvent.WALK:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [batter]: record(team.roster[batter])
                        .walk()
                        .done(),
                }
            };
        case GameEvent.RBI:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [batter]: record(team.roster[batter])
                        .offense('RBI', game.bases[Bases.HOME])
                        .done(),
                }
            };
        case GameEvent.INNING_END:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [batter]: record(team.roster[batter])
                        .offense('LOB', runnersOn(game))
                        .done(),
                }
            };
        case Pitches.STRIKE_FOUL_ZONE:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [batter]: record(team.roster[batter])
                        .strikeoutSwinging()
                        .done(),
                }
            };
        case Pitches.STRIKE_SWINGING: {
            if (game.count.strikes < game.configuration.maxStrikes) return team;
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [batter]: record(team.roster[batter])
                        .strikeoutSwinging()
                        .done(),
                }
            };
        }
        case Pitches.STRIKE_LOOKING:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [batter]: record(team.roster[batter])
                        .strikeoutLooking()
                        .done(),
                }
            };
        case Pitches.INPLAY_INFIELD_GRD_OUT:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [batter]: record(team.roster[batter])
                        .atBat()
                        .offense('groundOuts', 1)
                        .done(),
                }
            };
        case Pitches.INPLAY_INFIELD_OUT_DP_SUCCESS:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [batter]: record(team.roster[batter])
                        .atBat()
                        .offense('groundOuts', 1)
                        .offense('doublePlays', 1)
                        .done(),
                }
            };
        case Pitches.INPLAY_INFIELD_OUT_DP_FAIL:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [batter]: record(team.roster[batter])
                        .atBat()
                        .offense('doublePlayFails', 1)
                        .done(),
                }
            };
        case Pitches.STRIKE_FOUL_CAUGHT:
        case Pitches.INPLAY_OUTFIELD_OUT:
        case Pitches.INPLAY_OUTFIELD_OUT_TAG_FAIL:
        case Pitches.INPLAY_INFIELD_AIR_OUT:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [batter]: record(team.roster[batter])
                        .atBat()
                        .offense('flyOuts', 1)
                        .done(),
                }
            };
        case Pitches.INPLAY_OUTFIELD_OUT_TAG_SUCCESS: {
            if (!game.configuration.rules[OptionalRules.ThirdBaseCanTag]) return team;
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [batter]: record(team.roster[batter])
                        .atBat()
                        .offense('flyOuts', 1)
                        .offense('sacrificeFly', 1)
                        .done(),
                }
            };
        }
        case Pitches.INPLAY_INFIELD_SINGLE:
        case Pitches.INPLAY_OUTFIELD_SINGLE:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [batter]: record(team.roster[batter])
                        .single()
                        .done(),
                }
            };
        case Pitches.INPLAY_DOUBLE:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [batter]: record(team.roster[batter])
                        .double()
                        .done(),
                }
            };
        case Pitches.INPLAY_TRIPLE:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [batter]: record(team.roster[batter])
                        .triple()
                        .done(),
                }
            };
        case Pitches.INPLAY_HOMERUN: {
            const runs = game.bases[Bases.HOME]; // a homerun in the gameReducer has already included the batter
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [batter]: record(team.roster[batter])
                        .homerun()
                        .offense('grandslams', runs === 4 ? 1 : 0)
                        .done(),
                }
            };
        }
        case GameEvent.WALK_OFF: {
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [batter]: record(team.roster[batter])
                        .offense('walkoffs', 1)
                        .done(),
                }
            };
        }
        default:
            return team;
    }
};

export function pitchingStats(team: Team, game: GameMoment, pitch: Pitches | GameEvent): Team {
    if (!game.configuration.recordingStats) return team;

    const pitcher = getPitcher(team);
    if (!pitcher) return team;

    switch (pitch) {
        case GameEvent.PLATE_APPEARANCE:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [pitcher]: record(team.roster[pitcher])
                        .pitching('battersFaced', 1)
                        .done(),
                },
            };
        case GameEvent.WALK:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [pitcher]: record(team.roster[pitcher])
                        .pitching('walks', 1)
                        .done(),
                },
            };
        case GameEvent.STRIKEOUT_SWINGING:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [pitcher]: record(team.roster[pitcher])
                        .pitching('strikeoutsSwinging', 1)
                        .done(),
                },
            };
        case GameEvent.STRIKEOUT_LOOKING:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [pitcher]: record(team.roster[pitcher])
                        .pitching('strikeoutsLooking', 1)
                        .done(),
                },
            };
        // case GameEvent.LEAD_LOST:
        // case GameEvent.LEAD_CHANGE:
        //     return {
        //         ...team,
        //         roster: {
        //             ...team.roster,
        //             [pitcher]: record(team.roster[pitcher])
        //                 .pitching('blownSaves', -team.roster[pitcher].defenseStats.pitching.saveOpportunities)
        //                 .pitching('_potentialWin', -1)
        //                 .pitching('_holdable', -1)
        //                 .done(),
        //         },
        //     };
        // case GameEvent.RUNS_SCORED: // is there anything to do here?
        case GameEvent.RBI:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [pitcher]: record(team.roster[pitcher])
                        .pitching('runsAllowed', game.bases[Bases.HOME])
                        .done(),
                },
            };
        // case GameEvent.INNING_END:
        case Pitches.BALL:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [pitcher]: record(team.roster[pitcher])
                        .pitching('balls', 1)
                        .done(),
                },
            };
        case Pitches.BALL_WILD:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [pitcher]: record(team.roster[pitcher])
                        .pitching('balls', 1)
                        .pitching('wildPitches', 1)
                        .done(),
                },
            };
        case Pitches.STRIKE_FOUL:
        case Pitches.STRIKE_SWINGING: {
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [pitcher]: record(team.roster[pitcher])
                        .pitching('strikes', 1)
                        .done(),
                },
            };
        }
        case Pitches.STRIKE_FOUL_ZONE:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [pitcher]: record(team.roster[pitcher])
                        .pitching('strikes', 1)
                        .pitching('strikeoutsSwinging', 1)
                        .done(),
                },
            };
        case Pitches.STRIKE_LOOKING:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [pitcher]: record(team.roster[pitcher])
                        .pitching('strikes', 1)
                        .pitching('strikeoutsLooking', 1)
                        .done(),
                },
            };
        case Pitches.INPLAY_INFIELD_OUT_DP_FAIL:
        case Pitches.INPLAY_INFIELD_GRD_OUT:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [pitcher]: record(team.roster[pitcher])
                        .pitching('groundOuts', 1)
                        .done(),
                },
            };
        case Pitches.INPLAY_INFIELD_OUT_DP_SUCCESS:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [pitcher]: record(team.roster[pitcher])
                        .pitching('doublePlays', 1)
                        .pitching('groundOuts', 1)
                        .done(),
                },
            };
        case Pitches.STRIKE_FOUL_CAUGHT:
        case Pitches.INPLAY_INFIELD_AIR_OUT:
        case Pitches.INPLAY_OUTFIELD_OUT:
        case Pitches.INPLAY_OUTFIELD_OUT_TAG_FAIL:
        case Pitches.INPLAY_OUTFIELD_OUT_TAG_SUCCESS:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [pitcher]: record(team.roster[pitcher])
                        .pitching('flyOuts', 1)
                        .done(),
                },
            };
        case Pitches.INPLAY_INFIELD_SINGLE:
        case Pitches.INPLAY_OUTFIELD_SINGLE:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [pitcher]: record(team.roster[pitcher])
                        .pitching('singles', 1)
                        .done(),
                },
            };
        case Pitches.INPLAY_DOUBLE:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [pitcher]: record(team.roster[pitcher])
                        .pitching('doubles', 1)
                        .done(),
                },
            };
        case Pitches.INPLAY_TRIPLE:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [pitcher]: record(team.roster[pitcher])
                        .pitching('triples', 1)
                        .done(),
                },
            };
        case Pitches.INPLAY_HOMERUN:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [pitcher]: record(team.roster[pitcher])
                        .pitching('homeruns', 1)
                        .done(),
                },
            };
        // case GameEvent.WALK_OFF:
        default:
            return team;
    }
};

export function fieldingStats(team: Team, game: GameMoment, pitch: Pitches | GameEvent): Team {
    if (!game.configuration.recordingStats) return team;

    switch (pitch) {
        case GameEvent.PLATE_APPEARANCE:
        case GameEvent.WALK:
        case GameEvent.RBI:
        case GameEvent.INNING_END:
        case Pitches.BALL:
        case Pitches.BALL_WILD:
        case Pitches.STRIKE_SWINGING:
        case Pitches.STRIKE_FOUL_ZONE:
        case Pitches.STRIKE_LOOKING:
        case Pitches.INPLAY_INFIELD_GRD_OUT:
        case Pitches.INPLAY_INFIELD_OUT_DP_SUCCESS:
        case Pitches.INPLAY_INFIELD_OUT_DP_FAIL:
        case Pitches.STRIKE_FOUL_CAUGHT:
        case Pitches.INPLAY_OUTFIELD_OUT:
        case Pitches.INPLAY_OUTFIELD_OUT_TAG_FAIL:
        case Pitches.INPLAY_INFIELD_AIR_OUT:
        case Pitches.INPLAY_OUTFIELD_OUT_TAG_SUCCESS:
        case Pitches.INPLAY_INFIELD_SINGLE:
        case Pitches.INPLAY_OUTFIELD_SINGLE:
        case Pitches.INPLAY_DOUBLE:
        case Pitches.INPLAY_TRIPLE:
        case Pitches.INPLAY_HOMERUN:
        case GameEvent.WALK_OFF:
        default:
            return team;
    }
};

export function defenseStats(team: Team, game: GameMoment, pitch: Pitches | GameEvent): Team {
    return fieldingStats(pitchingStats(team, game, pitch), game, pitch);
};
