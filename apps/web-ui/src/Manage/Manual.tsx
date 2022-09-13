import {
    Bases,
    InningHalf,
    OptionalRules,
    EMPTY_BASES,
    EMPTY_BOX,
    type GameMoment,
    type DeepPartial,
    type GameConfig,
} from "@wiffleball/state-machine";
import React from "react";
import Structure from "../components/Structure";
import PageHeader from "../components/PageHeader";
import './Manual.css';
import RulesControl from "../components/GameConfig/RulesControl";
import GameConfigControl from "../components/GameConfig/GameConfigControl";
import BoxScore from "../components/BoxScore";
import NumberInput from "../components/NumberInput";
import { safeParseInt } from "../helpers";
import configReducer from "../components/GameConfig/configReducer";
// import presets from "../presets/configPresets";
// import PresetSelector from "../components/GameConfig/PresetSelector";

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

const boxScoresDontMatch = (variant: GameMoment['boxScore'], control: GameMoment['boxScore']) => {
    return variant.length > control.length || control.some(({ homeTeam, awayTeam }, i) => variant[i]?.homeTeam !== homeTeam || variant[i]?.awayTeam !== awayTeam);
};

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

    const [{
        config: gameConfig
    }, dispatch] = React.useReducer(configReducer, {
        id: 'unknown',
        label: 'unknown',
        config: game.configuration,
    });

    const [boxScore, setBoxScore] = React.useState(game.boxScore);

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

        if (boxScoresDontMatch(boxScore, game.boxScore)) {
            edit.boxScore = boxScore;
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
        if (gameConfig.maxStrikes !== game.configuration.maxStrikes) {
            config.maxStrikes = gameConfig.maxStrikes;
        }
        if (gameConfig.maxBalls !== game.configuration.maxBalls) {
            config.maxBalls = gameConfig.maxBalls;
        }
        if (gameConfig.maxOuts !== game.configuration.maxOuts) {
            config.maxOuts = gameConfig.maxOuts;
        }
        if (gameConfig.maxRuns !== game.configuration.maxRuns) {
            config.maxRuns = gameConfig.maxRuns;
        }
        if (gameConfig.maxInnings !== game.configuration.maxInnings) {
            config.maxInnings = gameConfig.maxInnings;
        }
        if (gameConfig.maxFielders !== game.configuration.maxFielders) {
            config.maxFielders = gameConfig.maxFielders;
        }
        if (gameConfig.allowExtras !== game.configuration.allowExtras) {
            config.allowExtras = gameConfig.allowExtras;
        }
        if (gameConfig.recordingStats !== game.configuration.recordingStats) {
            config.recordingStats = gameConfig.recordingStats;
        }
        rulesThatDontMatch(gameConfig.rules, game.configuration.rules).forEach((ruleKey) => {
            if (!config.rules) config.rules = {};
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
            wftitle={<PageHeader title="Manual Edit" />}
        >
            <fieldset className="inning">
                <legend>Inning</legend>
                <NumberInput
                    name="inningNumber"
                    value={inningNumber}
                    onChange={(e) => {
                        const newInningNumber = safeParseInt(e.target.value, 1);
                        setInningNumber(newInningNumber);
                        if (newInningNumber > boxScore.length) {
                            const extrasToAdd = newInningNumber - boxScore.length;
                            setBoxScore(prev => {
                                return [...prev,
                                ...Array.from(Array(extrasToAdd)).map((_) => ({ ...EMPTY_BOX })),
                                ]
                            });
                        }
                        if (newInningNumber >= game.boxScore.length && newInningNumber <= boxScore.length) {
                            setBoxScore(prev => prev.slice(0, newInningNumber));
                        }
                    }}
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
            <div className="boxScoreContainer">
                <BoxScore
                    maxInnings={game.configuration.maxInnings}
                    inningNumber={inningNumber}
                    inningHalf={inningHalf}
                    boxScore={boxScore}
                    awayTeam={game.awayTeam}
                    homeTeam={game.homeTeam}
                    setBoxScore={setBoxScore}
                />
            </div>
            <fieldset className="count">
                <legend>Count</legend>
                <label htmlFor="countBalls">Balls</label>
                <NumberInput
                    name="countBalls"
                    value={balls}
                    onChange={(e) => void setBalls(safeParseInt(e.target.value))}
                    max={game.configuration.maxBalls - 1}
                    min={0}
                />
                <label htmlFor="countStrikes">Strikes</label>
                <NumberInput
                    name="countStrikes"
                    value={strikes}
                    onChange={(e) => void setStrikes(safeParseInt(e.target.value))}
                    max={game.configuration.maxStrikes - 1}
                    min={0}
                />
                <label htmlFor="outs">Outs</label>
                <NumberInput
                    name="outs"
                    value={outs}
                    onChange={(e) => void setOuts(safeParseInt(e.target.value))}
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
            {/* TODO detect available preset or show custom */}
            {/* <PresetSelector
                presets={presets}
                selected={presetId}
                onChange={(e) => void dispatch({ type: 'preset', payload: presets[e.target.value] })}
            /> */}
            <RulesControl rules={gameConfig.rules} setRules={(payload: GameConfig['rules']) => void dispatch({ type: 'rules', payload })} />
            <GameConfigControl
                maxBalls={gameConfig.maxBalls}
                setMaxBalls={(payload: number) => void dispatch({ type: 'maxBalls', payload })}
                maxStrikes={gameConfig.maxStrikes}
                setMaxStrikes={(payload: number) => void dispatch({ type: 'maxStrikes', payload })}
                maxOuts={gameConfig.maxOuts}
                setMaxOuts={(payload: number) => void dispatch({ type: 'maxOuts', payload })}
                maxRuns={gameConfig.maxRuns}
                setMaxRuns={(payload: number) => void dispatch({ type: 'maxRuns', payload })}
                maxFielders={gameConfig.maxFielders}
                setMaxFielders={(payload: number) => void dispatch({ type: 'maxFielders', payload })}
                maxInnings={gameConfig.maxInnings}
                setMaxInnings={(payload: number) => void dispatch({ type: 'maxInnings', payload })}
                allowExtras={gameConfig.allowExtras}
                setAllowExtras={(payload: boolean | undefined) => void dispatch({ type: 'allowExtras', payload })}
                recordingStats={gameConfig.recordingStats}
                setRecordingStats={(payload: boolean) => void dispatch({ type: 'recordingStats', payload })}
            />
            <button onClick={submitEdit} className="submit">Submit changes</button>
        </Structure>
    );
};

export default Manual;
