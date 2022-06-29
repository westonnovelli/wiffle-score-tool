import { defaultConfiguration, defaultPlayer, defaultRules, GameConfig, Position, Team } from "@wiffleball/state-machine";
import React from "react";
import GameConfigControl from "../components/GameConfigControl";
import RulesControl from "../components/RulesControl";
import './NewGame.css';

const allPositions = [
    { label: 'Pitcher', value: Position.Pitcher },
    { label: 'Infield', value: Position.Infield },
    { label: 'Outfield', value: Position.Outfield },
    { label: 'Bench', value: Position.Bench },
];

interface PositionSelectProps {
    position: Position;
    setPosition: React.Dispatch<React.SetStateAction<Position>>;
}

const PositionSelect: React.FC<PositionSelectProps> = ({ position, setPosition }) => {
    return (
        <select value={position} onChange={(e) => setPosition(parseInt(e.target.value))}>
            {allPositions.map(({ label, value }) => {
                return (
                    <option key={value} value={value}>{label}</option>
                );
            })}
        </select>
    );
};

type Lineup = {
    name: string;
    position: Position;
}[];

interface TeamBuilderProps {
    label: string;
    lineup: Lineup;
    setLineup: React.Dispatch<React.SetStateAction<Lineup>>;
}

const TeamBuilder: React.FC<TeamBuilderProps> = ({ label, lineup, setLineup }) => {
    const [pendingName, setPendingName] = React.useState('');
    const [pendingPosition, setPendingPosition] = React.useState<Position>(Position.Infield);
    const addPlayer = () => {
        setLineup(prev => [...prev, { name: pendingName, position: pendingPosition }]);
        setPendingName('');
        setPendingPosition(Position.Infield);
    };
    const disabled =
        pendingName === ''
        || (
            lineup.some(({ position }) => position === Position.Pitcher)
            && pendingPosition === Position.Pitcher
        );

    const move = (index: number, amt: number) => {
        if (index === 0 && amt < 0) return;
        if (index === lineup.length - 1 && amt > 0) return;
        if (amt === 0 || amt > 1 || amt < -1) return;
        if (index > lineup.length - 1 || index < 0) return;

        const atIndex = lineup[index];
        setLineup(prev => {
            const next = [...prev];
            next[index] = next[index + amt];
            next[index + amt] = atIndex;
            return next;
        });
    };

    const remove = (index: number) => {
        setLineup(prev => {
            return [...prev.slice(0, index), ...prev.slice(index + 1)];
        });
    };

    return (
        <div className="teambuilder">
            <h2>{label}</h2>
            {lineup.map(({ name, position }, i) => (
                <div key={`${name}-${i}`} className={`player ${label === 'Home team' ? 'home' : 'away'}`}>
                    <button className="moveup" onClick={() => move(i, -1)} disabled={i === 0}>▲</button>
                    <div className="name">{name}</div>
                    <div className="position">{allPositions.find(({ value }) => value === position)?.label}</div>
                    <button className="movedown" onClick={() => move(i, 1)} disabled={i === lineup.length - 1}>▼</button>
                    <button className="remove" onClick={() => remove(i)}>X</button>
                </div>
            ))}
            <input type="text" value={pendingName} onChange={(e) => void setPendingName(e.target.value)} />
            <PositionSelect position={pendingPosition} setPosition={setPendingPosition} />
            <button onClick={addPlayer} disabled={disabled}>Add</button>
            {disabled && <div>players need a name and there can only be 1 pitcher</div>}
        </div>
    );
}

interface Props {
    handleStart: (
        config: GameConfig,
        homeTeam: Team,
        awayTeam: Team
    ) => void;
}

const NewGame: React.FC<Props> = ({ handleStart }) => {
    const [rules, setRules] = React.useState(defaultRules());

    const defaultConfig = defaultConfiguration();
    const [maxStrikes, setMaxStrikes] = React.useState(defaultConfig.maxStrikes);
    const [maxBalls, setMaxBalls] = React.useState(defaultConfig.maxBalls);
    const [maxOuts, setMaxOuts] = React.useState(defaultConfig.maxOuts);
    const [maxRuns, setMaxRuns] = React.useState(defaultConfig.maxRuns);
    const [maxInnings, setMaxInnings] = React.useState(defaultConfig.maxInnings);
    const [maxFielders, setMaxFielders] = React.useState(defaultConfig.maxFielders);
    const [allowExtras, setAllowExtras] = React.useState(defaultConfig.allowExtras);
    const [recordingStats, setRecordingStats] = React.useState(defaultConfig.recordingStats);

    const [homeTeamLineup, setHomeTeamLineup] = React.useState<{ name: string, position: Position }[]>([]);
    const [awayTeamLineup, setAwayTeamLineup] = React.useState<{ name: string, position: Position }[]>([]);

    const prepStart = () => {
        const config: GameConfig = {
            maxBalls,
            maxStrikes,
            maxOuts,
            maxRuns,
            maxInnings,
            maxFielders,
            allowExtras,
            recordingStats,
            rules,
        };

        const homeTeam: Team = {
            roster: {},
            lineup: [],
            defense: {}
        };
        homeTeamLineup.forEach(({name, position}) => {
            const player = defaultPlayer(name);
            homeTeam.roster[player.id] = player;
            homeTeam.lineup = [...homeTeam.lineup, player.id];
            homeTeam.defense[player.id] = position;
        });

        const awayTeam: Team = {
            roster: {},
            lineup: [],
            defense: {}
        };
        awayTeamLineup.forEach(({name, position}) => {
            const player = defaultPlayer(name);
            awayTeam.roster[player.id] = player;
            awayTeam.lineup = [...awayTeam.lineup, player.id];
            awayTeam.defense[player.id] = position;
        });

        handleStart(config, homeTeam, awayTeam);
    };

    return (
        <div className="newgame">
            <h1>New Game</h1>
            <RulesControl rules={rules} setRules={setRules} />
            <GameConfigControl
                maxBalls={maxBalls}
                setMaxBalls={setMaxBalls}
                maxStrikes={maxStrikes}
                setMaxStrikes={setMaxStrikes}
                maxOuts={maxOuts}
                setMaxOuts={setMaxOuts}
                maxRuns={maxRuns}
                setMaxRuns={setMaxRuns}
                maxFielders={maxFielders}
                setMaxFielders={setMaxFielders}
                maxInnings={maxInnings}
                setMaxInnings={setMaxInnings}
                allowExtras={allowExtras}
                setAllowExtras={setAllowExtras}
                recordingStats={recordingStats}
                setRecordingStats={setRecordingStats}
            />
            <TeamBuilder label="Home team" lineup={homeTeamLineup} setLineup={setHomeTeamLineup} />
            <TeamBuilder label="Away team" lineup={awayTeamLineup} setLineup={setAwayTeamLineup} />
            <button className="start" onClick={prepStart}>Start game</button>
        </div>
    );
};

export default NewGame;
