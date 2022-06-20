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
    INPLAY_INFIELD_GRD_OUT,
    INPLAY_INFIELD_LINE_OUT,
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

export enum StatEvent {
    PLATE_APPEARANCE = 'PA',
    RBI = 'RBI',
    INNING_END = 'INNING',
    WALK = 'W',
    WALK_OFF = 'WO',
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

// https://www.mlb.com/glossary/standard-stats
export interface OffenseStats {
    plateAppearance: number;
    atbats: number;
    hits: number;
    strikeoutsSwinging: number;
    strikeoutsLooking: number;
    walks: number;
    singles: number;
    doubles: number;
    triples: number;
    homeruns: number;
    grandslams: number;
    RBI: number;
    LOB: number;
    runs: number;
    groundOuts: number;
    flyOuts: number;
    doublePlays: number;
    doublePlayFails: number;
    sacrificeFly: number;
    reachedOnError: number;
}

export interface DefenseStats {
    strikeoutsSwinging: number;
    strikeoutsLooking: number;
    walks: number;
    saves: number;
    earnedRuns: number;
    inningsPitched: number;
    infieldErrors: number;
    groundOuts: number;
    flyOuts: number;
    DPA: number;
    DPSuccess: number;
}

export interface Player {
    name: string;
    offenseStats: OffenseStats;
    defenseStats: DefenseStats;
}

export interface GameMoment {
    boxScore: Score[];
    inning: Inning;
    outs: number; // maybe consider -> 0 | 1 | 2 | 3, but we probably want to account for goofy games
    atBat: string;
    nextHalfAtBat: string;
    count: CountMoment;
    bases: Record<Bases, number>;
    homeTeam: Team;
    awayTeam: Team;
    pitches: Pitches[];
}

export type BattingOrder = string[];

export enum Position {
    Infield,
    Outfield
};

export interface Team {
    roster: Record<string, Player>;
    lineup: BattingOrder;
    defense: {
        pitcher: string;
        fielders: {
            player: string;
            position: Position;
        }[];
        bench: string[];
    }
};

export interface Game {
    home: Team;
    away: Team;
    state: GameMoment;
};
