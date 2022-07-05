import React from "react";
import './Load.css';
import { useReadLocalStorage } from 'usehooks-ts';
import { useNavigate } from "react-router-dom";
import Structure from "./Structure";
import { SAVES, SAVE_PREFIX } from "../localStorage";

interface Props {
    loadSave: (serializedGame: string) => void;
}

const Load: React.FC<Props> = ({ loadSave }) => {
    const saves = useReadLocalStorage<string[]>(SAVES);
    const navigate = useNavigate();

    const handleLoad = (save: string) => {
        const serializedGame = localStorage.getItem(`${SAVE_PREFIX}${save}`) ?? '';
        loadSave(serializedGame);
        navigate('/');
    };

    return (
        <Structure className="manage" title={<h1>Load game</h1>}>
            <ul>
                {saves && saves.map((saveName) => (
                    <li key={saveName} role="button" onClick={() => handleLoad(saveName)}>{saveName}</li>
                ))}
                {!saves && <div className="empty">No saved games found</div>}
            </ul>
        </Structure>
    );
};

export default Load;
