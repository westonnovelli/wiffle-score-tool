import findLast from "ramda/src/findLast.js";
import { GameMoment, Pitches } from "../types";

const lastPitch = (state: GameMoment): Pitches => {
    return findLast((candidate) => {
        return Object.values(Pitches).includes(candidate)
    }, state.pitches) ?? -1;
};

export default lastPitch;
