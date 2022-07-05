import { GameMoment, getDefense, Team, Position } from '@wiffleball/state-machine';
import React from 'react';
import Structure from './Structure';
import './Substitute.css';

interface Props {
    game: GameMoment;
    handleEdit: (rotation: string[]) => void;
}

const questions = [
    'Who is leaving their position?',
    'Who is replacing them?',
];

const Substitute: React.FC<Props> = ({ game, handleEdit }) => {
    const [playerRotation, setPlayerRotation] = React.useState<string[]>([]);

    const defense: Team = getDefense(game);
    const [otherPlayers, setOtherPlayers] = React.useState(defense.lineup);

    const selectPlayer = (id: string) => {
        setPlayerRotation(prev => [...prev, id]);
        setOtherPlayers(prev => prev.filter((playerId) => playerId !== id));
    };

    return (
        <Structure title={<h1>Substitute</h1>} className="substitute">
            {defense.lineup.map((_, i) => {
                const hasPreviousSelected = i === 0 ? true : Boolean(playerRotation[i - 1]);
                const selected = playerRotation[i];
                const prompt = questions[i] ?? questions[questions.length - 1];
                if (!Boolean(selected) && !hasPreviousSelected) return null;
                return (
                    <div key={i} className="prompt">
                        <label>{prompt}</label>
                        {Boolean(selected) && <span>{defense.roster[playerRotation[i]].name}</span>}
                    </div>
                );
            })}
            <ul>
                {otherPlayers.map((id) => (
                    <li key={id} onClick={() => selectPlayer(id)} role="button">{defense.roster[id].name}</li>
                ))}
            </ul>
            <div className="summary">
                {playerRotation.map((id, i) => {
                    const nextRotation = playerRotation[i + 1] !== undefined ? playerRotation[i + 1] : playerRotation[0];
                    const pos = Position[defense.defense[nextRotation]] as string;
                    return (
                        <div key={i}>
                            <div className="data player">{defense.roster[id].name}</div>
                            moves to
                            <div className="position">{pos}</div>
                        </div>
                    );
                })}
            </div>
            <div className="submit"><button onClick={() => void handleEdit(playerRotation)}>Done</button></div>
        </Structure>
    );
};

export default Substitute;
