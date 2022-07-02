import React from 'react';
import './GameConfigControl.css';
import NumberInput from './NumberInput';

// @ts-expect-error
const MAX_INNINGS = window.WIFFLE_SCORE_TOOL_SETTINGS?.maxInnings ?? 99;
// @ts-expect-error
const MAX_BALLS = window.WIFFLE_SCORE_TOOL_SETTINGS?.maxBalls ?? 99;
// @ts-expect-error
const MAX_STRIKES = window.WIFFLE_SCORE_TOOL_SETTINGS?.maxStrikes ?? 99;
// @ts-expect-error
const MAX_OUTS = window.WIFFLE_SCORE_TOOL_SETTINGS?.maxOuts ?? 99;
// @ts-expect-error
const MAX_FIELDERS = window.WIFFLE_SCORE_TOOL_SETTINGS?.maxFielders ?? 99;
// @ts-expect-error
const MAX_RUNS = window.WIFFLE_SCORE_TOOL_SETTINGS?.maxRuns ?? 99;

interface Props {
    maxBalls: number;
    setMaxBalls: React.Dispatch<React.SetStateAction<number>>;
    maxStrikes: number;
    setMaxStrikes: React.Dispatch<React.SetStateAction<number>>;
    maxOuts: number;
    setMaxOuts: React.Dispatch<React.SetStateAction<number>>;
    maxRuns: number;
    setMaxRuns: React.Dispatch<React.SetStateAction<number>>;
    maxFielders: number;
    setMaxFielders: React.Dispatch<React.SetStateAction<number>>;
    maxInnings: number;
    setMaxInnings: React.Dispatch<React.SetStateAction<number>>;
    allowExtras: boolean | undefined;
    setAllowExtras: React.Dispatch<React.SetStateAction<boolean | undefined>>;
    recordingStats: boolean;
    setRecordingStats: React.Dispatch<React.SetStateAction<boolean>>;
}

const GameConfigControl: React.FC<Props> = ({
    maxBalls, setMaxBalls,
    maxStrikes, setMaxStrikes,
    maxOuts, setMaxOuts,
    maxRuns, setMaxRuns,
    maxFielders, setMaxFielders,
    maxInnings, setMaxInnings,
    allowExtras, setAllowExtras,
    recordingStats, setRecordingStats,
}) => {
    return (
        <fieldset className="config">
            <legend>Game Configuration</legend>
            <div>
                <NumberInput
                    value={maxStrikes}
                    onChange={(e) => setMaxStrikes(parseInt(e.target.value))}
                    name="maxStrikes"
                    min={0}
                    max={MAX_STRIKES}
                />
                <label htmlFor="maxStrikes">max strikes</label>
            </div>
            <div>
                <NumberInput
                    value={maxBalls}
                    onChange={(e) => setMaxBalls(parseInt(e.target.value))}
                    name="maxBalls"
                    min={0}
                    max={MAX_BALLS}
                />
                <label htmlFor="maxBalls">max balls</label>
            </div>
            <div>
                <NumberInput
                    value={maxOuts}
                    onChange={(e) => setMaxOuts(parseInt(e.target.value))}
                    name="maxOuts"
                    min={0}
                    max={MAX_OUTS}
                />
                <label htmlFor="maxOuts">max outs</label>
            </div>
            <div>
                <NumberInput
                    value={maxRuns}
                    onChange={(e) => setMaxRuns(parseInt(e.target.value))}
                    name="maxRuns"
                    min={-1}
                    max={MAX_RUNS}
                />
                <label htmlFor="maxRuns">max runs</label>
            </div>
            <div>
                <NumberInput
                    value={maxInnings}
                    onChange={(e) => setMaxInnings(parseInt(e.target.value))}
                    name="maxInnings"
                    min={0}
                    max={MAX_INNINGS}
                />
                <label htmlFor="maxInnings">max innings</label>
            </div>
            <div>
                <NumberInput
                    value={maxFielders}
                    onChange={(e) => setMaxFielders(parseInt(e.target.value))}
                    name="maxFielders"
                    min={0}
                    max={MAX_FIELDERS}
                />
                <label htmlFor="maxFielders">max fielders</label>
            </div>
            <div>
                <input
                    type="checkbox"
                    name="allowExtras"
                    value="allowExtras"
                    defaultChecked={allowExtras}
                    onChange={() => void setAllowExtras(prev => !prev)}
                />
                <label htmlFor="allowExtras">allow extra innings</label>
            </div>
            <div>
                <input
                    type="checkbox"
                    name="recordingStats"
                    value="recordingStats"
                    defaultChecked={recordingStats}
                    onChange={() => void setRecordingStats(prev => !prev)}
                />
                <label htmlFor="recordingStats">recording stats</label>
            </div>
        </fieldset>
    );
};

export default GameConfigControl;
