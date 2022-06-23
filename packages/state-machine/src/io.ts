import pickBy from 'ramda/src/pickBy.js';
import mergeDeepRight from 'ramda/src/mergeDeepRight.js';
import pick from 'ramda/src/pick.js';
import { defaultConfiguration, defaultGame, defaultRules } from './factory';
import { GameConfig, GameMoment } from "./types";

export const serializeGame = (game: GameMoment): string => {
    const standardConfig = defaultConfiguration();
    const standardRules = defaultRules();

    const essentials = pick([
        'configuration',
        'homeTeam',
        'awayTeam',
        'pitches',
        'manualEdits'
    ], game);
    const configEssentials: Partial<GameConfig> = pickBy((value, key) => standardConfig[key] !== value, essentials.configuration);
    const rulesEssentials: Partial<GameConfig['rules']> = pickBy((value, key) => standardRules[key] !== value, essentials.configuration.rules);
    const awayTeamEssentials = pick(['lineup', 'defense'], essentials.awayTeam);
    const homeTeamEssentials = pick(['lineup', 'defense'], essentials.homeTeam);
    return btoa(JSON.stringify({
        ...essentials,
        configuration: {
            ...configEssentials,
            rules: rulesEssentials,
        },
        awayTeam: awayTeamEssentials,
        homeTeam: homeTeamEssentials,
    }));
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
        manualEdits: parsed?.manualEdits ?? [],
    };
};
