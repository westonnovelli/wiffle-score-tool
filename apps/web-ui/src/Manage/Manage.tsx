import React from "react";
import './Manage.css';
import { useNavigate } from "react-router-dom";
import Structure from "../components/Structure";
import MenuItem from '../components/MenuItem';
import PageHeader from "../components/PageHeader";

const Manage: React.FC = () => {
    const navigate = useNavigate();

    const handleManual = () => {
        navigate('manual');
    };

    const handleSubstitute = () => {
        navigate('substitute');
    };

    const handleRoster = (team: 'home' | 'away') => {
        navigate(`roster/${team}`);
    };

    return (
        <Structure className="manage" wftitle={<PageHeader title="Manage" destination="/" />}>
            <ul>
                <MenuItem onClick={handleSubstitute} label="Substitution (defense)" />
                <MenuItem onClick={() => handleRoster('home')} label="Home Team" />
                <MenuItem onClick={() => handleRoster('away')} label="Away Team" />
                <MenuItem onClick={handleManual} label="Manually adjust game state" />
            </ul>
        </Structure>
    );
};

export default Manage;
