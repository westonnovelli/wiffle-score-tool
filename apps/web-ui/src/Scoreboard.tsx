import { Bases, GameMoment } from '@wiffleball/state-machine';
import React from 'react';


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
        <div>
            <div className="teams">
                <div>AWAY - {awayScore}</div>
                <div>HOME - {homeScore}</div>
            </div>
            <div className="boxScore">
                <table>
                    <thead><tr><td>AWAY</td><td>HOME</td></tr></thead>
                    <tbody>
                        {game.boxScore.map(({ awayTeam, homeTeam }, i) => {
                            return (
                                <tr key={i}><td>{awayTeam}</td><td>{homeTeam}</td></tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="bases">
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
