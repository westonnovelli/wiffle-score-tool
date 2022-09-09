import { mergeDeepRight } from 'ramda';
import {
    Bases,
    InningHalf,
    OptionalRules,
    Position,
    Score,
    PlayerSeed,
    type GameConfig,
    type GameMoment,
    type Player,
    type Team,
} from './types';

let pid = 0;
let tid = 0;

export const defaultTeam = (
    id: string = `${tid}`,
    name: string = `team-${id}`,
    playerNames?: string[]
): Team => {
    tid += 1;
    const names: string[] = playerNames || [
        `${name && `${name} - `}playerA`,
        `${name && `${name} - `}playerB`,
        `${name && `${name} - `}playerC`,
        `${name && `${name} - `}playerD`,
    ];

    return names.reduce<Team>((acc, player, index) => {
        const newPlayer = defaultPlayer(player);
        acc.roster[newPlayer.id] = newPlayer;
        acc.lineup.push(newPlayer.id);
        acc.startingLineup.push(newPlayer.id);
        acc.defense[newPlayer.id] = index; // enum hack of Position
        acc.startingDefense[newPlayer.id] = index; // also here
        return acc;
    }, {
        roster: {},
        lineup: [],
        defense: {},
        startingLineup: [],
        startingDefense: {},
        id: `${id}`,
        name
    });
};

export const newTeam = (
    players: PlayerSeed[],
    teamId?: string,
    teamName?: string
): Team | undefined => {
    if (players.length === 0) return undefined;
    const id = teamId || tid;
    tid += 1;
    return players.reduce<Team>((acc, player) => {
        const newPlayer = defaultPlayer(player.name, player.id);
        acc.roster[player.id] = newPlayer;
        acc.lineup.push(newPlayer.id);
        acc.startingLineup.push(newPlayer.id);
        acc.defense[player.id] = player.position;
        acc.startingDefense[player.id] = player.position;
        return acc;
    }, {
        roster: {},
        lineup: [],
        defense: {},
        startingLineup: [],
        startingDefense: {},
        id: `${id}`,
        name: teamName || `team-${id}`
    });
};

export const defaultGame = (awayTeam: Team = defaultTeam('away'), homeTeam: Team = defaultTeam('home')): GameMoment => {
    pid = 0;
    const firstBatter = awayTeam.lineup[0] ?? 'mockBatter';
    const homesFirstBatter = homeTeam.lineup[0] ?? 'mockBatterHome';
    return {
        boxScore: [{
            homeTeam: 0,
            awayTeam: 0
        }],
        inning: {
            number: 1,
            half: InningHalf.TOP,
        },
        outs: 0,
        atBat: firstBatter,
        nextHalfAtBat: homesFirstBatter,
        count: {
            balls: 0,
            strikes: 0,
        },
        bases: {
            [Bases.FIRST]: 0,
            [Bases.SECOND]: 0,
            [Bases.THIRD]: 0,
            [Bases.HOME]: 0,
        },
        awayTeam,
        homeTeam,
        gameOver: false,
        gameStarted: false,
        configuration: defaultConfiguration(),
        pitches: [],
        manualEdits: [],
    }
};

export const defaultPlayer = (name: string = 'mockPlayer', id: string = `${pid}`): Player => {
    pid += 1;
    return {
        id,
        name,
        offenseStats: {
            plateAppearance: 0,
            atbats: 0,
            hits: 0,
            strikeoutsSwinging: 0,
            strikeoutsLooking: 0,
            walks: 0,
            singles: 0,
            doubles: 0,
            triples: 0,
            homeruns: 0,
            grandslams: 0,
            RBI: 0,
            LOB: 0,
            runs: 0,
            groundOuts: 0,
            flyOuts: 0,
            doublePlays: 0,
            doublePlayFails: 0,
            sacrificeFly: 0,
            walkoffs: 0,
        },
        defenseStats: {
            pitching: {
                battersFaced: 0,
                balls: 0,
                strikes: 0,
                wildPitches: 0,
                walks: 0,
                strikeoutsSwinging: 0,
                strikeoutsLooking: 0,
                groundOuts: 0,
                doublePlays: 0,
                flyOuts: 0,
                singles: 0,
                doubles: 0,
                triples: 0,
                homeruns: 0,
                runsAllowed: 0,
            },
            fielding: {
                putouts: 0,
                infieldErrors: 0,
                inningsPlayed: 0,
                DPA: 0,
                DPSuccess: 0,
                tagThrowAttempts: 0,
                tagThrowSuccess: 0,
            },
        }
    };
};

export const defaultConfiguration = (): GameConfig => {
    return {
        maxStrikes: 3,
        maxBalls: 4,
        maxOuts: 3,
        maxInnings: 5,
        maxRuns: 5,
        maxFielders: 2, // Not including pitcher (there's always a pitcher)
        rules: defaultRules(),
        recordingStats: true,
    };
};

export const defaultRules = (): Record<OptionalRules, boolean> => {
    return {
        [OptionalRules.RunnersAdvanceOnWildPitch]: true,
        [OptionalRules.RunnersAdvanceExtraOn2Outs]: true,
        [OptionalRules.CaughtLookingRule]: true,
        [OptionalRules.FoulToTheZoneIsStrikeOut]: true,
        [OptionalRules.ThirdBaseCanTag]: true,
        [OptionalRules.AllowSinglePlayRunsToPassLimit]: false,
        [OptionalRules.InFieldFly]: true,
    };
};

export const noStatsGame = () => mergeDeepRight(defaultGame(), { configuration: { recordingStats: false } });

export const NEW_COUNT: GameMoment['count'] = {
    balls: 0,
    strikes: 0,
};

export const EMPTY_BASES: GameMoment['bases'] = {
    [Bases.FIRST]: 0,
    [Bases.SECOND]: 0,
    [Bases.THIRD]: 0,
    [Bases.HOME]: 0,
};

export const EMPTY_BOX: Score = {
    awayTeam: 0,
    homeTeam: 0,
};
