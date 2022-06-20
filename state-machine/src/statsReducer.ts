import { MAX_OUTS, MAX_STRIKES, OptionalRules, Rules, runnersOn, } from './gameReducer';
import { record } from './StatBuilder';
import { Bases, GameMoment, StatEvent, Team } from './types';
import { Pitches } from './types';

export function offenseStats(team: Team, game: GameMoment, pitch: Pitches | StatEvent): Team {
    const playerAtBat = team.roster[game.atBat];
    if (!playerAtBat) return team;
    const batter = playerAtBat.name;

    switch (pitch) {
        // case Pitches.BALL: // when is it a ball, how again to do calc ABs and RBIs with walks?
        // case Pitches.BALL_WILD:
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
        case Pitches.STRIKE_SWINGING:
            if (game.count.strikes >= MAX_STRIKES) {
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
            return team;
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

        // case Pitches.STRIKE_FOUL:
        // case Pitches.STRIKE_FOUL_CAUGHT:

        case Pitches.INPLAY_INFIELD_GRD_OUT:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [batter]: record(team.roster[batter])
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
                        .offense('groundOuts', 1)
                        .offense('doublePlays', 1)
                        .done(),
                }
            };
        // case Pitches.INPLAY_INFIELD_OUT_DP_FAIL: // how do you score this?
        case Pitches.INPLAY_OUTFIELD_OUT:
        case Pitches.INPLAY_INFIELD_LINE_OUT:
            const runnerTaggedAndScored = (
                Rules[OptionalRules.ThirdBaseCanTag]
                && pitch === Pitches.INPLAY_OUTFIELD_OUT
                && game.outs <= MAX_OUTS - 2 // we've already added an additional out for this play
                && game.bases[Bases.THIRD] > 1
            );
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [batter]: record(team.roster[batter])
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
        default:
            return team;
    }
};

export function defenseStats(team: Team, game: GameMoment, pitch: Pitches): Team {
    return team;
};
