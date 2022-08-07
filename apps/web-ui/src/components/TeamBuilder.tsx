import { Player, Position, Team } from "@wiffleball/state-machine";
import React from "react";
import { Reorder, useMotionValue } from 'framer-motion';
import { safeParseInt } from "../helpers";
import { Close, Drag } from "../icons";
import './TeamBuilder.css';

const allPositions = [
    { label: 'Pitcher', value: Position.Pitcher },
    { label: 'Infield', value: Position.Infield },
    { label: 'Outfield', value: Position.Outfield },
    { label: 'Bench', value: Position.Bench },
];

type PositionSelectProps = {
    position: Position;
    setPosition?: React.Dispatch<React.SetStateAction<Position>>;
} & React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;

const PositionSelect: React.FC<PositionSelectProps> = ({ position, setPosition, ...props }) => {
    return (
        <select value={position} onChange={(e) => setPosition?.(safeParseInt(e.target.value))} {...props}>
            {allPositions.map(({ label, value }) => {
                return (
                    <option key={value} value={value}>{label}</option>
                );
            })}
        </select>
    );
};

interface PlayerItemProps {
    index: number;
    id: string;
    player?: Player;
    name: string;
    position: Position;
    rename: (id: string, newName: string) => void;
    reposition: (id: string, newPosition: Position) => void;
    remove: (index: number) => void;
}

const PlayerItem: React.FC<PlayerItemProps> = ({ index, id, name, position, rename, reposition, remove }) => {
    const y = useMotionValue(0);

    return (
        <Reorder.Item value={id} style={{ y }}>
            <div className="player">
                <div className="drag-handle"><Drag /></div>
                <input value={name} onChange={(e) => rename(id, e.target.value)} />
                <PositionSelect position={position} onChange={(e) => reposition(id, safeParseInt(e.target.value))} />
                <button className="remove" onClick={() => remove(index)}><Close /></button>
            </div>
        </Reorder.Item>
    );
};

interface TeamBuilderProps {
    team?: Team;
    names: Record<string, string>;
    setNames: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    positions: Record<string, Position>;
    setPositions: React.Dispatch<React.SetStateAction<Record<string, Position>>>;
    lineup: string[];
    setLineup: React.Dispatch<React.SetStateAction<string[]>>;
    editing: boolean;
}

const TeamBuilder: React.FC<TeamBuilderProps> = ({
    team,
    names,
    setNames,
    positions,
    setPositions,
    lineup,
    setLineup,
    editing,
}) => {
    const [pendingName, setPendingName] = React.useState('');
    const [pendingPosition, setPendingPosition] = React.useState<Position>(Position.Pitcher);

    const add = () => {
        const tempId = `${pendingName}-temp${lineup.length}`;
        setLineup(prev => [...prev, tempId]);
        setNames(prev => ({ ...prev, [tempId]: pendingName }));
        setPositions(prev => ({ ...prev, [tempId]: pendingPosition }));
        setPendingName('');
        setPendingPosition(Position.Infield);
    };

    // const move = (index: number, amt: number) => {
    //     if (index === 0 && amt < 0) return;
    //     if (index === lineup.length - 1 && amt > 0) return;
    //     if (amt === 0 || amt > 1 || amt < -1) return;
    //     if (index > lineup.length - 1 || index < 0) return;

    //     const atIndex = lineup[index];
    //     setLineup(prev => {
    //         const next = [...prev];
    //         next[index] = next[index + amt];
    //         next[index + amt] = atIndex;
    //         return next;
    //     });
    // };

    const rename = (id: string, newName: string) => {
        if (!Object.keys(names).includes(id)) return;

        setNames(prev => ({
            ...prev,
            [id]: newName,
        }));
    };

    const reposition = (id: string, newPosition: Position) => {
        if (!Object.keys(positions).includes(id)) return;

        setPositions(prev => ({
            ...prev,
            [id]: newPosition,
        }));
    };

    const remove = (index: number) => {
        if (index > lineup.length - 1) return;

        const id = lineup[index];
        setLineup(prev => {
            return [...prev.slice(0, index), ...prev.slice(index + 1)];
        });
        setPositions(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
        setNames(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
    };

    return (
        <div className="teambuilder">
            <Reorder.Group as="ol" axis="y" onReorder={setLineup} values={lineup}>
                {lineup.map((id, i) => {
                    return (
                        <PlayerItem
                            key={id}
                            id={id}
                            index={i}
                            player={team?.roster[id]}
                            name={names[id]}
                            position={positions[id]}
                            rename={rename}
                            reposition={reposition}
                            remove={remove}
                        />
                        // <li key={`${id}-${i}`}>
                        //     <div className="player">
                        //                 <div className="name">{name}</div>
                        //                 <div className="position">{Position[position]}</div>
                        //                 {player && <div className="pa-stat">{player?.offenseStats?.hits} for {player?.offenseStats?.atbats}</div>}
                        //     </div>
                        // </li>
                    );
                })}
            </Reorder.Group>
            <input type="text" value={pendingName} onChange={(e) => void setPendingName(e.target.value)} />
            <PositionSelect position={pendingPosition} setPosition={setPendingPosition} />
            <button onClick={add}>Add</button>
        </div>
    );
};

export default TeamBuilder;
