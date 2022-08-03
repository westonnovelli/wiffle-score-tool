import { DeepPartial, Team, Position, defaultPlayer, BattingOrder } from "@wiffleball/state-machine";
import React from "react";
import { nanoid } from 'nanoid';
import Structure from "../components/Structure";
import TeamBuilder from "../components/TeamBuilder";
import './Roster.css';
import PageHeader from "../components/PageHeader";

interface Props {
    whichTeam: 'home' | 'away';
    teamName: string;
    team: Team;
    handleEdit?: (edit: DeepPartial<Team>) => void;
}

const getNames = (team: Team) => {
    return Object.keys(team.roster).reduce<Record<string, string>>((acc, id) => {
        acc[id] = team.roster[id].name;
        return acc;
    }, {});
};

const getPositions = (team: Team) => {
    return Object.keys(team.roster).reduce<Record<string, Position>>((acc, id) => {
        acc[id] = team.defense[id];
        return acc;
    }, {});
};

const changedNames = (potential: Record<string, string>, team: Team) => {
    return Object.keys(potential).reduce<Record<string, string>>((acc, id) => {
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

const Roster: React.FC<Props> = ({ whichTeam, teamName, team, handleEdit }) => {
    const [lineup, setLineup] = React.useState<string[]>(team.lineup);
    const [names, setNames] = React.useState<Record<string, string>>(getNames(team));
    const [positions, setPositions] = React.useState<Record<string, Position>>(getPositions(team));

    const editing = Boolean(handleEdit);

    const onSave = () => {
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
    };

    return (
        <Structure className={`manage-roster ${whichTeam}`} wftitle={<PageHeader title={teamName}/>}>
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
            {editing && <button onClick={onSave}>Save changes</button>}
        </Structure>
    );
};

export default Roster;
