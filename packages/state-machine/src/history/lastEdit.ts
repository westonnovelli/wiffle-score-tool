import findLast from "ramda/src/findLast.js";
import { GameMoment, Pitches } from "../types";

const lastEditIndex = (state: GameMoment): number => {
    return state.pitches.lastIndexOf(-1);
};

export default lastEditIndex;
