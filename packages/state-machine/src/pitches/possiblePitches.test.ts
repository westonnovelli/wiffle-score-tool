import mergeDeepRight from "ramda/src/mergeDeepRight.js";
import { defaultGame } from "../factory";
import { Bases, OptionalRules, Pitches } from "../types";
import getPossiblePitches from "./possiblePitches";

test('Strike (Looking) requires the rule to be enabled', () => {
    expect(getPossiblePitches(defaultGame())).toContain(Pitches.STRIKE_LOOKING);

    const game = mergeDeepRight(defaultGame(), { configuration: { rules: { [OptionalRules.CaughtLookingRule]: false } } });
    expect(getPossiblePitches(game)).not.toContain(Pitches.STRIKE_LOOKING);
});

test('Strike (Foul) into the zone requires 2 strikes AND the rule to be enabled', () => {
    expect(getPossiblePitches(defaultGame())).not.toContain(Pitches.STRIKE_FOUL_ZONE);

    const game = mergeDeepRight(defaultGame(), { count: { strikes: 2 } });
    expect(getPossiblePitches(game)).toContain(Pitches.STRIKE_FOUL_ZONE);

    const game2 = mergeDeepRight(defaultGame(), { configuration: { rules: { [OptionalRules.FoulToTheZoneIsStrikeOut]: false } } });
    expect(getPossiblePitches(game2)).not.toContain(Pitches.STRIKE_FOUL_ZONE);
});

test('InfieldFly requires a runner on first', () => {
    expect(getPossiblePitches(defaultGame())).not.toContain(Pitches.INPLAY_INFIELD_AIR_OUT_INFIELD_FLY);

    const game = mergeDeepRight(defaultGame(), { bases: { [Bases.FIRST]: 1 } });
    expect(getPossiblePitches(game)).toContain(Pitches.INPLAY_INFIELD_AIR_OUT_INFIELD_FLY);
});

test('DP and FC require a forced runner and less than 2 outs', () => {
    expect(getPossiblePitches(defaultGame())).not.toContain(Pitches.INPLAY_INFIELD_OUT_DP_SUCCESS);
    expect(getPossiblePitches(defaultGame())).not.toContain(Pitches.INPLAY_INFIELD_OUT_DP_FAIL);

    const game2outs = mergeDeepRight(defaultGame(), { outs: 2, bases: { [Bases.FIRST]: 1 } });
    expect(getPossiblePitches(game2outs)).not.toContain(Pitches.INPLAY_INFIELD_OUT_DP_SUCCESS);
    expect(getPossiblePitches(game2outs)).not.toContain(Pitches.INPLAY_INFIELD_OUT_DP_FAIL);

    const game2nd = mergeDeepRight(defaultGame(), { outs: 2, bases: { [Bases.SECOND]: 1 } });
    expect(getPossiblePitches(game2nd)).not.toContain(Pitches.INPLAY_INFIELD_OUT_DP_SUCCESS);
    expect(getPossiblePitches(game2nd)).not.toContain(Pitches.INPLAY_INFIELD_OUT_DP_FAIL);

    const game1st = mergeDeepRight(defaultGame(), { bases: { [Bases.FIRST]: 1 } });
    expect(getPossiblePitches(game1st)).toContain(Pitches.INPLAY_INFIELD_OUT_DP_SUCCESS);
    expect(getPossiblePitches(game1st)).toContain(Pitches.INPLAY_INFIELD_OUT_DP_FAIL);

    const game1st2nd = mergeDeepRight(defaultGame(), { bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1 } });
    expect(getPossiblePitches(game1st2nd)).toContain(Pitches.INPLAY_INFIELD_OUT_DP_SUCCESS);
    expect(getPossiblePitches(game1st2nd)).toContain(Pitches.INPLAY_INFIELD_OUT_DP_FAIL);

    const game1st2nd3rd = mergeDeepRight(defaultGame(), { bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, [Bases.THIRD]: 1 } });
    expect(getPossiblePitches(game1st2nd3rd)).toContain(Pitches.INPLAY_INFIELD_OUT_DP_SUCCESS);
    expect(getPossiblePitches(game1st2nd3rd)).toContain(Pitches.INPLAY_INFIELD_OUT_DP_FAIL);

    const game1st3rd = mergeDeepRight(defaultGame(), { bases: { [Bases.FIRST]: 1, [Bases.THIRD]: 1 } });
    expect(getPossiblePitches(game1st3rd)).toContain(Pitches.INPLAY_INFIELD_OUT_DP_SUCCESS);
    expect(getPossiblePitches(game1st3rd)).toContain(Pitches.INPLAY_INFIELD_OUT_DP_FAIL);
});

test('Runner on 3rd tagging requires that runner and less than 2 outs and the rule to be enabled', () => {
    expect(getPossiblePitches(defaultGame())).not.toContain(Pitches.INPLAY_OUTFIELD_OUT_TAG_SUCCESS);
    expect(getPossiblePitches(defaultGame())).not.toContain(Pitches.INPLAY_OUTFIELD_OUT_TAG_FAIL);

    const game2outs = mergeDeepRight(defaultGame(), { outs: 2, bases: { [Bases.THIRD]: 1 } });
    expect(getPossiblePitches(game2outs)).not.toContain(Pitches.INPLAY_OUTFIELD_OUT_TAG_SUCCESS);
    expect(getPossiblePitches(game2outs)).not.toContain(Pitches.INPLAY_OUTFIELD_OUT_TAG_FAIL);

    const game3rd = mergeDeepRight(defaultGame(), { bases: { [Bases.THIRD]: 1 } });
    expect(getPossiblePitches(game3rd)).toContain(Pitches.INPLAY_OUTFIELD_OUT_TAG_SUCCESS);
    expect(getPossiblePitches(game3rd)).toContain(Pitches.INPLAY_OUTFIELD_OUT_TAG_FAIL);

    const game3rd1out = mergeDeepRight(defaultGame(), { outs: 1, bases: { [Bases.THIRD]: 1 } });
    expect(getPossiblePitches(game3rd)).toContain(Pitches.INPLAY_OUTFIELD_OUT_TAG_SUCCESS);
    expect(getPossiblePitches(game3rd)).toContain(Pitches.INPLAY_OUTFIELD_OUT_TAG_FAIL);

    const game1st2nd3rd = mergeDeepRight(defaultGame(), { bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, [Bases.THIRD]: 1 } });
    expect(getPossiblePitches(game1st2nd3rd)).toContain(Pitches.INPLAY_OUTFIELD_OUT_TAG_SUCCESS);
    expect(getPossiblePitches(game1st2nd3rd)).toContain(Pitches.INPLAY_OUTFIELD_OUT_TAG_FAIL);
});
