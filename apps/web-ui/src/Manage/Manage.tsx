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

    const handleRoster = (team: 'home' | 'away') => {
        navigate(`roster/${team}`);
    };

    const handleStash = () => {
        navigate('stash');
    };

    const handleLoad = () => {
        navigate('load');
    };

    const handleShare = () => {
        navigate('share');
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
                <li role="button" onClick={() => handleRoster('home')}>Home Team ᐳ</li>
                <li role="button" onClick={() => handleRoster('away')}>Away Team ᐳ</li>
                <li role="button" onClick={handleManual}>Manually adjust game state ᐳ</li>
                <li role="button" onClick={handleNew}>New Game<div>abandon this game</div></li>
                <li role="button" onClick={handleStash}>Save this game<div>game will be available on this device</div></li>
                <li role="button" onClick={handleLoad}>Load a saved game</li>
                <li role="button" onClick={handleShare}>Share this game by url</li>
            </ul>
        </Structure>
    );
};

export default Manage;
