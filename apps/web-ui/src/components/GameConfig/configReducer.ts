import { GameConfig } from "@wiffleball/state-machine";
import presets, { ConfigPreset } from "../../presets/configPresets";

type Action = {
    type: 'maxStrikes',
    payload: GameConfig['maxStrikes'],
} | {
    type: 'maxBalls',
    payload: GameConfig['maxBalls'],
} | {
    type: 'maxOuts',
    payload: GameConfig['maxOuts'],
} | {
    type: 'maxRuns',
    payload: GameConfig['maxRuns'],
} | {
    type: 'maxInnings',
    payload: GameConfig['maxInnings'],
} | {
    type: 'maxFielders',
    payload: GameConfig['maxFielders'],
} | {
    type: 'allowExtras',
    payload: GameConfig['allowExtras'],
} | {
    type: 'recordingStats',
    payload: GameConfig['recordingStats'],
} | {
    type: 'rules',
    payload: GameConfig['rules'],
} | {
    type: 'preset',
    payload: ConfigPreset,
};

const initial: ConfigPreset = presets.cpCasual;

const reducer = (state: ConfigPreset = initial, action: Action): ConfigPreset => {
    console.log(action);
    switch (action.type) {
        case 'maxStrikes':
            return {
                id: 'custom',
                label: 'custom',
                config: {
                    ...state.config,
                    maxStrikes: action.payload,
                }
            };
        case 'maxBalls':
            return {
                id: 'custom',
                label: 'custom',
                config: {
                    ...state.config,
                    maxBalls: action.payload,
                }
            };
        case 'maxOuts':
            return {
                id: 'custom',
                label: 'custom',
                config: {
                    ...state.config,
                    maxOuts: action.payload,
                }
            };
        case 'maxRuns':
            return {
                id: 'custom',
                label: 'custom',
                config: {
                    ...state.config,
                    maxRuns: action.payload,
                }
            };
        case 'maxInnings':
            return {
                id: 'custom',
                label: 'custom',
                config: {
                    ...state.config,
                    maxInnings: action.payload,
                }
            };
        case 'maxFielders':
            return {
                id: 'custom',
                label: 'custom',
                config: {
                    ...state.config,
                    maxFielders: action.payload,
                }
            };
        case 'allowExtras':
            return {
                id: 'custom',
                label: 'custom',
                config: {
                    ...state.config,
                    allowExtras: action.payload,
                }
            };
        case 'recordingStats':
            return {
                id: 'custom',
                label: 'custom',
                config: {
                    ...state.config,
                    recordingStats: action.payload,
                }
            };
        case 'rules': {
            return {
                id: 'custom',
                label: 'custom',
                config: {
                    ...state.config,
                    rules: action.payload,
                }
            };
        }
        case 'preset': {
            return {
                ...action.payload,
            };
        }
        default:
            return state;
    }
};

export default reducer;
