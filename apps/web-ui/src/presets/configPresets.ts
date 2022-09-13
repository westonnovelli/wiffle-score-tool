import { defaultConfiguration, GameConfig } from "@wiffleball/state-machine";

export interface ConfigPreset {
    id: string;
    label: string;
    config: GameConfig;
}

const cpCasual = (): ConfigPreset => {
    return {
        id: 'cpCasual',
        label: 'Casual',
        config: defaultConfiguration(),
    };
};

const cpCompetitive = (): ConfigPreset => {
    return {
        id: 'cpCompetitive',
        label: 'Competitive',
        config: {
            ...defaultConfiguration(),
            maxInnings: 3,
            allowExtras: false,
        },
    };
};

const presets: Record<string, ConfigPreset> = {
    cpCasual: cpCasual(),
    cpCompetitive: cpCompetitive(),
};

export default presets;
