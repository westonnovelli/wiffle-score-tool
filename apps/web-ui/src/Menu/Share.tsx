import React from "react";
import QRCode from "react-qr-code";
import { useReadLocalStorage, useCopyToClipboard } from 'usehooks-ts';
import Structure from "../components/Structure";
import PageHeader from "../components/PageHeader";
import './Share.css';
import { ACTIVE_GAME } from "../localStorage";

const Share: React.FC = () => {
    const location = window.location;
    const activeGame = useReadLocalStorage<string>(`${ACTIVE_GAME}`) ?? '';
    const [value, copy] = useCopyToClipboard();

    const href = `${location.protocol}//${location.host}?game=${activeGame}`;

    const handleCopy = () => copy(href);

    return (
        <Structure className={`manage-share`} wftitle={<PageHeader title="Share Game"/>}>
            <div className="qr-container">
                <QRCode value={href} />
            </div>
            <button onClick={handleCopy}>Copy to clipboard</button>
            {value === href && <div className="confirm">Copied!</div>}
            <input value={href} onFocus={(e) => void e.target?.select()} onChange={() => {}}/>
        </Structure>
    );
};

export default Share;
