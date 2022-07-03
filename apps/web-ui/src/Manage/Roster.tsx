import { DeepPartial, Team, Position, Player } from "@wiffleball/state-machine";
import React from "react";
import Structure from "./Structure";
import './Roster.css';

interface Props {
    whichTeam: 'home' | 'away';
    teamName: string;
    team: Team;
    handleEdit?: (edit: DeepPartial<Team>) => void;
}

type IdAndName = Pick<Player, 'id' | 'name'>;
const pickNames = (team: Team) => {
    return Object.keys(team.roster).reduce<Record<string, IdAndName>>((acc, id) => {
        acc[id] = {
            id,
            name: team.roster[id].name,
        };
        return acc;
    }, {});
};

const changedNames = (potential: Record<string, IdAndName>, team: Team) => {
    return Object.keys(team.roster).reduce<IdAndName[]>((acc, id) => {
        const player = team.roster[id];
        if (player.name !== potential[id].name) {
            acc.push(potential[id]);
        }
        return acc;
    }, []);
}

const Roster: React.FC<Props> = ({ whichTeam, teamName, team, handleEdit }) => {
    const [names, setNames] = React.useState(pickNames(team));
    // const [lineup, setLineup] = React.useState(team.lineup);

    const editing = Boolean(handleEdit);

    const handleNameChange = (id: string, name: string) => {
        if (!Object.keys(team.roster).includes(id)) return;
        setNames(prev => {
            return {
                ...prev,
                [id]: {
                    ...prev[id],
                    name,
                },
            };
        });
    };

    // const handleReorder = () => {
    //     setLineup([]);
    // };

    const onSave = () => {
        if (!handleEdit) return;

        const edit: DeepPartial<Team> = {};

        const nameChanges = changedNames(names, team);
        if (nameChanges.length > 0) {
            edit.roster = {};
            nameChanges.forEach(({ id, name }) => {
                if (edit.roster) {
                    edit.roster[id] = { name };
                }
            })
        }

        handleEdit(edit);
    };

    return (
        <Structure className={`manage-roster ${whichTeam}`} title={<h1>{teamName}</h1>}>
            <ol>
                {team.lineup.map((id) => {
                    const player = team.roster[id];
                    if (!player) return null;
                    const position = team.defense[id];
                    const name = names[id].name;
                    return (
                        <li key={id} className={editing ? 'editing' : ''}>
                            <div className="row">
                                <div className="name">{editing ? (
                                    <input value={name} onChange={(e) => handleNameChange(id, e.target.value)} />
                                ) : player.name}</div>
                                <div className="position">{Position[position]}</div>
                                <div className="pa-stat">{player.offenseStats.hits} for {player.offenseStats.atbats}</div>
                            </div>
                        </li>
                    );
                })}
                {/* {notInLineup.length > 0 && <hr />} */}
                {/* {notInLineup.length > 0 && notInLineup.map((id) => ( */}
                {/* <li key={id} className="data">{internalTeam.roster[id]?.name}</li> */}
                {/* ))} */}
            </ol>
            {editing && <button onClick={onSave}>Save changes</button>}
        </Structure>
    );
};

export default Roster;
