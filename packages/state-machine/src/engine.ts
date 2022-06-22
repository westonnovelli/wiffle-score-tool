import omit from "ramda/src/omit.js";
import { GameMoment, Pitches } from "./types";
import { defaultGame } from "./factory";
import { pitch } from "./gameReducer";

let game = defaultGame();

export const handlePitch = (game: GameMoment, thrownPitch: Pitches) => {
    return pitch(game, thrownPitch);
};

export const hydrateGame = (gameStub: GameMoment): GameMoment => {
    const pitchLog = [...gameStub.pitches];
    const stubbier: GameMoment = { ...gameStub, pitches: [] };
    return pitchLog.reduce((game, thrown) => {
        return pitch(game, thrown);
    }, stubbier);
};
