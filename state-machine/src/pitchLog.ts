import { GameMoment, Pitches } from "./types";


export function log(state: GameMoment, pitch: Pitches): GameMoment {
    return {
        ...state,
        pitches: [...state.pitches, pitch],
    };
};
