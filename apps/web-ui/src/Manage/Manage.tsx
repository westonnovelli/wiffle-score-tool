import { GameMoment, Pitches } from "@wiffleball/state-machine";
import React from "react";
import './Manage.css';
import { useNavigate } from "react-router-dom";
import Structure from "./Structure";

interface Props {
    game: GameMoment;
    last: GameMoment;
    next: GameMoment;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

const Manage: React.FC<Props> = ({
    game,
    // last,
    next,
    undo,
    redo,
    canUndo,
    canRedo
}) => {
    // TODO abstract friendly pitch names
    const navigate = useNavigate();

    const handleManual = () => {
        navigate('manual');
    };

    const handleSubstitute = () => {
        navigate('substitute');
    };

    const handleNew = () => {
        navigate('/new');
    };

    return (
        <Structure className="manage" title={<h1>Manage game</h1>}>
            <ul>
                {/* TODO figure out better undo/redo UI */}
                {canUndo && <li role="button" onClick={undo}>
                    Undo last pitch
                    <span>{' '}({Pitches[game.pitches[game.pitches.length - 1]]})</span>
                </li>}
                {canRedo && <li role="button" onClick={redo}>
                    Redo last undo
                    <span>{' '}({Pitches[next.pitches[next.pitches.length - 1]]})</span>
                </li>}
                <li role="button" onClick={handleSubstitute}>Substitution (defense) ᐳ</li>
                {/* <li role="button" onClick={handleFielderChange}>Home Team ᐳ</li> */}
                {/* <li role="button" onClick={handleFielderChange}>Away Team ᐳ</li> */}
                <li role="button" onClick={handleManual}>Manually adjust game state ᐳ</li>
                {/* <li role="button" onClick={handleFielderChange}>Fielders change ᐳ</li> */}
                <li role="button" onClick={handleNew}>New Game (abandon this game)</li>
            </ul>
        </Structure>
    );
};

export default Manage;
