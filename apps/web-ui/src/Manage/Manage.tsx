import React from "react";
import { GameMoment } from "@wiffleball/state-machine";
import './Manage.css';
import { useNavigate } from "react-router-dom";
import Structure from "./Structure";
import { pitchDescriptions } from "../helpers";
import MenuItem from '../components/MenuItem';

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

    const handleExport = () => {
        navigate('export');
    };

    const handleAbout = () => {
        navigate('/about');
    };

    return (
        <Structure className="manage" title={<h1>Manage game</h1>}>
            <ul>
                {/* TODO figure out better undo/redo UI */}
                {canUndo && (
                    <MenuItem
                        onClick={undo}
                        label="Undo last pitch"
                        description={`(${pitchDescriptions[game.pitches[game.pitches.length - 1]]})`}
                    />)}
                {canRedo && (
                    <MenuItem
                        onClick={redo}
                        label="Redo last undo"
                        description={`(${pitchDescriptions[next.pitches[next.pitches.length - 1]]})`}
                    />)}
                <MenuItem onClick={handleSubstitute} label="Substitution (defense)" />
                <MenuItem onClick={() => handleRoster('home')} label="Home Team" />
                <MenuItem onClick={() => handleRoster('away')} label="Away Team" />
                <MenuItem onClick={handleManual} label="Manually adjust game state" />
                <MenuItem onClick={handleNew} label="New Game" description="abandon this game" />
                <MenuItem onClick={handleStash} label="Save this game" description="game will be available on this device" />
                <MenuItem onClick={handleLoad} label="Load a saved game" />
                <MenuItem onClick={handleShare} label="Share this game by url" />
                <MenuItem onClick={handleExport} label="Export stats" description="as csv, for current game" />
                <MenuItem onClick={handleAbout} label="About" />
            </ul>
        </Structure>
    );
};

export default Manage;
