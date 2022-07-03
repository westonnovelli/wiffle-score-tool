import { GameMoment } from "../types";
import { pitch } from "../gameReducer";
import manualEdit from "../edits/manualEdit";

const hydrateGame = (gameStub: GameMoment, pitchIndex?: number): GameMoment => {
    const pitchLog = [...gameStub.pitches].slice(0, pitchIndex);
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

export default hydrateGame;
