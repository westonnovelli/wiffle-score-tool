import {
    Bases,
    InningHalf,
    OptionalRules,
    EMPTY_BASES,
    getOffense,
    type GameMoment,
    type DeepPartial,
    type GameConfig,
} from "@wiffleball/state-machine";
import React from "react";
import Structure from "./Structure";
import './Manual.css';
// import { useNavigate } from "react-router-dom";

interface Props {
    game: GameMoment;
    handleEdit: (edit: DeepPartial<GameMoment>) => void;
}

const rulesThatDontMatch = (variant: GameConfig['rules'], control: GameConfig['rules']) => {
    return Object.keys(OptionalRules).filter((key) => 
        // @ts-expect-error
        variant[key] !== control[key]
    );
}

const Manual: React.FC<Props> = ({ game, handleEdit }) => {
    const awayBatter = game.inning.half === InningHalf.TOP ? game.atBat : game.nextHalfAtBat;
    const homeBatter = game.inning.half === InningHalf.BOTTOM ? game.atBat : game.nextHalfAtBat;
        
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
        const edit: DeepPartial<GameMoment> = {};
        
        const inning: Partial<GameMoment['inning']> = {};
        if (inningNumber !== game.inning.number) {
            inning.number = inningNumber;
        }
        if (inningHalf !== game.inning.half) {
            inning.half = inningHalf;
            edit.nextHalfAtBat = game.atBat;
            edit.atBat = game.nextHalfAtBat;
        }
        if (Object.keys(inning).length > 0) {
            edit.inning = inning;
            edit.bases = EMPTY_BASES;
        }

        if (outs !== game.outs) {
            edit.outs = outs;
        }

        const count: Partial<GameMoment['count']> = {};
        if (balls !== game.count.balls) {
            count.balls = balls;
        }
        if (strikes !== game.count.strikes) {
            count.strikes = strikes;
        }
        if (Object.keys(count).length > 0) {
            edit.count = count;
        }

        const bases: Partial<GameMoment['bases']> = {};
        if (firstBase !== game.bases[Bases.FIRST]) {
            bases[Bases.FIRST] = firstBase;
        }
        if (secondBase !== game.bases[Bases.SECOND]) {
            bases[Bases.SECOND] = secondBase;
        }
        if (thirdBase !== game.bases[Bases.THIRD]) {
            bases[Bases.THIRD] = thirdBase;
        }
        if (Object.keys(bases).length > 0) {
            edit.bases = bases;
        }

        if (atBat !== game.atBat) {
            edit.atBat = atBat;
        }

        const config: DeepPartial<GameConfig> = {};
        if (maxStrikes !== game.configuration.maxStrikes) {
            config.maxStrikes = maxStrikes;
        }
        if (maxBalls !== game.configuration.maxBalls) {
            config.maxBalls = maxBalls;
        }
        if (maxOuts !== game.configuration.maxOuts) {
            config.maxOuts = maxOuts;
        }
        if (maxRuns !== game.configuration.maxRuns) {
            config.maxRuns = maxRuns;
        }
        if (maxInnings !== game.configuration.maxInnings) {
            config.maxInnings = maxInnings;
        }
        if (maxFielders !== game.configuration.maxFielders) {
            config.maxFielders = maxFielders;
        }
        if (allowExtras !== game.configuration.allowExtras) {
            config.allowExtras = allowExtras;
        }
        if (recordingStats !== game.configuration.recordingStats) {
            config.recordingStats = recordingStats;
        }
        rulesThatDontMatch(rules, game.configuration.rules).forEach((ruleKey) => {
            // @ts-expect-error
            config.rules[ruleKey] = rules[ruleKey];
        });
        if (Object.keys(config).length > 0) {
            edit.configuration = config;
        }
        
        console.log(edit);
        handleEdit(edit);
    };

    const wouldBeBatters = inningHalf === InningHalf.TOP ? game.awayTeam : game.homeTeam;
    React.useEffect(function presetCorrectNextBatter() {
        if (inningHalf === InningHalf.TOP) {
            setAtBat(awayBatter);
        } else {
            setAtBat(homeBatter);
        }
    }, [inningHalf, awayBatter, homeBatter]);

    // TODO extend box score if innings are added

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
                    onChange={(e) => setInningNumber(parseInt(e.target.value))}
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
                    onChange={(e) => void setBalls(parseInt(e.target.value))}
                    max={game.configuration.maxBalls - 1}
                    min={0}
                />
                <label htmlFor="countStrikes">Strikes</label>
                <input
                    type="number"
                    name="countStrikes"
                    value={strikes}
                    onChange={(e) => void setStrikes(parseInt(e.target.value))}
                    max={game.configuration.maxStrikes - 1}
                    min={0}
                />
                <label htmlFor="outs">Outs</label>
                <input
                    type="number"
                    name="outs"
                    value={outs}
                    onChange={(e) => void setOuts(parseInt(e.target.value))}
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
                        value="firstbase"
                        defaultChecked={firstBase === 1}
                        onChange={() => void setFirstBase(prev => prev === 1 ? 0 : 1)}
                    />
                    <label htmlFor="firstbase">1st</label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        name="secondbase"
                        value="secondbase"
                        defaultChecked={secondBase === 1}
                        onChange={() => void setSecondBase(prev => prev === 1 ? 0 : 1)}
                    />
                    <label htmlFor="secondbase">2nd</label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        name="thirdbase"
                        value="thirdbase"
                        defaultChecked={thirdBase === 1}
                        onChange={() => void setThirdBase(prev => prev === 1 ? 0 : 1)}
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
                    {wouldBeBatters.lineup.map((id) => (
                        <option key={id} value={id}>
                            {wouldBeBatters.roster[id].name}
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
                        onChange={(e) => setMaxStrikes(parseInt(e.target.value))}
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
                        onChange={(e) => setMaxBalls(parseInt(e.target.value))}
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
                        onChange={(e) => setMaxOuts(parseInt(e.target.value))}
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
                        onChange={(e) => setMaxRuns(parseInt(e.target.value))}
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
                        onChange={(e) => setMaxInnings(parseInt(e.target.value))}
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
                        onChange={(e) => setMaxFielders(parseInt(e.target.value))}
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
