import {
    GameMoment,
    Player,
    battingAverage,
    onBasePlusSlugging,
    onBasePercentage,
    sluggingPercentage,
    extraBaseHit,
    totalBases,
    groundOutToAirOutRatio,
    pitchCount,
    hits,
    walksAndHitsPerInningPitched,
} from '@wiffleball/state-machine';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";
import './PlayerCard.css';
import { Close } from '../icons';

function getPlayer(game: GameMoment, playerId: string): { player: Player | undefined, teamKey: 'home' | 'away' | undefined } {
    const home = game.homeTeam.roster[playerId];
    const away = game.awayTeam.roster[playerId];
    if (home) {
        return { player: home, teamKey: 'home' };
    }
    return { player: away, teamKey: 'away' };
}

interface BattingTableProps {
    player: Player;
}

const BattingTable: React.FC<BattingTableProps> = ({ player }) => {
    return (
        <table>
            <tbody>
                <tr><th>PA</th><td>{player.offenseStats.plateAppearance}</td></tr>
                <tr><th>H</th><td>{player.offenseStats.hits}</td></tr>
                <tr><th>AB</th><td>{player.offenseStats.atbats}</td></tr>
                <tr><th>BB</th><td>{player.offenseStats.walks}</td></tr>
                <tr><th>K</th><td>{player.offenseStats.strikeoutsSwinging}</td></tr>
                <tr><th>ꓘ</th><td>{player.offenseStats.strikeoutsLooking}</td></tr>
                <tr><th>1B</th><td>{player.offenseStats.singles}</td></tr>
                <tr><th>2B</th><td>{player.offenseStats.doubles}</td></tr>
                <tr><th>3B</th><td>{player.offenseStats.triples}</td></tr>
                <tr><th>HR</th><td>{player.offenseStats.homeruns}</td></tr>
                <tr><th>GO</th><td>{player.offenseStats.groundOuts}</td></tr>
                <tr><th>DPs</th><td>{player.offenseStats.doublePlays}</td></tr>
                <tr><th>FCs</th><td>{player.offenseStats.doublePlayFails}</td></tr>
                <tr><th>FO</th><td>{player.offenseStats.flyOuts}</td></tr>
                <tr><th>RBI</th><td>{player.offenseStats.RBI}</td></tr>
                <tr><th>LOB</th><td>{player.offenseStats.LOB}</td></tr>
                <tr><th>Avg</th><td>{battingAverage(player).toFixed(3)}</td></tr>
                <tr><th>OBP</th><td>{onBasePercentage(player).toFixed(3)}</td></tr>
                <tr><th>SLG</th><td>{sluggingPercentage(player).toFixed(3)}</td></tr>
                <tr><th>OPS</th><td>{onBasePlusSlugging(player).toFixed(3)}</td></tr>
                <tr><th>XB</th><td>{extraBaseHit(player).toFixed(3)}</td></tr>
                <tr><th>TB</th><td>{totalBases(player)}</td></tr>
                <tr><th>GO/AO</th><td>{groundOutToAirOutRatio(player).toFixed(3)}</td></tr>
            </tbody>
        </table>
    );
};


interface PitchingTableProps {
    player: Player;
}

const PitchingTable: React.FC<PitchingTableProps> = ({ player }) => {
    return (
        <table>
            <tbody>
                <tr><th>BF</th><td>{player.defenseStats.pitching.battersFaced}</td></tr>
                <tr><th>PC</th><td>{pitchCount(player)}</td></tr>
                <tr><th>S</th><td>{player.defenseStats.pitching.strikes}</td></tr>
                <tr><th>B</th><td>{player.defenseStats.pitching.balls}</td></tr>
                <tr><th>H</th><td>{hits(player)}</td></tr>
                <tr><th>K</th><td>{player.defenseStats.pitching.strikeoutsSwinging}</td></tr>
                <tr><th>ꓘ</th><td>{player.defenseStats.pitching.strikeoutsLooking}</td></tr>
                <tr><th>BB</th><td>{player.defenseStats.pitching.walks}</td></tr>
                <tr><th>ERA</th><td>{player.defenseStats.pitching.runsAllowed}</td></tr>
                <tr><th>WHIP</th><td>{walksAndHitsPerInningPitched(player).toFixed(3)}</td></tr>
                <tr><th>WP</th><td>{player.defenseStats.pitching.wildPitches}</td></tr>
            </tbody>
        </table>
    );
};

interface Props {
    game: GameMoment;
}

const PlayerCard: React.FC<Props> = ({
    game
}) => {
    const navigate = useNavigate();
    const { playerId = '' } = useParams();
    const { player, teamKey } = getPlayer(game, playerId);
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    if (!player) {
        return <div className="player-card 404">'Not found'</div>;
    }

    function onDismiss() {
        navigate(-1);
    }

    return (
        <Dialog
            aria-labelledby="label"
            onDismiss={onDismiss}
            initialFocusRef={buttonRef}
        >
            <div className={`player-card ${teamKey}`}>
                <h1>{player.name}</h1>
                <button onClick={onDismiss} ref={buttonRef} className="close"><Close /></button>
                <div className="stats">
                    <div>
                        <h2>Batting</h2>
                        <BattingTable player={player} />
                    </div>
                    <div>
                        <h2>Pitching</h2>
                        <PitchingTable player={player} />
                    </div>
                </div>
            </div>
        </Dialog>
    )
};

export default PlayerCard;
