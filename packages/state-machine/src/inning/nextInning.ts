import { EMPTY_BASES, EMPTY_BOX, NEW_COUNT } from "../factory";
import { GameMoment, InningHalf } from "../types";

const nextInning = (state: GameMoment): Pick<GameMoment, 'inning' | 'outs' | 'count' | 'bases' | 'boxScore'> => {
    const currentInning = state.inning;
    const boxScore = [...state.boxScore];
    if (currentInning.half === InningHalf.BOTTOM) {
        boxScore.push(EMPTY_BOX);
    }
    return {
        inning: {
            number: currentInning.half === InningHalf.BOTTOM ? currentInning.number + 1 : currentInning.number,
            half: currentInning.half === InningHalf.BOTTOM ? InningHalf.TOP : InningHalf.BOTTOM,
        },
        outs: 0,
        count: NEW_COUNT,
        bases: EMPTY_BASES,
        boxScore,
    };
};

export default nextInning;
