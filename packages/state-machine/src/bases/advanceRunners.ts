import { forcedRunner } from "./leadRunner";
import { GameMoment, Bases } from "../types";

// moves runners on base forward `basesToAdvance` number of bases
// advancing runners 4 assumes the batter moves (unique rule)
// if the runners are advancing 1 base, unforced runners might not move (ex: walk with runner on 3rd does not score the run)
// if runners are advancing more than 1 base, unforced runners advance the same as forced runners
// TODO: consider changing the implementation of the comment above
const advanceRunners = (bases: GameMoment['bases'], basesToAdvance: 0 | 1 | 2 | 3 | 4, advanceUnforced: boolean = true): GameMoment['bases'] => {
    const leadForced = forcedRunner(bases);
    switch (basesToAdvance) {
        case 1: {
            return {
                [Bases.FIRST]: 0,
                [Bases.SECOND]: (advanceUnforced || leadForced === Bases.FIRST) ? bases[Bases.FIRST] : bases[Bases.SECOND],
                [Bases.THIRD]: (advanceUnforced || leadForced === Bases.SECOND) ? bases[Bases.SECOND] : bases[Bases.THIRD],
                [Bases.HOME]: (advanceUnforced || leadForced === Bases.THIRD) ? bases[Bases.HOME] + bases[Bases.THIRD] : bases[Bases.HOME],
            };
        }
        case 2: {
            return {
                [Bases.HOME]: bases[Bases.HOME] + bases[Bases.THIRD] + bases[Bases.SECOND],
                [Bases.THIRD]: bases[Bases.FIRST],
                [Bases.SECOND]: 0,
                [Bases.FIRST]: 0,
            };
        }
        case 3: {
            return {
                [Bases.HOME]:
                    bases[Bases.HOME] + bases[Bases.THIRD] + bases[Bases.SECOND] + bases[Bases.FIRST],
                [Bases.THIRD]: 0,
                [Bases.SECOND]: 0,
                [Bases.FIRST]: 0,
            };
        }
        case 4: {
            return {
                [Bases.HOME]:
                    bases[Bases.HOME] + bases[Bases.THIRD] + bases[Bases.SECOND] + bases[Bases.FIRST] + 1,
                [Bases.THIRD]: 0,
                [Bases.SECOND]: 0,
                [Bases.FIRST]: 0,
            };
        }
        default:
            return { ...bases };
    }
};

export default advanceRunners;
