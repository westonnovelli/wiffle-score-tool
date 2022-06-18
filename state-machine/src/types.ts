export type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export enum Pitches {
    // NOT IN PLAY
    BALL,
    BALL_WILD, // doesn't hit the backstop
    STRIKE_SWINGING,
    STRIKE_LOOKING, // hits the strike zone
    STRIKE_FOUL, // contact with the bat, not in play
    STRIKE_FOUL_ZONE, // contact with the bat, 2 strikes count, ball hits zone directly after bat
    STRIKE_FOUL_CAUGHT, // fielder catches ball in foul territory

    // IN PLAY
    INPLAY_INFIELD_OUT,
    INPLAY_INFIELD_OUT_DP_SUCCESS,
    INPLAY_INFIELD_OUT_DP_FAIL,
    INPLAY_INFIELD_ERROR,
    INPLAY_OUTFIELD_OUT,
    INPLAY_INFIELD_SINGLE,
    INPLAY_OUTFIELD_SINGLE,
    INPLAY_DOUBLE,
    INPLAY_TRIPLE,
    INPLAY_HOMERUN,

    // OTHER
    INTERFERENCE, // or otherwise screwed up play, that you want to log (just skip it if its not important)
}

export enum InningHalf {
    TOP,
    BOTTOM
}

export interface Inning {
    number: number;
    half: InningHalf
}

export interface Score {
    home: number;
    away: number;
}

export interface CountMoment {
    balls: number; // again, 0 -> 4, but let's not constrain ourselves via types
    strikes: number;
}

export enum Bases {
    FIRST,
    SECOND,
    THIRD,
    HOME
}

export interface Batter {
    name: string;
}

export interface GameMoment {
    boxScore: Score[];
    inning: Inning;
    outs: number; // maybe consider -> 0 | 1 | 2 | 3, but we probably want to account for goofy games
    atBat: Batter;
    count: CountMoment;
    bases: Record<Bases, number>;
}
