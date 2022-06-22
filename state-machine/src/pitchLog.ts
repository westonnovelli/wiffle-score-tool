import { GameMoment, Pitches } from "./types";


export function log(state: GameMoment, pitch: Pitches): GameMoment {
    if (!state.configuration.recordingStats) return state;
    return {
        ...state,
        pitches: [...state.pitches, pitch],
    };
};
