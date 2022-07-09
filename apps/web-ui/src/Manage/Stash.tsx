import React from "react";
import { useNavigate } from 'react-router-dom';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import Structure from "./Structure";
import './Stash.css';
import { hydrateGame, deserializeGame, awayScore, homeScore, InningHalf } from "@wiffleball/state-machine";
import { ACTIVE_GAME, SAVES, SAVE_PREFIX } from "../localStorage";

const numberEnding = (n: number) => {
    if (n === 1) return 'st';
    if (n === 2) return 'nd';
    return 'th';
};

const displayInningHalf = (half: InningHalf) => {
    return half === InningHalf.TOP ? 'top' : 'bottom';
};

const Stash: React.FC = () => {
    const navigate = useNavigate();
    const activeGame = useReadLocalStorage<string>(`${ACTIVE_GAME}`) ?? '';
    
    const game = hydrateGame(deserializeGame(activeGame));
    const awayTotal = awayScore(game);
    const homeTotal = homeScore(game);
    const half = displayInningHalf(game.inning.half);
    const halfShort = half.slice(0,1);
    const inning = `${game.inning.number}${numberEnding(game.inning.number)}`;
    const away = `${awayTotal} run${awayTotal !== 1 ? 's' : ''}`;
    const home = `${homeTotal} run${homeTotal !== 1 ? 's' : ''}`;

    const [saveName, setSaveName] = React.useState(`${halfShort}${game.inning.number}:${awayTotal}-${homeTotal}`);
    const [saves, setSaves] = useLocalStorage<string[]>(SAVES, []);

    const onSave = () => {
        setSaves([...saves, saveName]);
        localStorage.setItem(`${SAVE_PREFIX}${saveName}`, activeGame);
        navigate('/');
    };

    const disabled = !activeGame || saves.includes(saveName);
    const overwriteEnabled = saves.includes(saveName);

    return (
        <Structure className={`manage-stash`} title={<h1>Stash game</h1>}>
            <ul className="summary">
                <li>{`Game is in the ${displayInningHalf(game.inning.half)} of the ${inning}`}</li>
                <li>{`Away team has scored ${away}`}</li>
                <li>{`Home team has scored ${home}`}</li>
            </ul>
            <div className="form">
                <div className="prompt">Save this game with the following name</div>
                <input
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    onFocus={(e) => { e.target?.select(); }}
                />
                <button onClick={onSave} disabled={disabled}>Save game</button>
                {overwriteEnabled && <button onClick={onSave} disabled={!overwriteEnabled}>Overwrite existing game</button>}
            </div>
        </Structure>
    );
};

export default Stash;
