import React from 'react';
import { GameConfig, OptionalRules } from '@wiffleball/state-machine';
import { rules as rulesTranslations } from '../../translations';

interface Props {
    rules: GameConfig['rules'];
    setRules: React.Dispatch<GameConfig['rules']>;
}

const RulesControl: React.FC<Props> = ({ rules, setRules }) => {
    return (
        <fieldset className="rules">
            <legend>Game Rules</legend>
            {Object.keys(rules).map((key) => {
                const ruleKey: OptionalRules = (key as unknown) as OptionalRules;
                const match = rulesTranslations.find((rule) => {
                    return rule.value === parseInt(`${ruleKey}`); // string to number comparison...
                })?.label
                const display = match ?? OptionalRules[ruleKey];
                const value: boolean = rules[ruleKey];
                return (
                    <div key={key}>
                        <label>
                            <input
                                key={`${key}-${value}`}
                                type="checkbox"
                                name={key}
                                value={display}
                                defaultChecked={value}
                                onChange={() => void setRules({ ...rules, [key]: !value })}
                            />
                            {display}
                        </label>
                        
                    </div>
                );
            })}
        </fieldset>
    );
};

export default RulesControl;
