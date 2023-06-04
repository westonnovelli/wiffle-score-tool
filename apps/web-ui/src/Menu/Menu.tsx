import React from "react";
import './Menu.css';
import { useNavigate } from "react-router-dom";
import Structure from "../components/Structure";
import PageHeader from "../components/PageHeader";
import MenuItem from '../components/MenuItem';
import { People } from "../icons";

interface Props {}

const Menu: React.FC<Props> = () => {
    const navigate = useNavigate();

    return (
        <Structure className="menu" wftitle={<PageHeader title="Menu" destination="/" />}>
            <ul>
                <MenuItem onClick={() => void navigate('new')} label="New Game" description="abandon this game" />
                <MenuItem onClick={() => void navigate('save')} label="Save this game" description="game will be available on this device" />
                <MenuItem onClick={() => void navigate('load')} label="Load a saved game" />
                <MenuItem onClick={() => void navigate('share')} label="Share this game by url" />
                <MenuItem onClick={() => void navigate('export')} label="Export stats" />
                <MenuItem onClick={() => void navigate('/team-manager')} label={<div className="iconed"><People/><div>Team Manager</div></div>} />
                <MenuItem onClick={() => void navigate('about')} label="About" />
            </ul>
        </Structure>
    );
};

export default Menu;
