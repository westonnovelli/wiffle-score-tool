import pickBy from 'ramda/src/pickBy.js';
import mergeDeepRight from 'ramda/src/mergeDeepRight.js';
import pick from 'ramda/src/pick.js';
import { defaultConfiguration, defaultGame, defaultRules, defaultTeam, newTeam } from './factory';
import { GameConfig, GameMoment, Player, Team } from "./types";
import { start } from './gameReducer';

const stripTeam = (team: Team) => {
    const rosterEssentials = Object.keys(team.roster).reduce<Record<string, Pick<Player, 'id' | 'name'>>>((acc, id) => {
        acc[id] = pick(['id', 'name'], team.roster[id]);
        return acc;
    }, {});

    return {
        startingLineup: team.startingLineup,
        startingDefense: team.startingDefense,
        roster: rosterEssentials,
        id: team.id,
        name: team.name,
    };
};

export const serializeGame = (game: GameMoment): string => {
    const standardConfig = defaultConfiguration();
    const standardRules = defaultRules();

    const essentials = pick([
        'configuration',
        'pitches',
        'manualEdits'
    ], game);
    const configEssentials: Partial<GameConfig> = pickBy((value, key) => standardConfig[key] !== value, essentials.configuration);
    const rulesEssentials: Partial<GameConfig['rules']> = pickBy((value, key) => standardRules[key] !== value, essentials.configuration.rules);
    
    return btoa(JSON.stringify({
        ...essentials,
        configuration: {
            ...configEssentials,
            rules: rulesEssentials,
        },
        awayTeam: stripTeam(game.awayTeam),
        homeTeam: stripTeam(game.homeTeam),
    }));
};

const parseRoster = (team: Team) => (id: string) => ({
    id,
    name: team.roster[id].name,
    position: team.startingDefense[id]
});

export const deserializeGame = (serialized: string): GameMoment => {
    let parsed: GameMoment | undefined;
    try {
        parsed = JSON.parse(atob(serialized));
    } catch (e) {
        console.error('error parsing serialized game', e);
        return defaultGame();
    }
    if (!parsed) return defaultGame();

    const awayTeam = newTeam(
        parsed?.awayTeam.startingLineup.map(parseRoster(parsed.awayTeam)) ?? [],
        parsed?.awayTeam.id,
        parsed?.awayTeam.name
    );
    const homeTeam = newTeam(
        parsed?.homeTeam.startingLineup.map(parseRoster(parsed.homeTeam)) ?? [],
        parsed?.homeTeam.id,
        parsed?.homeTeam.name,
    );

    const initialGame = defaultGame(awayTeam, homeTeam);
    const toBeMerged = pick(['configuration'], parsed);
    const merged: GameMoment = mergeDeepRight(start(initialGame), toBeMerged);
    return {
        ...merged,
        pitches: parsed?.pitches ?? [],
        manualEdits: parsed?.manualEdits ?? [],
    };
};


export const serializeTeam = (team: Team): string => {
    return btoa(JSON.stringify(stripTeam(team)));
};

export const deserializeTeam = (serialized: string): Team => {
    let parsed: Team | undefined;
    try {
        parsed = JSON.parse(atob(serialized));
    } catch (e) {
        console.error('error parsing serialized team', e);
        return defaultTeam();
    }
    if (!parsed) return defaultTeam();

    return newTeam(
        parsed?.startingLineup.map(parseRoster(parsed)) ?? [],
        parsed?.id,
        parsed?.name,
    ) ?? defaultTeam();
};

