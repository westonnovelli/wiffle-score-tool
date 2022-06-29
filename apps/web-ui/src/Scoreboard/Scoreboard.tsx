import {
    Bases,
    GameMoment,
    getOffense,
    getDefense,
    getPitcher,
    InningHalf
} from '@wiffleball/state-machine';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import './Scoreboard.css';

interface Props {
    game: GameMoment;
}

const Scoreboard: React.FC<Props> = ({ game }) => {
    // todo animate enter/exit of each section
    const offenseRoster = getOffense(game).roster;
    const defenseRoster = getDefense(game).roster;
    const pitcher = defenseRoster[getPitcher(getDefense(game))]?.name ?? `cannot find pitcher`;
    const batter = offenseRoster[game.atBat]?.name ?? `cannot find batter ${game.atBat}`;

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
            <Players batter={batter} pitcher={pitcher} inningHalf={game.inning.half} />
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

interface AnimatedNumberProps {
    children: React.ReactNode;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ children }) => {
    return (
        <motion.span
            key={children?.toString()}
            exit={{ y: 50, opacity: 0, position: "absolute" }}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
                ease: "easeOut",
                delay: .35,
                duration: .5,
            }}
            className="number"
        >
            {children}
        </motion.span>);
};

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
    <AnimatePresence>
        <div className="count">
            <div>
                <span className="icon">{inningHalf === InningHalf.TOP ? '▲' : '▼'}</span>
                <AnimatedNumber>{inningNumber}</AnimatedNumber>
            </div>
            <div>
                <AnimatedNumber>{balls}</AnimatedNumber>
                {' - '}
                <AnimatedNumber>{strikes}</AnimatedNumber>
            </div>
            <div><AnimatedNumber>{outs}</AnimatedNumber> {outs === 1 ? 'out' : 'outs'}</div>
        </div>
    </AnimatePresence>
));

interface AnimatedNameProps {
    children: React.ReactNode;
}

const AnimatedName: React.FC<AnimatedNameProps> = ({ children }) => {
    return (
        <motion.span
            key={children?.toString()}
            exit={{ x: -100, opacity: 0, position: "absolute" }}
            initial={{ x: 100 }}
            animate={{
                x: 0,
                transition: {
                    ease: "easeOut",
                    delay: .35,
                    duration: 1,
                }
            }}
            className="name"
        >
            {children}
        </motion.span>);
};

interface PlayersProps {
    batter: string;
    pitcher: string;
    inningHalf: InningHalf;
}

const Players = React.memo(({ batter, pitcher, inningHalf }: PlayersProps) => (
    <AnimatePresence>
        <div className="players">
            <div className={`batter ${inningHalf === InningHalf.TOP ? 'away' : 'home'}`}>
                <span>AB:</span> <AnimatedName>{batter}</AnimatedName>
            </div>
            <div className={`pitcher ${inningHalf === InningHalf.BOTTOM ? 'away' : 'home'}`}>
                <span>P:</span> <AnimatedName>{pitcher}</AnimatedName>
            </div>
        </div>
    </AnimatePresence>
));

export default Scoreboard;
