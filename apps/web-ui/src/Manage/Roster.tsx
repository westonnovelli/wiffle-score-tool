import { DeepPartial, Team, Position, defaultPlayer, BattingOrder, serializeTeam, newTeam } from "@wiffleball/state-machine";
import React from "react";
import { nanoid } from 'nanoid';
import Structure from "../components/Structure";
import TeamBuilder from "../components/TeamBuilder";
import './Roster.css';
import PageHeader from "../components/PageHeader";
import { TEAMS, TEAM_PREFIX } from "../localStorage";
import { useLocalStorage } from "usehooks-ts";
import { Link } from "react-router-dom";

interface Props {
    whichTeam: 'home' | 'away';
    teamName: string;
    team: Team;
    handleEdit?: (edit: DeepPartial<Team>) => void;
}

type Names = Record<string, string>;
type Positions = Record<string, Position>;
type Lineup = string[];

const getNames = (team: Team) => {
    return Object.keys(team.roster).reduce<Names>((acc, id) => {
        acc[id] = team.roster[id].name;
        return acc;
    }, {});
};

const getPositions = (team: Team) => {
    return Object.keys(team.roster).reduce<Positions>((acc, id) => {
        acc[id] = team.defense[id];
        return acc;
    }, {});
};

const changedNames = (potential: Names, team: Team) => {
    return Object.keys(potential).reduce<Names>((acc, id) => {
        const player = team.roster[id];
        if (player && player.name !== potential[id]) {
            acc[id] = potential[id];
        }
        return acc;
    }, {});
};

const lineupChanged = (potential: BattingOrder, team: Team): boolean => {
    return potential.some((id, index) => team.lineup[index] !== id);
};

const isValidRoster = (names: Names, positions: Positions, lineup: Lineup): [boolean, string] => {
    if (Object.values(names).some((name) => name === '')) return [false, 'all players need a name'];
    if (Object.values(positions).filter((position) => position === Position.Pitcher).length !== 1) return [false, 'team needs exactly 1 pitcher'];
    if (lineup.length < 1) return [false, 'team needs at least 1 batter'];
    return [true, ''];
};

const Roster: React.FC<Props> = ({ whichTeam, teamName, team, handleEdit }) => {
    const [lineup, setLineup] = React.useState<Lineup>(team.lineup);
    const [names, setNames] = React.useState<Names>(getNames(team));
    const [positions, setPositions] = React.useState<Positions>(getPositions(team));

    const [saves, setSaves] = useLocalStorage<string[]>(TEAMS, []);
    const isSaved = React.useMemo(() => {
        return saves?.includes(team.id);
    }, [saves, team.id]);
    const [plsSave, setPlsSave] = React.useState(isSaved);

    const editing = Boolean(handleEdit);

    const onUpdate = () => {
        if (!handleEdit) return;

        const edit: DeepPartial<Team> = {};

        if (lineupChanged(lineup, team)) {
            edit.lineup = lineup;
        }

        Object.keys(positions).forEach((id) => {
            if (team.defense[id] === undefined || team.defense[id] !== positions[id]) {
                if (!edit.defense) edit.defense = {};
                edit.defense[id] = positions[id];
            }
        });

        const nameChanges = changedNames(names, team);
        if (Object.keys(nameChanges).length > 0) {
            edit.roster = {};
            Object.keys(nameChanges).forEach((id) => {
                if (edit.roster) {
                    edit.roster[id] = { name: nameChanges[id] };
                }
            });
        }

        // if we added a player (id with "temp" in it) we need to create a player object in the roster
        lineup.forEach((id) => {
            if (id.includes('temp')) {
                const player = defaultPlayer(names[id], nanoid(8));
                if (!edit.roster) edit.roster = {};
                edit.roster[player.id] = player;

                if (!edit.defense) edit.defense = {};
                edit.defense[player.id] = edit.defense[id];
                delete edit.defense[id];

                if (!edit.lineup) edit.lineup = [];
                edit.lineup = edit.lineup.map((idAgain) => {
                    if (idAgain === id) return player.id;
                    return idAgain;
                });
            }
        });

        handleEdit(edit);
        if (plsSave) {
            const wouldBeTeam = newTeam(lineup.map((id) => ({
                id,
                name: names[id],
                position: positions[id],
            })), team.id, team.name);
            if (wouldBeTeam) {
                setSaves([...saves, team.id]);
                localStorage.setItem(`${TEAM_PREFIX}${team.id}`, serializeTeam(wouldBeTeam));
            }
        }
    };

    const [isValidTeam, errorMessage] = React.useMemo(() => {
        return isValidRoster(names, positions, lineup);
    }, [names, positions, lineup]);

    return (
        <Structure className={`manage-roster ${whichTeam}`} wftitle={<PageHeader title={teamName} />}>
            {['home', 'away'].includes(team.name) && <h2>{team.name}</h2>}
            <TeamBuilder
                team={team}
                names={names}
                setNames={setNames}
                positions={positions}
                setPositions={setPositions}
                lineup={lineup}
                setLineup={setLineup}
                editing
            />
            <div className="actions">
                {isSaved
                    ? <label className="already-saved">Team already on device, see in <Link to="/team-manager">Team Manager</Link></label>
                    : <label className="save-check"><input type="checkbox" className="save-btn" disabled={isSaved} onChange={(e) => {
                        setPlsSave(e.target.checked);
                    }} />Keep team on this device</label>
                }
                {editing && <button onClick={onUpdate} disabled={!isValidTeam} className="update-btn">Update team</button>}
                {!isValidTeam && <div className="validation">{errorMessage}</div>}
            </div>
        </Structure>
    );
};

export default Roster;
