import { Player, OffenseStats } from './types';

interface StatBuilder {
    player: Player;
    offense: (stat: keyof OffenseStats, amt: number) => StatBuilder;
    plateAppearance: () => StatBuilder;
    atBat: () => StatBuilder;
    strikeoutSwinging: () => StatBuilder;
    strikeoutLooking: () => StatBuilder;
    single: (rbi?: number) => StatBuilder;
    double: (rbi?: number) => StatBuilder;
    triple: (rbi?: number) => StatBuilder;
    homerun: (rbi?: number) => StatBuilder;
    done: () => Player;
}

export const record = (player: Player): StatBuilder => {
    let internalPlayer = { ...player };
    const builder: StatBuilder = {
        player: internalPlayer,
        offense: (stat: keyof OffenseStats, amt: number) => {
            internalPlayer = {
                ...internalPlayer,
                offenseStats: {
                    ...internalPlayer.offenseStats,
                    [stat]: internalPlayer.offenseStats[stat] + amt
                },
            };
            return builder;
        },
        plateAppearance: () => {
            return builder.offense('plateAppearance', 1);
        },
        atBat: () => {
            return builder.offense('atbats', 1);
        },
        strikeoutSwinging: () => {
            return builder
                .offense('atbats', 1)
                .offense('strikeoutsSwinging', 1);
        },
        strikeoutLooking: () => {
            return builder
                .offense('atbats', 1)
                .offense('strikeoutsLooking', 1);
        },
        single: (rbi = 0) => {
            return builder
                .offense('atbats', 1)
                .offense('singles', 1)
                .offense('hits', 1)
                .offense('RBI', rbi);
        },
        double: (rbi = 0) => {
            return builder
                .offense('atbats', 1)
                .offense('doubles', 1)
                .offense('hits', 1)
                .offense('RBI', rbi);
        },
        triple: (rbi = 0) => {
            return builder
                .offense('atbats', 1)
                .offense('triples', 1)
                .offense('hits', 1)
                .offense('RBI', rbi);
        },
        homerun: (rbi = 1) => {
            return builder
                .offense('atbats', 1)
                .offense('homeruns', 1)
                .offense('hits', 1)
                .offense('RBI', rbi)
                .offense('runs', 1);
        },
        done: () => internalPlayer,
    };
    return builder;
};
