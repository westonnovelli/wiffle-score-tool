import type { GameMoment } from './types';
import { InningHalf, Bases } from './types';

export function defaultGame(): GameMoment {
    return {
        boxScore: [{
            home: 0,
            away: 0
        }],
        inning: {
            number: 1,
            half: InningHalf.TOP,
        },
        outs: 0,
        atBat: { name: 'batter1' },
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
    }
}
