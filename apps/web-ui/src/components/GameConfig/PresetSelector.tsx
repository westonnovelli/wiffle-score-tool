import React from 'react';
import { ConfigPreset } from '../../presets/configPresets';
import './PresetSelector.css';

type Props = {
    presets: Record<string, ConfigPreset>;
    selected: string; // id of the preset
} & JSX.IntrinsicElements['select'];

const PresetSelector: React.FC<Props> = ({presets, selected, ...props}) => {
    return (
        <div className="preset-selector">
            <label>Select a rules/configuration preset:</label>
            <select
                value={selected}
                {...props}
            >
                {Object.values(presets).map((preset) => (
                    <option key={preset.id} value={preset.id}>{preset.label}</option>
                ))}
                <option value={'custom'} disabled>Custom</option>
            </select>
        </div>
    );
};

export default PresetSelector;
