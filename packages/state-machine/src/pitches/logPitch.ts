import { GameMoment, Pitches } from "../types";

function logPitch(state: GameMoment, pitch: Pitches): GameMoment {
    if (!state.configuration.recordingStats) return state;
    return {
        ...state,
        pitches: [...state.pitches, pitch],
    };
};

export default logPitch;
