import lastPitch from "../history/lastPitch";
import { getDefenseKey, getOffenseKey } from "../teams/getTeams";
import { GameMoment } from "../types";
import { defenseStats, offenseStats } from "./statsReducer";

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
};

export default logStats;
