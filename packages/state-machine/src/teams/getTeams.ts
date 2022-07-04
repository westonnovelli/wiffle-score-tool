import { GameMoment, InningHalf, Team } from "../types";

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

export const getOtherTeamKey = (key: 'homeTeam' | 'awayTeam'): 'homeTeam' | 'awayTeam' => {
    return key === 'homeTeam' ? 'awayTeam' : 'homeTeam';
};
