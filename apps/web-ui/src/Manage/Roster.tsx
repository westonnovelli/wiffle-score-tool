import { DeepPartial, Team, Position } from "@wiffleball/state-machine";
import React from "react";
import Structure from "./Structure";
import TeamBuilder from "../components/TeamBuilder";
import './Roster.css';

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
        if (player?.name !== potential[id]) {
            acc[id] = potential[id];
        }
        return acc;
    }, {});
};

const Roster: React.FC<Props> = ({ whichTeam, teamName, team, handleEdit }) => {
    const [lineup, setLineup] = React.useState<string[]>(team.lineup);
    const [names, setNames] = React.useState<Record<string, string>>(getNames(team));
    const [positions, setPositions] = React.useState<Record<string, Position>>(getPositions(team));

    const editing = Boolean(handleEdit);

    const onSave = () => {
        if (!handleEdit) return;

        const edit: DeepPartial<Team> = {};

        const nameChanges = changedNames(names, team);
        if (Object.keys(nameChanges).length > 0) {
            edit.roster = {};
            Object.keys(nameChanges).forEach((id) => {
                if (edit.roster) {
                    edit.roster[id] = { name: nameChanges[id] };
                }
            });
        }

        handleEdit(edit);
    };

    return (
        <Structure className={`manage-roster ${whichTeam}`} title={<h1>{teamName}</h1>}>
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
