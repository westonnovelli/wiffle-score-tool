import { runnersOn, } from './gameReducer';
import { record } from './StatBuilder';
import { Bases, GameMoment, StatEvent, Team } from './types';
import { Pitches, OptionalRules } from './types';

export function offenseStats(team: Team, game: GameMoment, pitch: Pitches | StatEvent): Team {
    if (!game.configuration.recordingStats) return team;

    const playerAtBat = team.roster[game.atBat];
    if (!playerAtBat) return team;

    const batter = playerAtBat.name;

    switch (pitch) {
        case StatEvent.PLATE_APPEARANCE:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [batter]: record(team.roster[batter])
                        .plateAppearance()
                        .done(),
                }
            };
        case StatEvent.WALK:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [batter]: record(team.roster[batter])
                        .walk()
                        .done(),
                }
            };
        case StatEvent.RBI:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [batter]: record(team.roster[batter])
                        .offense('RBI', game.bases[Bases.HOME])
                        .done(),
                }
            };
        case StatEvent.INNING_END:
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
        case Pitches.INPLAY_INFIELD_LINE_OUT:
            const runnerTaggedAndScored = (
                game.configuration.rules[OptionalRules.ThirdBaseCanTag]
                && pitch === Pitches.INPLAY_OUTFIELD_OUT
                && game.outs <= game.configuration.maxOuts - 2 // we've already added an additional out for this play
                && game.bases[Bases.THIRD] > 1
            );
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [batter]: record(team.roster[batter])
                        .atBat()
                        .offense('flyOuts', 1)
                        .offense('RBI', runnerTaggedAndScored ? 1 : 0)
                        .offense('sacrificeFly', runnerTaggedAndScored ? 1 : 0)
                        .done(),
                }
            };
        case Pitches.INPLAY_INFIELD_ERROR:
        case Pitches.INPLAY_INFIELD_SINGLE:
        case Pitches.INPLAY_OUTFIELD_SINGLE:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [batter]: record(team.roster[batter])
                        .single(game.bases[Bases.HOME])
                        .done(),
                }
            };
        case Pitches.INPLAY_DOUBLE:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [batter]: record(team.roster[batter])
                        .double(game.bases[Bases.HOME])
                        .done(),
                }
            };
        case Pitches.INPLAY_TRIPLE:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [batter]: record(team.roster[batter])
                        .triple(game.bases[Bases.HOME])
                        .done(),
                }
            };
        case Pitches.INPLAY_HOMERUN: {
            const runs = game.bases[Bases.HOME] + 1;
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [batter]: record(team.roster[batter])
                        .homerun(runs)
                        .offense('grandslams', runs === 4 ? 1 : 0)
                        .done(),
                }
            };
        }
        // TODO Walkoff stats
        default:
            return team;
    }
};

export function defenseStats(team: Team, game: GameMoment, pitch: Pitches): Team {
    // TODO defense stats
    return team;
};
