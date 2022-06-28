import { getDefense, getDefenseKey } from "./gameReducer";
import manualEdit from "./manualEdit";
import { GameMoment, Position, Team } from "./types";

export const fieldersCahnge = (
    game: GameMoment,
    
): GameMoment => {
    const defenseKey = getDefenseKey(game);
    const defenseTeam = getDefense(game);

    return game;
};

export const pitchingChange = (
    game: GameMoment,
    newPitcher: string
): GameMoment => {
    const defenseKey = getDefenseKey(game);
    const defenseTeam = getDefense(game);
    const oldPitcher = defenseTeam.defense.pitcher;

    // const newDefense = {
    //     ...defenseTeam.defense,
    //     pitcher: newPitcher,
    // };

    // if (fielderReplacementPosition === -1) {
    //     // destination is bench
    //     // TODO
    // } else {
    //     // move fielders[fielderReplacementPosition] to bench
    //     // pitcher to same position as fielders[fielderReplacementPosition]
    // }

    return manualEdit(game, {[defenseKey]: {
        ...defenseTeam,
        defense: defenseTeam,
    }});
};

const getPosition = (team: Team, pos: Position): string[] => {
    return Object.entries(team.defense).reduce<string[]>((acc, [id, position]) => {
        if (position === pos) {
            acc.push(id);
        }
        return acc;
    }, []);
};

const getPitcher = (team: Team) => getPosition(team, Position.Pitcher)[0];
const getInfield = (team: Team) => getPosition(team, Position.Infield);
const getOutfield = (team: Team) => getPosition(team, Position.Outfield);
const getBench = (team: Team) => getPosition(team, Position.Bench);

export const pitcherSwap = (game: GameMoment, newPitcher: string): GameMoment => {
    return fielderSwap(game, newPitcher, getPitcher(getDefense(game)));
};

export const fielderSwap = (game: GameMoment, newFielder: string, oldFielder: string): GameMoment => {
    const defenseKey = getDefenseKey(game);
    const defenseTeam = getDefense(game);

    if (defenseTeam.defense[oldFielder] === undefined || defenseTeam.defense[newFielder] === undefined) {
        console.warn('trying to swap player not on team: ', newFielder, oldFielder, defenseKey);
        return game;
    }

    return manualEdit(game, {
        [defenseKey]: {
            defense: {
                [newFielder]: defenseTeam.defense[oldFielder],
                [oldFielder]: defenseTeam.defense[newFielder],
            },
        }
    });
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
