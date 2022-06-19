import { mergeDeepRight } from 'ramda';
import { runnersOn } from './gameReducer';
import { record } from './StatBuilder';
import { GameMoment, Team } from './types';
import { Pitches } from './types';


export function recordStats(team: Team, game: GameMoment, pitch: Pitches): Team {
    const playerAtBat = team.roster[game.atBat.name];
    if (!playerAtBat) return team;
    const batter = playerAtBat.name;

    switch (pitch) {
        // case Pitches.BALL:
        // case Pitches.BALL_WILD:
        // case Pitches.STRIKE_SWINGING:
        // case Pitches.STRIKE_LOOKING:
        // case Pitches.STRIKE_FOUL:
        // case Pitches.STRIKE_FOUL_ZONE:
        // case Pitches.STRIKE_FOUL_CAUGHT:

        // case Pitches.INPLAY_INFIELD_GRD_OUT:
        // case Pitches.INPLAY_INFIELD_LINE_OUT:
        // case Pitches.INPLAY_INFIELD_OUT_DP_SUCCESS:
        // case Pitches.INPLAY_INFIELD_OUT_DP_FAIL:
        // case Pitches.INPLAY_INFIELD_ERROR:
        // case Pitches.INPLAY_OUTFIELD_OUT:
        case Pitches.INPLAY_INFIELD_SINGLE:
        case Pitches.INPLAY_OUTFIELD_SINGLE:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [batter]: record(team.roster[batter])
                        .single() // how do we calc the RBIs?
                        .done(),
                }
            };
        case Pitches.INPLAY_DOUBLE:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [batter]: record(team.roster[batter])
                        .double()  // how do we calc the RBIs?
                        .done(),
                }
            };
        case Pitches.INPLAY_TRIPLE:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [batter]: record(team.roster[batter])
                        .triple() // how do we calc the RBIs?
                        .done(),
                }
            };
        case Pitches.INPLAY_HOMERUN:
            return {
                ...team,
                roster: {
                    ...team.roster,
                    [batter]: record(team.roster[batter])
                        .homerun()  // how do we calc the RBIs?
                        .done(),
                }
            };
        default:
            return team;
    }
};
