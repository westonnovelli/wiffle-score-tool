import { GameMoment, Pitches } from "./types";
import { pitch } from "./gameReducer";
import manualEdit from "./manualEdit";

export const handlePitch = (game: GameMoment, thrownPitch: Pitches): GameMoment => {
    return pitch(game, thrownPitch);
};

export const hydrateGame = (gameStub: GameMoment): GameMoment => {
    const pitchLog = [...gameStub.pitches];
    const editLog = [...gameStub.manualEdits];
    const stubbier: GameMoment = { ...gameStub, pitches: [], manualEdits: [] };
    let editCursor = 0;
    return pitchLog.reduce((game, thrown) => {
        if (thrown === -1) {
            const edit = editLog[editCursor];
            editCursor += 1;
            return manualEdit(game, edit);
        }
        return pitch(game, thrown);
    }, stubbier);
};
