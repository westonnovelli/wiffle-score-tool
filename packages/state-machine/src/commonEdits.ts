import { getDefense, getDefenseKey } from "./gameReducer";
import manualEdit from "./manualEdit";
import { GameMoment } from "./types";

export const pitchingChange = (
    game: GameMoment,
    newPitcher: string,
    fielderReplacementPosition: number = -1
) => {
    const defenseKey = getDefenseKey(game);
    const defenseTeam = getDefense(game);
    const oldPitcher = defenseTeam.defense.pitcher;

    const newDefense = {
        ...defenseTeam.defense,
        pitcher: newPitcher,
    };

    if (fielderReplacementPosition === -1) {
        // destination is bench
        // TODO
    } else {
        // move fielders[fielderReplacementPosition] to bench
        // pitcher to same position as fielders[fielderReplacementPosition]
    }

    return manualEdit(game, {[defenseKey]: {
        ...defenseTeam,
        defense: ,
    }});
};
