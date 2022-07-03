import mergeDeepRight from "ramda/src/mergeDeepRight.js";
import { Bases, GameMoment, StatEvent } from "../types";
import { getDefense, getDefenseKey, getOffense, getOffenseKey } from "../teams/getTeams";
import logStats from "../stats/logStats";
import { offenseStats } from "../stats/statsReducer";

// returns the next batter in the lineup for the offense, or the "next due up" for the defense
const whoisNextBatter = (state: GameMoment, offense: boolean = true): string => {
    const team = offense ? getOffense(state) : getDefense(state);
    const currentBatterOrder = team.lineup.indexOf(state.atBat);
    return currentBatterOrder >= 0 ? team.lineup[(currentBatterOrder + 1) % team.lineup.length] : team.lineup[0];
};

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

export default batterUp;
