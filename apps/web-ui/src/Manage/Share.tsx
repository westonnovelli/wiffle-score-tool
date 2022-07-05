import React from "react";
import { useReadLocalStorage, useCopyToClipboard } from 'usehooks-ts';
import Structure from "./Structure";
import './Share.css';
import { ACTIVE_GAME } from "../localStorage";

const Share: React.FC = () => {
    const location = window.location;
    const activeGame = useReadLocalStorage<string>(`${ACTIVE_GAME}`) ?? '';
    const [value, copy] = useCopyToClipboard();
    
    const href = `${location.protocol}//${location.host}?game=${activeGame}`;

    const handleCopy = () => copy(href);

    return (
        <Structure className={`manage-share`} title={<h1>Share game</h1>}>
            <div className="link"><a href={href} target="_blank" rel="noreferrer">{href}</a></div>
            <button onClick={handleCopy}>Copy to clipboard</button>
            {value === href && <div className="confirm">Copied!</div>}
        </Structure>
    );
};

export default Share;
