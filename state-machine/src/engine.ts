import { GameMoment, Pitches } from "./types";
import { defaultGame } from "./factory";
import { getDefense, getDefenseKey, getOffense, getOffenseKey, pitch } from "./gameReducer";
import { log } from "./pitchLog";
import { defenseStats, offenseStats } from "./statsReducer";

let game = defaultGame();

export const handlePitch = (game: GameMoment, thrownPitch: Pitches) => {
    return pitch(game, thrownPitch);
};

const hydrateGame = (gameStub: GameMoment): GameMoment => {
    return gameStub.pitches.reduce((game, thrown) => {
        return pitch(game, thrown);
    }, gameStub);
};
