import { Player, OffenseStats } from './types';

interface StatBuilder {
    player: Player;
    offense: (stat: keyof OffenseStats, amt: number) => StatBuilder;
    single: (rbi?: number) => StatBuilder;
    double: (rbi?: number) => StatBuilder;
    triple: (rbi?: number) => StatBuilder;
    homerun: (rbi?: number) => StatBuilder;
    done: () => Player;
}

export const record = (player: Player): StatBuilder => {
    let internalPlayer = {...player};
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
        single: (rbi = 0) => {
            return builder
                .offense('singles', 1)
                .offense('hits', 1)
                .offense('RBI', rbi);
        },
        double: (rbi = 0) => {
            return builder
                .offense('doubles', 1)
                .offense('hits', 1)
                .offense('RBI', rbi);
        },
        triple: (rbi = 0) => {
            return builder
                .offense('triples', 1)
                .offense('hits', 1)
                .offense('RBI', rbi);
        },
        homerun: (rbi = 1) => {
            return builder
                .offense('homeruns', 1)
                .offense('hits', 1)
                .offense('RBI', rbi)
                .offense('runs', 1);
        },
        done: () => internalPlayer,
    };
    return builder;
};
