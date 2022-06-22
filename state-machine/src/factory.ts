import { mergeDeepRight } from 'ramda';
import { GameConfig, GameMoment, OptionalRules, Player, Position, Team } from './types';
import { InningHalf, Bases } from './types';

export const defaultTeam = (name: string = '', alignment: 'home' | 'away' = 'away'): Team => {
    const lineup: string[] = [
        `${name && `${name} - `}playerA`,
        `${name && `${name} - `}playerB`,
        `${name && `${name} - `}playerC`,
        `${name && `${name} - `}playerD`,
    ];

    const roster: Team['roster'] = lineup.reduce<Team['roster']>((acc, player, index) => {
        acc[player] = defaultPlayer(player, alignment === 'away' && index === 0);
        return acc;
    }, {});

    return {
        roster,
        lineup,
        defense: {
            pitcher: lineup[0],
            fielders: [{
                player: lineup[1],
                position: Position.Infield,
            }, {
                player: lineup[2],
                position: Position.Outfield,
            }],
            bench: [lineup[3]]
        },
    };
};

export const defaultGame = (awayTeam: Team = defaultTeam('away', 'away'), homeTeam: Team = defaultTeam('home')): GameMoment => {
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
        configuration: defaultConfiguration(),
        pitches: [],
    }
};

export const defaultPlayer = (name: string = 'mockPlayer', leadOff: boolean = false): Player => {
    return {
        name,
        offenseStats: {
            plateAppearance: leadOff ? 1 : 0,
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
            strikeoutsSwinging: 0,
            strikeoutsLooking: 0,
            walks: 0,
            saves: 0,
            earnedRuns: 0,
            inningsPitched: 0,
            infieldErrors: 0,
            groundOuts: 0,
            flyOuts: 0,
            DPA: 0,
            DPSuccess: 0,
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
    };
};

export const noStatsGame = () => mergeDeepRight(defaultGame(), { configuration: { recordingStats: false } });
