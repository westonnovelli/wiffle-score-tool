import mergeDeepRight from 'ramda/src/mergeDeepRight.js';
import pick from 'ramda/src/pick.js';
import { defaultGame } from './factory';
import { GameMoment } from "./types";

export const serializeGame = (game: GameMoment): string => {
    const essentials = pick([
        'configuration',
        'homeTeam',
        'awayTeam',
        'pitches',
    ], game);
    return btoa(JSON.stringify(essentials));
};

export const deserializeGame = (serialized: string): GameMoment => {
    let parsed: GameMoment | undefined;
    try {
        parsed = JSON.parse(atob(serialized));
    } catch (e) {
        console.error('error parsing serialized game', e);
    }
    const toBeMerged = pick([
        'configuration',
        'homeTeam',
        'awayTeam',
    ], parsed);
    const merged: GameMoment = mergeDeepRight(defaultGame(), toBeMerged);
    return {
        ...merged,
        pitches: parsed?.pitches ?? [],
    };
};
