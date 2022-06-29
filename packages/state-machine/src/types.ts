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
    INPLAY_INFIELD_AIR_OUT, // caught in the in-field, in the air (line drive or no infield fly call)
    INPLAY_INFIELD_AIR_OUT_INFIELD_FLY,
    INPLAY_INFIELD_OUT_DP_SUCCESS,
    INPLAY_INFIELD_OUT_DP_FAIL,
    INPLAY_INFIELD_ERROR,
    INPLAY_OUTFIELD_OUT,
    INPLAY_OUTFIELD_OUT_TAG_SUCCESS,
    INPLAY_OUTFIELD_OUT_TAG_FAIL,
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

// intentionally the same key's as the GameMoment refs to the team objects
export interface Score {
    homeTeam: number;
    awayTeam: number;
}

export interface CountMoment {
    balls: number;
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
    walkoffs: number;
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
    id: string;
    name: string;
    offenseStats: OffenseStats;
    defenseStats: DefenseStats;
}

export interface GameMoment {
    boxScore: Score[];
    inning: Inning;
    outs: number;
    atBat: string;
    nextHalfAtBat: string;
    count: CountMoment;
    bases: Record<Bases, number>;
    homeTeam: Team;
    awayTeam: Team;
    gameOver: boolean;
    configuration: GameConfig;
    pitches: (Pitches | -1)[];
    manualEdits: DeepPartial<GameMoment>[]
}

export interface GameConfig {
    maxStrikes: number;
    maxBalls: number;
    maxOuts: number;
    maxRuns: number;
    maxInnings: number;
    maxFielders: number;
    allowExtras?: boolean;
    recordingStats: boolean;
    rules: Record<OptionalRules, boolean>;
}

export enum OptionalRules {
    RunnersAdvanceOnWildPitch,
    RunnersAdvanceExtraOn2Outs,
    CaughtLookingRule,
    FoulToTheZoneIsStrikeOut,
    ThirdBaseCanTag,
    AllowSinglePlayRunsToPassLimit,
    InFieldFly,
}

export type BattingOrder = string[];

export enum Position {
    Pitcher,
    Infield,
    Outfield,
    Bench,
};

export interface Team {
    roster: Record<string, Player>;
    lineup: BattingOrder;
    defense: Record<string, Position>;
};