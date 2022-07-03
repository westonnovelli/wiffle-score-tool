import { Player, OffenseStats, PitchingStats, FieldingStats } from './types';

interface StatBuilder {
    player: Player;
    offense: (stat: keyof OffenseStats, amt: number) => StatBuilder;
    plateAppearance: () => StatBuilder;
    atBat: () => StatBuilder;
    strikeoutSwinging: () => StatBuilder;
    strikeoutLooking: () => StatBuilder;
    walk: () => StatBuilder;
    single: (rbi?: number) => StatBuilder;
    double: (rbi?: number) => StatBuilder;
    triple: (rbi?: number) => StatBuilder;
    homerun: (rbi?: number) => StatBuilder;
    pitching: (stat: keyof PitchingStats, amt: number) => StatBuilder;
    fielding: (stat: keyof FieldingStats, amt: number) => StatBuilder;
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
        walk: () => {
            return builder
                .offense('walks', 1);
        },
        single: () => {
            return builder
                .offense('atbats', 1)
                .offense('singles', 1)
                .offense('hits', 1);
        },
        double: () => {
            return builder
                .offense('atbats', 1)
                .offense('doubles', 1)
                .offense('hits', 1);
        },
        triple: () => {
            return builder
                .offense('atbats', 1)
                .offense('triples', 1)
                .offense('hits', 1);
        },
        homerun: () => {
            return builder
                .offense('atbats', 1)
                .offense('homeruns', 1)
                .offense('hits', 1)
                .offense('runs', 1);
        },
        pitching: (stat: keyof PitchingStats, amt: number) => {
            internalPlayer = {
                ...internalPlayer,
                defenseStats: {
                    ...internalPlayer.defenseStats,
                    pitching: {
                        ...internalPlayer.defenseStats.pitching,
                        [stat]: internalPlayer.defenseStats.pitching[stat] + amt
                    },
                }
            };
            return builder;
        },
        fielding: (stat: keyof FieldingStats, amt: number) => {
            internalPlayer = {
                ...internalPlayer,
                defenseStats: {
                    ...internalPlayer.defenseStats,
                    fielding: {
                        ...internalPlayer.defenseStats.fielding,
                        [stat]: internalPlayer.defenseStats.fielding[stat] + amt,
                    },
                }
            };
            return builder;
        },

        done: () => internalPlayer,
    };
    return builder;
};
