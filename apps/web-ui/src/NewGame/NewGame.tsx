import { defaultConfiguration, defaultPlayer, defaultRules, GameConfig, Position, Team } from "@wiffleball/state-machine";
import React from "react";
import { nanoid } from 'nanoid';
import { useReadLocalStorage } from 'usehooks-ts';
import GameConfigControl from "../components/GameConfigControl";
import RulesControl from "../components/RulesControl";
import TeamBuilder from '../components/TeamBuilder';
import './NewGame.css';
import { SwapVert } from "../icons";
import PageHeader from "../components/PageHeader";
import TeamSelect from "./TeamSelect";
import { TEAMS } from "../localStorage";

const roster2Names = (roster: Team['roster']): Record<string, string> => {
    return Object.values(roster).reduce<Record<string, string>>((acc, player) => {
        acc[player.id] = player.name;
        return acc;
    }, {});
};

const stubTeam = (): Team => ({
    id: nanoid(4),
    name: '',
    roster: {},
    startingLineup: [],
    startingDefense: {},
    lineup: [],
    defense: {},
});

interface Props {
    handleStart: (
        config: GameConfig,
        homeTeam: Team,
        awayTeam: Team
    ) => void;
}

const NewGame: React.FC<Props> = ({ handleStart }) => {
    const [rules, setRules] = React.useState(defaultRules());

    const localTeamList = useReadLocalStorage<string[]>(TEAMS);
    const hasSavedTeams = (localTeamList?.length ?? 0) > 0;

    const defaultConfig = defaultConfiguration();
    const [maxStrikes, setMaxStrikes] = React.useState(defaultConfig.maxStrikes);
    const [maxBalls, setMaxBalls] = React.useState(defaultConfig.maxBalls);
    const [maxOuts, setMaxOuts] = React.useState(defaultConfig.maxOuts);
    const [maxRuns, setMaxRuns] = React.useState(defaultConfig.maxRuns);
    const [maxInnings, setMaxInnings] = React.useState(defaultConfig.maxInnings);
    const [maxFielders, setMaxFielders] = React.useState(defaultConfig.maxFielders);
    const [allowExtras, setAllowExtras] = React.useState(defaultConfig.allowExtras);
    const [recordingStats, setRecordingStats] = React.useState(defaultConfig.recordingStats);

    const [homeTeamId, setHomeTeamId] = React.useState<string | undefined>(undefined);
    const [homeTeamName, setHomeTeamName] = React.useState('Home');
    const [homeTeamLineup, setHomeTeamLineup] = React.useState<string[]>([]);
    const [homeNames, setHomeNames] = React.useState<Record<string, string>>({});
    const [homePositions, setHomePositions] = React.useState<Record<string, Position>>({});
    const [namingHomeTeam, setNamingHomeTeam] = React.useState(false);

    const [awayTeamId, setAwayTeamId] = React.useState<string | undefined>(undefined);
    const [awayTeamName, setAwayTeamName] = React.useState('Away');
    const [awayTeamLineup, setAwayTeamLineup] = React.useState<string[]>([]);
    const [awayNames, setAwayNames] = React.useState<Record<string, string>>({});
    const [awayPositions, setAwayPositions] = React.useState<Record<string, Position>>({});
    const [namingAwayTeam, setNamingAwayTeam] = React.useState(false);

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

        const homeTeam: Team = stubTeam();
        if (homeTeamId) {
            homeTeam.id = homeTeamId;
        }
        homeTeam.name = homeTeamName;
        homeTeamLineup.forEach((id) => {
            const name = homeNames[id];
            const position = homePositions[id];
            const player = defaultPlayer(name, homeTeamId ? id : nanoid(4));
            homeTeam.roster[player.id] = player;
            homeTeam.startingLineup = [...homeTeam.startingLineup, player.id];
            homeTeam.startingDefense[player.id] = position;
        });

        const awayTeam: Team = stubTeam();
        if (awayTeamId) {
            awayTeam.id = awayTeamId;
        }
        awayTeam.name = awayTeamName;
        awayTeamLineup.forEach((id) => {
            const name = awayNames[id];
            const position = awayPositions[id];
            const player = defaultPlayer(name, awayTeamId ? id : nanoid(4));
            awayTeam.roster[player.id] = player;
            awayTeam.startingLineup = [...awayTeam.startingLineup, player.id];
            awayTeam.startingDefense[player.id] = position;
        });

        homeTeam.lineup = [...homeTeam?.startingLineup];
        homeTeam.defense = {...homeTeam?.startingDefense};
        awayTeam.lineup = [...awayTeam?.startingLineup];
        awayTeam.defense = {...awayTeam?.startingDefense};

        handleStart(config, homeTeam, awayTeam);
    };

    const swapTeams = () => {
        const tempLineup = [...homeTeamLineup];
        const tempNames = { ...homeNames };
        const tempPositions = { ...homePositions };
        const tempTeamId = homeTeamId;
        const tempTeamName = homeTeamName;
        const tempNaming = namingHomeTeam;

        setHomeTeamLineup([...awayTeamLineup]);
        setHomeNames({ ...awayNames });
        setHomePositions({ ...awayPositions });
        setHomeTeamId(awayTeamId);
        setHomeTeamName(awayTeamName);
        setNamingHomeTeam(namingAwayTeam);

        setAwayTeamLineup(tempLineup);
        setAwayNames(tempNames);
        setAwayPositions(tempPositions);
        setAwayTeamId(tempTeamId);
        setAwayTeamName(tempTeamName);
        setNamingAwayTeam(tempNaming);
    };

    const [isSelectingTeam, setIsSelectingTeam] = React.useState<'home' | 'away' | ''>('');
    const onSelectTeam = (team: Team) => {
        if (isSelectingTeam === 'home') {
            setHomeTeamId(team.id);
            setHomeTeamName(team.name);
            setHomeTeamLineup([...team.startingLineup]);
            setHomeNames(roster2Names(team.roster));
            setHomePositions({ ...team.startingDefense });
            setNamingHomeTeam(true);
        }
        else if (isSelectingTeam === 'away') {
            setAwayTeamId(team.id);
            setAwayTeamName(team.name);
            setAwayTeamLineup([...team.startingLineup]);
            setAwayNames(roster2Names(team.roster));
            setAwayPositions({ ...team.startingDefense });
            setNamingAwayTeam(true);
        }
        setIsSelectingTeam('');
    };

    return (
        <div className="newgame">
            <PageHeader title={"New Game"} />
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
            {isSelectingTeam && (
                <TeamSelect
                    whichTeam={isSelectingTeam}
                    onDismiss={() => setIsSelectingTeam('')}
                    onSelect={onSelectTeam}
                />
            )}
            <div className="team-header">
                <h3>Home team</h3>
                {namingHomeTeam
                    ? <input className="team-name home" value={homeTeamName} onChange={(e) => void setHomeTeamName(e.target.value)}/>
                    : <button className="team-name-btn" onClick={() => void setNamingHomeTeam(true)}>add name</button>
                }
            </div>
            {hasSavedTeams && <button onClick={() => { setIsSelectingTeam('home') }}>Select a saved team</button>}
            <TeamBuilder
                lineup={homeTeamLineup}
                setLineup={setHomeTeamLineup}
                names={homeNames}
                setNames={setHomeNames}
                positions={homePositions}
                setPositions={setHomePositions}
                editing
            />
            <button className="swap-teams" onClick={swapTeams}><SwapVert />Swap home/away</button>
            <div className="team-header">
                <h3>Away team</h3>
                {namingAwayTeam
                    ? <input className="team-name away" value={awayTeamName} onChange={(e) => void setAwayTeamName(e.target.value)}/>
                    : <button className="team-name-btn" onClick={() => void setNamingAwayTeam(true)}>add name</button>
                }
            </div>
            {hasSavedTeams && <button onClick={() => { setIsSelectingTeam('away') }}>Select a saved team</button>}
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
