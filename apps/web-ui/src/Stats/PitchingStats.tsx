import React from 'react';
import {
    GameMoment,
    Team,
    Player,
    getPitcher,
    pitchCount,
    hits,
    walksAndHitsPerInningPitched,
} from "@wiffleball/state-machine";

interface PitchingTableProps {
    team: Team;
    label: string;
    className: string;
}

const PitchingTable: React.FC<PitchingTableProps> = ({ team, label, className }) => {
    const pitchers = team.lineup.reduce<Player[]>((acc, id) => {
        const player = team.roster[id];
        if (player.defenseStats.pitching.battersFaced > 0) {
            acc.push(player);
        }
        return acc;
    }, []);
    const activePitcher = getPitcher(team);
    if (pitchers.length === 0) {
        pitchers.push(team.roster[activePitcher]);
    }

    return (
        <div className={`team ${className}`}>
            <h3>{label}</h3>
            <table>
                <thead>
                    <tr>
                        <td>Player</td>
                        <td>BF</td>
                        <td>PC</td>
                        <td>B</td>
                        <td>S</td>
                        <td>H</td>
                        <td>K</td>
                        <td>ꓘ</td>
                        <td>BB</td>
                        <td>R</td>
                        <td>WHIP</td>
                        <td>WP</td>
                    </tr>
                </thead>
                <tbody>
                    {pitchers.map((player) => {
                        return (
                            <tr key={player.id} className={player.id === activePitcher ? 'active' : ''}>
                                <th>{player.name}</th>
                                <td>{player.defenseStats.pitching.battersFaced}</td>
                                <td>{pitchCount(player)}</td>
                                <td>{player.defenseStats.pitching.balls}</td>
                                <td>{player.defenseStats.pitching.strikes}</td>
                                <td>{hits(player)}</td>
                                <td>{player.defenseStats.pitching.strikeoutsSwinging}</td>
                                <td>{player.defenseStats.pitching.strikeoutsLooking}</td>
                                <td>{player.defenseStats.pitching.walks}</td>
                                <td>{player.defenseStats.pitching.runsAllowed}</td>
                                <td>{walksAndHitsPerInningPitched(player).toFixed(3)}</td>
                                <td>{player.defenseStats.pitching.wildPitches}</td>
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

const PitchingStats: React.FC<Props> = ({ game }) => {
    return (
        <>
            <PitchingTable team={game.homeTeam} label="Home team" className={'hometeam'} />
            <PitchingTable team={game.awayTeam} label="Away team" className={'awayteam'} />
        </>
    );
};

export default PitchingStats;
