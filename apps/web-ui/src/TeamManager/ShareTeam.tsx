import React from 'react';
import QRCode from 'react-qr-code';
import { useCopyToClipboard } from 'usehooks-ts';

interface Props {
    href: string;
}

const ShareTeam: React.FC<Props> = ({ href }) => {
    const [value, copy] = useCopyToClipboard();

    const handleCopy = () => copy(href);

    return (
        <div className="share">
            <div className="qr-container">
                <QRCode value={href} />
            </div>
            <button onClick={handleCopy}>Copy to clipboard</button>
            {value === href && <div className="confirm">Copied!</div>}
            <input value={href} onFocus={(e) => void e.target?.select()} onChange={() => { }} />
        </div>
    );
};

export default ShareTeam;
