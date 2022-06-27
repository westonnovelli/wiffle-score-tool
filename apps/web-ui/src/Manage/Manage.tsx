import { GameMoment, Pitches } from "@wiffleball/state-machine";
import React from "react";
import './Manage.css';
import { Outlet, useNavigate } from "react-router-dom";
import Structure from "./Structure";

interface Props {
    game: GameMoment;
}

// TODO manage game menu
const Manage: React.FC<Props> = ({ game }) => {
    // TODO abstract friendly pitch names

    const navigate = useNavigate();
    const handleUndoPitch = () => {
        console.log('undo pitch not implemented');
        // TODO undo pitch logic
        // opt 1. hydrate new game with pitch[0..-1]
        // opt 2. hold prev game state in and swap
        navigate('/');
    };

    const handleManual = () => {
        navigate('manual');
    };

    const handlePitchingChange = () => {
        console.log('pitching change not implemented');
        // TODO pitching change
        navigate('/');
    };

    const handleFielderChange = () => {
        console.log('fielder change not implemented');
        // TODO fielder change
        navigate('/');
    };

    return (
        <Structure className="manage" title={<h1>Manage game</h1>}>
            <ul>
                <li role="button" onClick={handleUndoPitch}>
                    Undo last pitch
                    {game.pitches.length > 0 && <span>{' '}({Pitches[game.pitches[game.pitches.length - 1]]})</span>}
                </li>
                <li role="button" onClick={handleManual}>Manually adjust game state ᐳ</li>
                <li role="button" onClick={handlePitchingChange}>Pitching change ᐳ</li>
                <li role="button" onClick={handleFielderChange}>Fielders change ᐳ</li>
                <li role="button" onClick={handleFielderChange}>Home Team ᐳ</li>
                <li role="button" onClick={handleFielderChange}>Away Team ᐳ</li>
            </ul>
        </Structure>
    );
};

export default Manage;
