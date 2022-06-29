import { getDefense, getDefenseKey } from "./gameReducer";
import manualEdit from "./manualEdit";
import { GameMoment, Position, Team } from "./types";

const getPosition = (team: Team, pos: Position): string[] => {
    return Object.entries(team.defense).reduce<string[]>((acc, [id, position]) => {
        if (position === pos) {
            acc.push(id);
        }
        return acc;
    }, []);
};

export const getPitcher = (team: Team): string => getPosition(team, Position.Pitcher)[0];
export const getInfield = (team: Team): string[] => getPosition(team, Position.Infield);
export const getOutfield = (team: Team): string[] => getPosition(team, Position.Outfield);
export const getBench = (team: Team): string[] => getPosition(team, Position.Bench);

export const pitcherSwap = (game: GameMoment, newPitcher: string): GameMoment => {
    return fielderSwap(game, newPitcher, getPitcher(getDefense(game)));
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
}
