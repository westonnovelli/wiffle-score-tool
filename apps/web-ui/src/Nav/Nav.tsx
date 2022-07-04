import React from 'react';
import { Link, useMatch, useNavigate } from 'react-router-dom';
import './Nav.css';

interface Props {
    onSelectPitch: () => void;
}

const Nav: React.FC<Props> = ({ onSelectPitch }) => {
    const navigate = useNavigate();
    const isManaging = useMatch('manage/*');
    const isStats = useMatch('stats/*');
    const isNewgame = useMatch('new');

    const isHome = !isManaging && !isStats && !isNewgame;

    return (
        <nav className="nav">
            {!isManaging && <Link className={`nav-btn${!isHome ? ' disabled' : ''}`} to="manage">Manage</Link>}
            {isManaging && <button className="nav-btn" onClick={() => navigate(-1)}>ᐸ Back</button>}
            <button className="nav-btn pitch" onClick={onSelectPitch} disabled={!isHome}>Pitch</button>
            {!isStats && <Link className={`nav-btn${!isHome ? ' disabled' : ''}`} to="stats">Stats</Link>}
            {isStats && <button className="nav-btn" onClick={() => navigate('')}>Back ᐳ</button>}
        </nav>
    );
};

export default Nav;
