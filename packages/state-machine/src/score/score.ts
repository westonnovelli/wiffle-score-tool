import { getDefenseKey, getOffenseKey } from "../teams/getTeams";
import { GameMoment } from "../types";

export const homeScore = (state: GameMoment): number => {
    return state.boxScore.reduce((total, inning) => total + inning.homeTeam, 0);
};

export const awayScore = (state: GameMoment): number => {
    return state.boxScore.reduce((total, inning) => total + inning.awayTeam, 0);
};

export const offenseScore = (state: GameMoment): number => {
    return state.boxScore.reduce((total, inning) => total + inning[getOffenseKey(state)], 0);
};

export const defenseScore = (state: GameMoment): number => {
    return state.boxScore.reduce((total, inning) => total + inning[getDefenseKey(state)], 0);
};
