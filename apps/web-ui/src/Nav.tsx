import React from 'react';
import './Nav.css';

interface Props {
    onSelectPitch: () => void;
}

const Nav: React.FC<Props> = ({ onSelectPitch }) => {
    return (
        <div className="nav">
            <button className="nav-btn">Manage</button>
            <button className="nav-btn pitch" onClick={onSelectPitch}>Pitch</button>
            <button className="nav-btn">Stats</button>
        </div>
    );
};

export default Nav;
