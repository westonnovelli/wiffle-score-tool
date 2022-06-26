import { Bases, GameMoment } from '@wiffleball/state-machine';
import React from 'react';
import './Scoreboard.css';


interface Props {
    game: GameMoment;
}

const Scoreboard: React.FC<Props> = ({ game }) => {
    const [awayScore, homeScore] = game.boxScore.reduce((total, inning) => {
        total[0] += inning.awayTeam;
        total[1] += inning.homeTeam;
        return total;
    }, [0, 0]);

    return (
        <div className="scoreboard">
            {/* <div className="teams">
                <div>AWAY - {awayScore}</div>
                <div>HOME - {homeScore}</div>
            </div> */}
            <div className="boxScore">
                <table>
                    <thead>
                        <tr>
                            <td></td>
                            {Array.from(Array(game.boxScore.length)).map((_, i) => (
                                <td key={i}>{i + 1}</td>
                            ))}
                            <td className="runs">R</td>
                            <td>E</td>
                            <td>L</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="awayScore">
                            <th>AWAY</th>
                            {game.boxScore.map(({ awayTeam }, i) => {
                                return (
                                    <td key={i}>{awayTeam}</td>
                                );
                            })}
                            <th className="runs">{awayScore}</th>
                            <td>0</td>
                            <td>0</td>
                        </tr>
                        <tr className="homeScore">
                            <th>HOME</th>
                            {game.boxScore.map(({ homeTeam }, i) => {
                                return (
                                    <td key={i}>{homeTeam}</td>
                                );
                            })}
                            <th className="runs">{homeScore}</th>
                            <td>0</td>
                            <td>0</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="bases" style={{ textAlign: 'center'}}>
                <div style={{ display: 'flex', flexDirection: 'column', width: '40px' }}>
                    <div className="secondbase">{game.bases[Bases.SECOND] > 0 ? 'X' : '[]'}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div className="thirdbase">{game.bases[Bases.THIRD] > 0 ? 'X' : '[]'}</div>
                        <div className="firstbase">{game.bases[Bases.FIRST] > 0 ? 'X' : '[]'}</div>
                    </div>
                    <div className="homeplate">[]</div>
                </div>
            </div>
            <div className="count">
                <div>{game.count.balls} - {game.count.strikes}</div>
                <div>{game.outs} {game.outs === 1 ? 'out' : 'outs'}</div>
            </div>
        </div>
    );
};

export default Scoreboard;
