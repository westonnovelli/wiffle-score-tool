import { Bases, GameMoment, getDefense, InningHalf, Score } from '@wiffleball/state-machine';
import React from 'react';
import './Scoreboard.css';


interface Props {
    game: GameMoment;
}

const Scoreboard: React.FC<Props> = ({ game }) => {


    return (
        <div className="scoreboard">
            <BoxScore
                maxInnings={game.configuration.maxInnings}
                inningNumber={game.inning.number}
                inningHalf={game.inning.half}
                boxScore={game.boxScore}
            />
            <BasesRender
                first={game.bases[Bases.FIRST]}
                second={game.bases[Bases.SECOND]}
                third={game.bases[Bases.THIRD]}
            />
            <Count
                inningHalf={game.inning.half}
                inningNumber={game.inning.number}
                balls={game.count.balls}
                strikes={game.count.strikes}
                outs={game.outs}
            />
            <Players batter={game.atBat} pitcher={getDefense(game).defense.pitcher} />
        </div >
    );
};

type BoxScoreProps = {
    maxInnings: number;
    inningNumber: number;
    inningHalf: InningHalf;
    boxScore: GameMoment['boxScore'];
};

const BoxScore = ({ inningNumber, inningHalf, maxInnings, boxScore }: BoxScoreProps) => {
    const [awayScore, homeScore] = boxScore.reduce((total, inning) => {
        total[0] += inning.awayTeam;
        total[1] += inning.homeTeam;
        return total;
    }, [0, 0]);

    const inningsToShow = Math.max(boxScore.length, maxInnings);
    const inningsDiff = inningsToShow - boxScore.length;
    // TODO animate box score
    return (
        <div className="boxScore">
            <table>
                <thead>
                    <tr>
                        <td></td>
                        {Array.from(Array(inningsToShow)).map((_, i) => (
                            <td key={i}>{i + 1}</td>
                        ))}
                        <td className="runs">R</td>
                        <td>H</td>
                        <td>E</td>
                    </tr>
                </thead>
                <tbody>
                    <tr className="awayScore">
                        <th>AWAY</th>
                        {boxScore.map(({ awayTeam }, i) => {
                            return (
                                <td
                                    key={i}
                                    className={`${inningNumber === i + 1 && inningHalf === InningHalf.TOP
                                        ? 'active' : ''
                                        }`}
                                >{awayTeam}</td>
                            );
                        })}
                        {Array.from(Array(inningsDiff)).map((_, i) => (
                            <td key={i}></td>
                        ))}
                        <th className="runs">{awayScore}</th>
                        <td>0</td>
                        <td>0</td>
                    </tr>
                    <tr className="homeScore">
                        <th>HOME</th>
                        {boxScore.map(({ homeTeam }, i) => {
                            return (
                                <td
                                    key={i}
                                    className={`${inningNumber === i + 1 && inningHalf === InningHalf.BOTTOM
                                        ? 'active' : ''
                                        }`}
                                >{homeTeam}</td>
                            );
                        })}
                        {Array.from(Array(inningsDiff)).map((_, i) => (
                            <td key={i}></td>
                        ))}
                        <th className="runs">{homeScore}</th>
                        <td>0</td>
                        <td>0</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

interface BasesProps {
    first: number;
    second: number;
    third: number;
}

const BasesRender = React.memo(({ first, second, third }: BasesProps) => (
    /* TODO animate base occupation */
    <div className="bases">
        {/* <div className="crosshair vertical"></div> */}
        {/* <div className="crosshair horizontal"></div> */}
        <div className="base firstbase"><div className={`${first > 0 ? 'occupied' : ''}`} /></div>
        <div className="base secondbase"><div className={`${second > 0 ? 'occupied' : ''}`} /></div>
        <div className="base thirdbase"><div className={`${third > 0 ? 'occupied' : ''}`} /></div>
        <div className={`homeplate`}><div /></div>
    </div>
));

interface CountProps {
    inningHalf: InningHalf;
    inningNumber: number;
    balls: number;
    strikes: number;
    outs: number;
}

const Count = React.memo(({
    inningHalf,
    inningNumber,
    balls,
    strikes,
    outs
}: CountProps) => (
    /* TODO animate count ticks, etc */
    <div className="count">
        <div><span>{inningHalf === InningHalf.TOP ? '▲' : '▼'}</span>{inningNumber}</div>
        <div>{balls} - {strikes}</div>
        <div>{outs} {outs === 1 ? 'out' : 'outs'}</div>
    </div>
));

interface PlayersProps {
    batter: string;
    pitcher: string;
}

const Players = React.memo(({ batter, pitcher }: PlayersProps) => (
    <div className="players">
        <div><span>batting:</span> {batter}</div>
        <div><span>pitching:</span> {pitcher} </div>
    </div>
));

export default Scoreboard;
