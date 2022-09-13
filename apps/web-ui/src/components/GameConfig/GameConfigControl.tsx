import React from 'react';
import { safeParseInt } from '../../helpers';
import './GameConfigControl.css';
import NumberInput from '../NumberInput';

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
    setMaxBalls: React.Dispatch<number>;
    maxStrikes: number;
    setMaxStrikes: React.Dispatch<number>;
    maxOuts: number;
    setMaxOuts: React.Dispatch<number>;
    maxRuns: number;
    setMaxRuns: React.Dispatch<number>;
    maxFielders: number;
    setMaxFielders: React.Dispatch<number>;
    maxInnings: number;
    setMaxInnings: React.Dispatch<number>;
    allowExtras: boolean | undefined;
    setAllowExtras: React.Dispatch<boolean | undefined>;
    recordingStats: boolean;
    setRecordingStats: React.Dispatch<boolean>;
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
                    onChange={(e) => setMaxStrikes(safeParseInt(e.target.value, 1))}
                    name="maxStrikes"
                    min={1}
                    max={MAX_STRIKES}
                />
                <label htmlFor="maxStrikes">max strikes</label>
            </div>
            <div>
                <NumberInput
                    value={maxBalls}
                    onChange={(e) => setMaxBalls(safeParseInt(e.target.value, 1))}
                    name="maxBalls"
                    min={1}
                    max={MAX_BALLS}
                />
                <label htmlFor="maxBalls">max balls</label>
            </div>
            <div>
                <NumberInput
                    value={maxOuts}
                    onChange={(e) => setMaxOuts(safeParseInt(e.target.value, 1))}
                    name="maxOuts"
                    min={1}
                    max={MAX_OUTS}
                />
                <label htmlFor="maxOuts">max outs</label>
            </div>
            <div>
                <NumberInput
                    value={maxRuns}
                    onChange={(e) => setMaxRuns(safeParseInt(e.target.value, 0))}
                    name="maxRuns"
                    min={0}
                    max={MAX_RUNS}
                />
                <label htmlFor="maxRuns">max runs (0 for no limit)</label>
            </div>
            <div>
                <NumberInput
                    value={maxInnings}
                    onChange={(e) => setMaxInnings(safeParseInt(e.target.value, 1))}
                    name="maxInnings"
                    min={1}
                    max={MAX_INNINGS}
                />
                <label htmlFor="maxInnings">max innings</label>
            </div>
            <div>
                <NumberInput
                    value={maxFielders}
                    onChange={(e) => setMaxFielders(safeParseInt(e.target.value, 1))}
                    name="maxFielders"
                    min={1}
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
                    onChange={() => void setAllowExtras(!allowExtras)}
                />
                <label htmlFor="allowExtras">allow extra innings</label>
            </div>
            <div>
                <input
                    type="checkbox"
                    name="recordingStats"
                    value="recordingStats"
                    defaultChecked={recordingStats}
                    onChange={() => void setRecordingStats(!recordingStats)}
                />
                <label htmlFor="recordingStats">recording stats</label>
            </div>
        </fieldset>
    );
};

export default GameConfigControl;
