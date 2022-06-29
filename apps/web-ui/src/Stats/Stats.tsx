import { GameMoment, Team, battingAverage, onBasePlusSlugging } from "@wiffleball/state-machine";
import React from "react";
import { motion } from 'framer-motion';
import './Stats.css';

interface Props {
    game: GameMoment;
}

const animations = {
    initial: { opacity: 0, x: 200 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 200 },
}

interface StatsTableProps {
    team: Team;
    label: string;
    className: string;
}

const StatsTable: React.FC<StatsTableProps> = ({ team, label, className }) => {
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
                    {team.lineup.map((id) => {
                        const player = team.roster[id];
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

// TODO game stats
const Stats: React.FC<Props> = ({ game }) => {
    return (
        <motion.div
            variants={animations}
            initial="initial"
            animate="animate"
            exit="exit"
            className="stats"
        >
            <h1>Game stats</h1>
            <h2>Batting</h2>
            <StatsTable team={game.homeTeam} label="Home team" className={'hometeam'} />
            <StatsTable team={game.awayTeam} label="Away team" className={'awayteam'} />
        </motion.div >
    );
};

export default Stats;
