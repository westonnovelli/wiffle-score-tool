import { Pitches } from "@wiffleball/state-machine";

export const safeParseInt = (shouldBeNumber: string, fallback: number = 0) : number => {
    const x = parseInt(shouldBeNumber);
    return Number.isNaN(x) ? fallback : x;
};

export const pitchDescriptions: Record<Pitches | -1, string> = {
    [Pitches.BALL]: 'ball',
    [Pitches.BALL_WILD]: 'wild pitch',
    [Pitches.STRIKE_SWINGING]: 'strike',
    [Pitches.STRIKE_LOOKING]: 'called strike',
    [Pitches.STRIKE_FOUL]: 'foul',
    [Pitches.STRIKE_FOUL_ZONE]: 'foul for a strikeout',
    [Pitches.STRIKE_FOUL_CAUGHT]: 'caught in foul territory',
    [Pitches.INPLAY_INFIELD_GRD_OUT]: 'ground out',
    [Pitches.INPLAY_INFIELD_AIR_OUT]: 'infield pop up',
    [Pitches.INPLAY_INFIELD_AIR_OUT_INFIELD_FLY]: 'infield fly',
    [Pitches.INPLAY_INFIELD_OUT_DP_SUCCESS]: 'double play',
    [Pitches.INPLAY_INFIELD_OUT_DP_FAIL]: 'fielder\'s choice',
    [Pitches.INPLAY_OUTFIELD_OUT]: 'fly out',
    [Pitches.INPLAY_OUTFIELD_OUT_TAG_SUCCESS]: 'fly out, runner tagged',
    [Pitches.INPLAY_OUTFIELD_OUT_TAG_FAIL]: 'fly out, runner out',
    [Pitches.INPLAY_INFIELD_SINGLE]: 'infield single',
    [Pitches.INPLAY_OUTFIELD_SINGLE]: 'single',
    [Pitches.INPLAY_DOUBLE]: 'double',
    [Pitches.INPLAY_TRIPLE]: 'triple',
    [Pitches.INPLAY_HOMERUN]: 'homerun',
    [Pitches.INTERFERENCE]: 'interference',
    [-1]: 'manual adjust',
};
