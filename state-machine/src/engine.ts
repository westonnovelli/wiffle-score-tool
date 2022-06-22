import { GameMoment, Pitches } from "./types";
import { defaultGame } from "./factory";
import { pitch } from "./gameReducer";
import { log } from "./pitchLog";

let game = defaultGame();

const handlePitch = (thrownPitch: Pitches) => {
    game = pitch(log(game, thrownPitch), thrownPitch);
};

const hydrateGame = (gameStub: GameMoment): GameMoment => {
    return gameStub.pitches.reduce((game, thrown) => {
        return pitch(game, thrown);
    }, gameStub);
};
