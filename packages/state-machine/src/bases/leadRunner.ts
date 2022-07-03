import { Bases, GameMoment } from "../types";

// runner furthest along the bases
export const leadRunner = (bases: GameMoment['bases']): Bases | undefined => {
    if (bases[Bases.THIRD] > 0) return Bases.THIRD;
    if (bases[Bases.SECOND] > 0) return Bases.SECOND;
    if (bases[Bases.FIRST] > 0) return Bases.FIRST;
    return undefined;
};

// runner furthest along the bases, that is forced to advance
export const forcedRunner = (bases: GameMoment['bases']): Bases | undefined => {
    if (bases[Bases.THIRD] > 0 && bases[Bases.SECOND] > 0 && bases[Bases.FIRST] > 0) return Bases.THIRD;
    if (bases[Bases.SECOND] > 0 && bases[Bases.FIRST] > 0) return Bases.SECOND;
    if (bases[Bases.FIRST] > 0) return Bases.FIRST;
    return undefined;
};
