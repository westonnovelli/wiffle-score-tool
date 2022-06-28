import { Bases, GameMoment, InningHalf, getOffense, OptionalRules } from "@wiffleball/state-machine";
import React from "react";
import Structure from "./Structure";
import './Manual.css';
// import { useNavigate } from "react-router-dom";

interface Props {
    game: GameMoment;
}

// TODO manual edit
const Manual: React.FC<Props> = ({ game }) => {
    const [inningNumber, setInningNumber] = React.useState(game.inning.number);
    const [inningHalf, setInningHalf] = React.useState<InningHalf>(game.inning.half);

    const [outs, setOuts] = React.useState(game.outs);

    const [balls, setBalls] = React.useState(game.count.balls);
    const [strikes, setStrikes] = React.useState(game.count.strikes);

    const [firstBase, setFirstBase] = React.useState(game.bases[Bases.FIRST]);
    const [secondBase, setSecondBase] = React.useState(game.bases[Bases.SECOND]);
    const [thirdBase, setThirdBase] = React.useState(game.bases[Bases.THIRD]);

    const [atBat, setAtBat] = React.useState(game.atBat);

    const [rules, setRules] = React.useState(game.configuration.rules);

    const [maxStrikes, setMaxStrikes] = React.useState(game.configuration.maxStrikes);
    const [maxBalls, setMaxBalls] = React.useState(game.configuration.maxBalls);
    const [maxOuts, setMaxOuts] = React.useState(game.configuration.maxOuts);
    const [maxRuns, setMaxRuns] = React.useState(game.configuration.maxRuns);
    const [maxInnings, setMaxInnings] = React.useState(game.configuration.maxInnings);
    const [maxFielders, setMaxFielders] = React.useState(game.configuration.maxFielders);
    const [allowExtras, setAllowExtras] = React.useState(game.configuration.allowExtras);
    const [recordingStats, setRecordingStats] = React.useState(game.configuration.recordingStats);

    const submitEdit = () => {
        // TODO handle edit submission
        // diff/dirty
        // callback to manualEdit()
        console.log('manual edit submission not implemented');
    };

    return (
        <Structure
            className="manage manual"
            title={<h1>Manual edit</h1>}
        >
            <fieldset className="inning">
                <legend>Inning</legend>
                <input
                    type="number"
                    name="inningNumber"
                    value={inningNumber}
                    onChange={(e) => setInningNumber(e.target.valueAsNumber)}
                    min={1}
                    max={20} // arbitrary but so be it
                />
                <div>
                    <input
                        type="radio"
                        name="inningTop"
                        value="top"
                        checked={inningHalf === InningHalf.TOP}
                        onChange={() => void setInningHalf(InningHalf.TOP)}
                    />
                    <label htmlFor="inningTop">Top</label>
                </div>
                <div>
                    <input
                        type="radio"
                        name="inningBottom"
                        value="bottom"
                        checked={inningHalf === InningHalf.BOTTOM}
                        onChange={() => void setInningHalf(InningHalf.BOTTOM)}
                    />
                    <label htmlFor="inningBottom">Bottom</label>
                </div>
            </fieldset>
            {/* <div>score</div> input type=number in each cell (only allow current/past innings) */}
            <fieldset className="count">
                <legend>Count</legend>
                <label htmlFor="countBalls">Balls</label>
                <input
                    type="number"
                    name="countBalls"
                    value={balls}
                    onChange={(e) => void setBalls(e.target.valueAsNumber)}
                    max={game.configuration.maxBalls - 1}
                    min={0}
                />
                <label htmlFor="countStrikes">Strikes</label>
                <input
                    type="number"
                    name="countStrikes"
                    value={strikes}
                    onChange={(e) => void setStrikes(e.target.valueAsNumber)}
                    max={game.configuration.maxStrikes - 1}
                    min={0}
                />
                <label htmlFor="outs">Outs</label>
                <input
                    type="number"
                    name="outs"
                    value={outs}
                    onChange={(e) => void setOuts(e.target.valueAsNumber)}
                    max={game.configuration.maxOuts - 1}
                    min={0}
                />
            </fieldset>
            <fieldset className="bases">
                <legend>Runners on base</legend>
                <div>
                    <input
                        type="checkbox"
                        name="firstbase"
                        value={1}
                        defaultChecked={firstBase === 1}
                        onChange={(e) => void setFirstBase(e.target.valueAsNumber)}
                    />
                    <label htmlFor="firstbase">1st</label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        name="secondbase"
                        value={1}
                        defaultChecked={secondBase === 1}
                        onChange={(e) => void setSecondBase(e.target.valueAsNumber)}
                    />
                    <label htmlFor="secondbase">2nd</label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        name="thirdbase"
                        value={1}
                        defaultChecked={thirdBase === 1}
                        onChange={(e) => void setThirdBase(e.target.valueAsNumber)}
                    />
                    <label htmlFor="thirdbase">3rd</label>
                </div>
            </fieldset>
            <div className="atBat">
                <label htmlFor="atbat">At bat:</label>
                <select
                    value={atBat}
                    onChange={(e) => void setAtBat(e.target.value)}
                >
                    {getOffense(game).lineup.map((id) => (
                        <option key={id} value={id}>
                            {getOffense(game).roster[id].name}
                        </option>
                    ))}
                </select>
            </div>
            <fieldset className="config">
                <legend>Game Configuration</legend>
                <div>
                    <input
                        type="number"
                        value={maxStrikes}
                        onChange={(e) => setMaxStrikes(e.target.valueAsNumber)}
                        name="maxStrikes"
                        min={0}
                        max={10}
                    />
                    <label htmlFor="maxStrikes">max strikes</label>
                </div>
                <div>
                    <input
                        type="number"
                        value={maxBalls}
                        onChange={(e) => setMaxBalls(e.target.valueAsNumber)}
                        name="maxBalls"
                        min={0}
                        max={10}
                    />
                    <label htmlFor="maxBalls">max balls</label>
                </div>
                <div>
                    <input
                        type="number"
                        value={maxOuts}
                        onChange={(e) => setMaxOuts(e.target.valueAsNumber)}
                        name="maxOuts"
                        min={0}
                        max={10}
                    />
                    <label htmlFor="maxOuts">max outs</label>
                </div>
                <div>
                    <input
                        type="number"
                        value={maxRuns}
                        onChange={(e) => setMaxRuns(e.target.valueAsNumber)}
                        name="maxRuns"
                        min={-1}
                        max={100}
                    />
                    <label htmlFor="maxRuns">max runs</label>
                </div>
                <div>
                    <input
                        type="number"
                        value={maxInnings}
                        onChange={(e) => setMaxInnings(e.target.valueAsNumber)}
                        name="maxInnings"
                        min={0}
                        max={20}
                    />
                    <label htmlFor="maxInnings">max innings</label>
                </div>
                <div>
                    <input
                        type="number"
                        value={maxFielders}
                        onChange={(e) => setMaxFielders(e.target.valueAsNumber)}
                        name="maxFielders"
                        min={0}
                        max={100}
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
            <button onClick={submitEdit}>Submit changes</button>
        </Structure>
    );
};

export default Manual;
