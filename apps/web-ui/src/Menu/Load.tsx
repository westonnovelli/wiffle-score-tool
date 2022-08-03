import React from "react";
import './Load.css';
import { useReadLocalStorage } from 'usehooks-ts';
import { useNavigate } from "react-router-dom";
import Structure from "../components/Structure";
import PageHeader from "../components/PageHeader";
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

    const clearSaves = () => {
        if (window.confirm('Are you sure? These games cannot be recovered.')) {
            saves?.forEach((save) => {
                localStorage.removeItem(`${SAVE_PREFIX}${save}`);
            });
            localStorage.removeItem(SAVES);
            navigate('/');
        }
    };

    return (
        <Structure className="load" wftitle={<PageHeader title="Load Game"/>}>
            <ul>
                {saves && saves.map((saveName) => (
                    <li key={saveName} role="button" onClick={() => handleLoad(saveName)} className="save">{saveName}</li>
                ))}
                {!saves && <div className="empty">No saved games found</div>}
            </ul>
            {saves && (
                <>
                    <button className="clear" onClick={clearSaves}>Clear all saves</button>
                    <div className="hint">this cannot be undone</div>
                </>
            )}
        </Structure>
    );
};

export default Load;
