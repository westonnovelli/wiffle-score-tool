import React from 'react';
import { GameMoment, Team, battingAverage, onBasePlusSlugging } from "@wiffleball/state-machine";

interface BattingTableProps {
    team: Team;
    label: string;
    className: string;
}

const BattingTable: React.FC<BattingTableProps> = ({ team, label, className }) => {
    return (
        <div className={`team ${className}`}>
            <h3>{label}</h3>
            <table>
                <thead>
                    <tr>
                        <td>Player</td>
                        <td>H</td>
                        <td>AB</td>
                        <td>Avg</td>
                        <td>OPS</td>
                        <td>RBI</td>
                        <td>LOB</td>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(team.roster).map(([id, player]) => {
                        return (
                            <tr key={id}>
                                <th>{player.name}</th>
                                <td>{player.offenseStats.hits}</td>
                                <td>{player.offenseStats.atbats}</td>
                                <td>{battingAverage(player).toFixed(3)}</td>
                                <td>{onBasePlusSlugging(player).toFixed(3)}</td>
                                <td>{player.offenseStats.RBI}</td>
                                <td>{player.offenseStats.LOB}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

interface Props {
    game: GameMoment;
}

const BattingStats: React.FC<Props> = ({ game }) => {
    return (
        <>
            <BattingTable team={game.homeTeam} label="Home team" className={'hometeam'} />
            <BattingTable team={game.awayTeam} label="Away team" className={'awayteam'} />
        </>
    );
};

export default BattingStats;
