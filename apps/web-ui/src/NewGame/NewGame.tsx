import { defaultConfiguration, defaultPlayer, defaultRules, GameConfig, Position, Team } from "@wiffleball/state-machine";
import React from "react";
import { nanoid } from 'nanoid';
import GameConfigControl from "../components/GameConfigControl";
import RulesControl from "../components/RulesControl";
import TeamBuilder from '../components/TeamBuilder';
import './NewGame.css';
import { SwapVert } from "../icons";
import PageHeader from "../components/PageHeader";
import { Link } from "react-router-dom";

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
        && Object.values(homePositions).filter(p => p === Position.Pitcher).length === 1
        && Object.values(awayPositions).filter(p => p === Position.Pitcher).length === 1
        && maxStrikes >= 1 && maxBalls >= 0 && maxOuts >= 0 && maxInnings >= 1;

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
            id: nanoid(4),
            name: 'home',
            roster: {},
            lineup: [],
            startingLineup: [],
            defense: {},
            startingDefense: {},
        };
        homeTeamLineup.forEach((id) => {
            const name = homeNames[id];
            const position = homePositions[id];
            const player = defaultPlayer(name, nanoid(4));
            homeTeam.roster[player.id] = player;
            homeTeam.lineup = [...homeTeam.lineup, player.id];
            homeTeam.startingLineup = [...homeTeam.startingLineup, player.id];
            homeTeam.defense[player.id] = position;
            homeTeam.startingDefense[player.id] = position;
        });

        const awayTeam: Team = {
            id: nanoid(4),
            name: 'away',
            roster: {},
            lineup: [],
            startingLineup: [],
            defense: {},
            startingDefense: {},
        };
        awayTeamLineup.forEach((id) => {
            const name = awayNames[id];
            const position = awayPositions[id];
            const player = defaultPlayer(name, nanoid(4));
            awayTeam.roster[player.id] = player;
            awayTeam.lineup = [...awayTeam.lineup, player.id];
            awayTeam.startingLineup = [...awayTeam.startingLineup, player.id];
            awayTeam.defense[player.id] = position;
            awayTeam.startingDefense[player.id] = position;
        });

        handleStart(config, homeTeam, awayTeam);
    };

    const swapTeams = () => {
        const tempLineup = [...homeTeamLineup];
        const tempNames = {...homeNames};
        const tempPositions = {...homePositions};

        setHomeTeamLineup([...awayTeamLineup]);
        setHomeNames({...awayNames});
        setHomePositions({...awayPositions});

        setAwayTeamLineup(tempLineup);
        setAwayNames(tempNames);
        setAwayPositions(tempPositions);
    };

    return (
        <div className="newgame">
            <PageHeader title={"New Game"}/>
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
            <h2>Teams</h2>
            {/* <Link to="../teams">Use teams from device</Link> */}
            <h3>Home team</h3>
            <TeamBuilder
                lineup={homeTeamLineup}
                setLineup={setHomeTeamLineup}
                names={homeNames}
                setNames={setHomeNames}
                positions={homePositions}
                setPositions={setHomePositions}
                editing
            />
            <button className="swap-teams" onClick={swapTeams}><SwapVert/>Swap home/away</button>
            <h3>Away team</h3>
            <TeamBuilder
                lineup={awayTeamLineup}
                setLineup={setAwayTeamLineup}
                names={awayNames}
                setNames={setAwayNames}
                positions={awayPositions}
                setPositions={setAwayPositions}
                editing
            />
            {!isValid && <div className="validation">both teams need exactly 1 pitcher</div>}
            <button className="start" onClick={prepStart} disabled={!isValid}>Start game</button>
        </div>
    );
};

export default NewGame;
