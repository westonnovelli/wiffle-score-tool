import React from 'react';
import { Link, useMatch, useNavigate } from 'react-router-dom';
import './Nav.css';

interface Props {
    onSelectPitch: () => void;
    gameOver: boolean;
    gameStarted: boolean;
    startGame: () => void;
}

const Nav: React.FC<Props> = ({ onSelectPitch, gameOver, gameStarted, startGame }) => {
    const navigate = useNavigate();
    const isManaging = useMatch('manage/*');
    const isStats = useMatch('stats/*');
    const isNewgame = useMatch('new');

    const isHome = !isManaging && !isStats && !isNewgame;

    const primaryBtnLabel = gameOver ? 'Game Over' : !gameStarted ? 'Start Game' : 'Pitch';
    const primaryOnClick = !gameStarted ? startGame : onSelectPitch;

    return (
        <nav className="nav">
            {!isManaging && <Link className={`nav-btn${!isHome ? ' disabled' : ''}`} to="manage">Manage</Link>}
            {isManaging && <button className="nav-btn" onClick={() => navigate(-1)}>ᐸ Back</button>}
            <button className="nav-btn pitch" onClick={primaryOnClick} disabled={!isHome || gameOver}>{primaryBtnLabel}</button>
            {!isStats && <Link className={`nav-btn${!isHome ? ' disabled' : ''}`} to="stats">Stats</Link>}
            {isStats && <button className="nav-btn" onClick={() => navigate('')}>Back ᐳ</button>}
        </nav>
    );
};

export default Nav;
