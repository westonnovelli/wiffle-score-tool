import { Bases, GameMoment } from "../types";

export const runnersOn = (state: GameMoment): number => {
    const { [Bases.FIRST]: first, [Bases.SECOND]: second, [Bases.THIRD]: third } = state.bases;
    return first + second + third;
};
