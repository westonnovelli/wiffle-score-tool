import { defaultConfiguration, defaultPlayer, defaultRules, GameConfig, Position, Team } from "@wiffleball/state-machine";
import React from "react";
import GameConfigControl from "../components/GameConfigControl";
import RulesControl from "../components/RulesControl";
import TeamBuilder from '../components/TeamBuilder';
import './NewGame.css';

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

    const [homeTeamLineup, setHomeTeamLineup] = React.useState<string[]>([]);
    const [homeNames, setHomeNames] = React.useState<Record<string, string>>({});
    const [homePositions, setHomePositions] = React.useState<Record<string, Position>>({});

    const [awayTeamLineup, setAwayTeamLineup] = React.useState<string[]>([]);
    const [awayNames, setAwayNames] = React.useState<Record<string, string>>({});
    const [awayPositions, setAwayPositions] = React.useState<Record<string, Position>>({});

    const isValid = 
           homeTeamLineup.length >= 1
        && awayTeamLineup.length >= 1
        && Object.values(homePositions).includes(Position.Pitcher)
        && Object.values(awayPositions).includes(Position.Pitcher)
        && maxStrikes >= 1 && maxBalls >= 0 && maxOuts >= 0 && maxInnings >= 1;

    console.log({homePositions, awayPositions});

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
            startingLineup: [],
            defense: {},
            startingDefense: {},
        };
        homeTeamLineup.forEach((id) => {
            const name = homeNames[id];
            const position = homePositions[id];
            const player = defaultPlayer(name);
            homeTeam.roster[player.id] = player;
            homeTeam.lineup = [...homeTeam.lineup, player.id];
            homeTeam.startingLineup = [...homeTeam.lineup, player.id];
            homeTeam.defense[player.id] = position;
            homeTeam.startingDefense[player.id] = position;
        });

        const awayTeam: Team = {
            roster: {},
            lineup: [],
            startingLineup: [],
            defense: {},
            startingDefense: {},
        };
        awayTeamLineup.forEach((id) => {
            const name = awayNames[id];
            const position = awayPositions[id];
            const player = defaultPlayer(name);
            awayTeam.roster[player.id] = player;
            awayTeam.lineup = [...awayTeam.lineup, player.id];
            awayTeam.startingLineup = [...awayTeam.lineup, player.id];
            awayTeam.defense[player.id] = position;
            awayTeam.startingDefense[player.id] = position;
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
            <h2>Home team</h2>
            <TeamBuilder
                lineup={homeTeamLineup}
                setLineup={setHomeTeamLineup}
                names={homeNames}
                setNames={setHomeNames}
                positions={homePositions}
                setPositions={setHomePositions}
                editing
            />
            <h2>Away team</h2>
            <TeamBuilder
                lineup={awayTeamLineup}
                setLineup={setAwayTeamLineup}
                names={awayNames}
                setNames={setAwayNames}
                positions={awayPositions}
                setPositions={setAwayPositions}
                editing
            />
            {!isValid && <div className="validation">both teams need at least 1 pitcher</div>}
            <button className="start" onClick={prepStart} disabled={!isValid}>Start game</button>
        </div>
    );
};

export default NewGame;
