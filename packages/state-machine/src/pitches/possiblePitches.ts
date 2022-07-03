import { Bases, GameMoment, OptionalRules, Pitches } from "../types";
import { forcedRunner } from "../bases/leadRunner";

const getPossiblePitches = (game: GameMoment): Pitches[] => {
    const values = Object.values(Pitches);
    const allPitches = values
        .filter((value) => typeof value === "string")
        .map((value) => value as string);

    return allPitches.filter((p) => {
        // @ts-expect-error
        const pitch: Pitches = Pitches[p];
        switch(pitch) {
            case Pitches.STRIKE_LOOKING:
                return game.configuration.rules[OptionalRules.CaughtLookingRule];
            case Pitches.STRIKE_FOUL_ZONE:
                return game.count.strikes === game.configuration.maxStrikes - 1
                    && game.configuration.rules[OptionalRules.FoulToTheZoneIsStrikeOut];
            case Pitches.INPLAY_INFIELD_AIR_OUT_INFIELD_FLY:
                return game.bases[Bases.FIRST] > 0;
            case Pitches.INPLAY_INFIELD_OUT_DP_SUCCESS:
            case Pitches.INPLAY_INFIELD_OUT_DP_FAIL:
                return forcedRunner(game.bases) !== undefined && game.outs < game.configuration.maxOuts - 1;
            case Pitches.INPLAY_OUTFIELD_OUT_TAG_SUCCESS:
            case Pitches.INPLAY_OUTFIELD_OUT_TAG_FAIL:
                return game.bases[Bases.THIRD] > 0
                    && game.outs < game.configuration.maxOuts - 1
                    && game.configuration.rules[OptionalRules.ThirdBaseCanTag];
            default:
                return true;
        }
    }).map(k => {
        // @ts-expect-error
        const pitch: Pitches = Pitches[k];
        return pitch;
    });
};

export default getPossiblePitches;
