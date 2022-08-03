import React from "react";
import './Menu.css';
import { useNavigate } from "react-router-dom";
import Structure from "../components/Structure";
import PageHeader from "../components/PageHeader";
import MenuItem from '../components/MenuItem';

interface Props {}

const Menu: React.FC<Props> = () => {
    const navigate = useNavigate();


    const handleNew = () => {
        navigate('new');
    };

    const handleStash = () => {
        navigate('save');
    };

    const handleLoad = () => {
        navigate('load');
    };

    const handleShare = () => {
        navigate('share');
    };

    const handleAbout = () => {
        navigate('about');
    };

    return (
        <Structure className="menu" wftitle={<PageHeader title="Menu" destination="/" />}>
            <ul>
                <MenuItem onClick={handleNew} label="New Game" description="abandon this game" />
                <MenuItem onClick={handleStash} label="Save this game" description="game will be available on this device" />
                <MenuItem onClick={handleLoad} label="Load a saved game" />
                <MenuItem onClick={handleShare} label="Share this game by url" />
                <MenuItem onClick={handleAbout} label="About" />
            </ul>
        </Structure>
    );
};

export default Menu;
