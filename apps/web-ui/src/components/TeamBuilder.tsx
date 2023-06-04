import { Player, Position, Team } from "@wiffleball/state-machine";
import React from "react";
import { Reorder, useMotionValue } from 'framer-motion';
import { safeParseInt } from "../helpers";
import { Batting, Close, Drag, PersonRemove } from "../icons";
import './TeamBuilder.css';
import { allPositions } from "../translations";

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
    addToLineup?: (id: string) => void;
    benchFromLineup?: (id: string) => void;
    remove: (index: number) => void;
}

const PlayerItem: React.FC<PlayerItemProps> = ({ index, id, name, position, rename, reposition, addToLineup = () => {}, benchFromLineup, remove }) => {
    const y = useMotionValue(0);

    const inLineup = Boolean(benchFromLineup);
    const toggleBat = benchFromLineup ?? addToLineup;

    const Component = inLineup ? Reorder.Item : 'li';

    return (
        <Component value={id} style={{ y }}>
            <div className="player">
                <div className="drag-handle"><Drag /></div>
                <input type="text" className="name" value={name} onChange={(e) => void rename(id, e.target.value)} />
                <PositionSelect position={position} onChange={(e) => void reposition(id, safeParseInt(e.target.value))} />
                <button className="player-action" onClick={() => void toggleBat(id)}>{inLineup ? <PersonRemove/> : <Batting />}</button>
                <button className="player-action remove" onClick={() => void remove(index)}><Close /></button>
            </div>
        </Component>
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

    const nonBattingPlayerIds = Object.keys(names).filter((name) => !lineup.includes(name));

    const addToLineup = (id: string) => {
        setLineup(prev => [...prev, id]);
    };
    const benchFromLineup = (id: string) => {
        setLineup(prev => prev.filter(existingId => existingId !== id));
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
                            benchFromLineup={benchFromLineup}
                            remove={remove}
                        />
                    );
                })}
            </Reorder.Group>
            {nonBattingPlayerIds.length > 0 && (
                <>
                Not batting:
                <ul>
                    {nonBattingPlayerIds.map((id, i) => {
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
                                addToLineup={addToLineup}
                                remove={remove}
                            />
                        );
                    })}
                </ul>
                </>
            )}
            <div className="add-player">
                <input className="name-input" type="text" value={pendingName} onChange={(e) => void setPendingName(e.target.value)} />
                <PositionSelect position={pendingPosition} setPosition={setPendingPosition} />
                <button onClick={add} disabled={pendingName === ''} className="add-btn">Add</button>
            </div>
        </div>
    );
};

export default TeamBuilder;
