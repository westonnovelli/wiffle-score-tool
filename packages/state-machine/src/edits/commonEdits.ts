import { GameMoment, Team } from "../types";
import { getDefense, getDefenseKey } from "../teams/getTeams";
import { getPitcher } from "../defense/getPosition";
import manualEdit from "./manualEdit";

export const pitcherSwap = (game: GameMoment, newPitcher: string): GameMoment => {
    const pitcher = getPitcher(getDefense(game));
    if (!pitcher) return game;
    return fielderSwap(game, newPitcher, pitcher);
};

export const fielderSwap = (game: GameMoment, newFielder: string, oldFielder: string): GameMoment => {
    return fielderRotate(game, newFielder, oldFielder);
};

export const fielderRotate = (game: GameMoment, ...fielders: string[]): GameMoment => {
    const defenseKey = getDefenseKey(game);
    const defenseTeam = getDefense(game);

    if (fielders.some((fielder) => !Object.keys(defenseTeam.defense).includes(fielder))) {
        console.warn('trying to swap fielders not on team: ', ...fielders, defenseKey);
        return game;
    }

    const newDefense: Team['defense'] = {};
    fielders.forEach((fielder, i) => {
        const nextIndex = i + 1 === fielders.length ? 0 : i + 1;
        const nextPosition = defenseTeam.defense[fielders[nextIndex]];
        newDefense[fielder] = nextPosition;
    });

    return manualEdit(game, {
        [defenseKey]: {
            defense: newDefense,
        }
    });
};
