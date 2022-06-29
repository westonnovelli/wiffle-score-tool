import React from 'react';
import { GameConfig, OptionalRules } from '@wiffleball/state-machine';

interface Props {
    rules: GameConfig['rules'];
    setRules: React.Dispatch<React.SetStateAction<GameConfig['rules']>>;
}

const RulesControl: React.FC<Props> = ({ rules, setRules }) => {
    return (
        <fieldset className="rules">
            <legend>Game Rules</legend>
            {Object.keys(rules).map((key) => {
                // @ts-expect-error
                const display = OptionalRules[key];
                // @ts-expect-error
                const value = rules[key];
                return (
                    <div key={key}>
                        <input
                            type="checkbox"
                            name={key}
                            value={display}
                            defaultChecked={value}
                            onChange={() => void setRules(prev => ({ ...prev, [key]: !value }))}
                        />
                        <label>{display}</label>
                    </div>
                );
            })}
        </fieldset>
    );
};

export default RulesControl;
