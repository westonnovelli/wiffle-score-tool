import React from 'react';
import { NavLink, useMatch } from 'react-router-dom';
import './Nav.css';

interface Props {
    onSelectPitch: () => void;
}

const Nav: React.FC<Props> = ({ onSelectPitch }) => {
    const isManaging = useMatch('manage');
    const isStats = useMatch('stats');

    const isHome = !isManaging && !isStats;
    return (
        <div className="nav">
            {!isManaging && <NavLink className={`nav-btn${!isHome ? ' disabled' : ''}`} to="manage">Manage</NavLink>}
            {isManaging && <NavLink className="nav-btn" to="/">ᐸ Back</NavLink>}
            <button className="nav-btn pitch" onClick={onSelectPitch} disabled={!isHome}>Pitch</button>
            {!isStats && <NavLink className={`nav-btn${!isHome ? ' disabled' : ''}`} to="stats">Stats</NavLink>}
            {isStats && <NavLink className="nav-btn" to="/">Back ᐳ</NavLink>}
        </div>
    );
};

export default Nav;
