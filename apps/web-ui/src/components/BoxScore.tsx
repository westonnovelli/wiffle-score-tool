import React from "react";
import { GameMoment, InningHalf, Score, Team, teamEarnedHits, teamLOB } from "@wiffleball/state-machine";
import './BoxScore.css';
import NumberInput from "./NumberInput";
import { safeParseInt } from "../helpers";

type BoxScoreProps = {
    boxScore: GameMoment['boxScore'];
    maxInnings: number;
    inningNumber: number;
    inningHalf: InningHalf;
    awayTeam: Team;
    homeTeam: Team;
    setBoxScore?: React.Dispatch<React.SetStateAction<GameMoment['boxScore']>>;
};

// @ts-expect-error
const MAX_SCORE = window.WIFFLE_SCORE_TOOL_SETTINGS?.maxScore ?? 99;

const BoxScore = ({
    boxScore,
    inningNumber,
    inningHalf,
    maxInnings,
    awayTeam,
    homeTeam,
    setBoxScore
}: BoxScoreProps) => {
    const [awayScore, homeScore] = boxScore.reduce((total, inning) => {
        total[0] += inning.awayTeam;
        total[1] += inning.homeTeam;
        return total;
    }, [0, 0]);

    const inningsToShow = Math.max(boxScore.length, maxInnings, inningNumber);
    const inningsDiff = inningsToShow - boxScore.length;
    const editing = Boolean(setBoxScore);

    const updateInning = (half: keyof Score, inning: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        // TODO support adding scores to future innings
        if (inning > boxScore.length || !editing) return;
        setBoxScore?.(prev => {
            const next = [...prev];
            next[inning] = {
                ...next[inning],
                [half]: safeParseInt(e.target.value),
            };
            return next;
        });
    };

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
                        <td>L</td>
                    </tr>
                </thead>
                <tbody>
                    <tr className="awayScore">
                        <th>AWAY</th>
                        {boxScore.map(({ awayTeam }, i) => {
                            const cell = editing
                                ? <NumberInput min="0" max={MAX_SCORE} value={boxScore[i]?.awayTeam ?? 0} onChange={updateInning('awayTeam', i)} />
                                : awayTeam;
                            const isActive = inningNumber === i + 1 && inningHalf === InningHalf.TOP;
                            return (
                                <td key={i} className={`${isActive ? 'active' : ''}`}>{cell}</td>
                            );
                        })}
                        {Array.from(Array(inningsDiff)).map((_, i) => <td key={i}></td>)}
                        <th className="runs">{awayScore}</th>
                        <td>{teamEarnedHits(awayTeam)}</td>
                        <td>{teamLOB(awayTeam)}</td>
                    </tr>
                    <tr className="homeScore">
                        <th>HOME</th>
                        {boxScore.map(({ homeTeam }, i) => {
                            const score = inningNumber === i + 1 && inningHalf === InningHalf.TOP ? '-' : homeTeam;
                            const cell = editing
                                ? <NumberInput min="0" max={MAX_SCORE} value={boxScore[i]?.homeTeam ?? 0} onChange={updateInning('homeTeam', i)} />
                                : score;
                            const isActive = inningNumber === i + 1 && inningHalf === InningHalf.BOTTOM;
                            return (
                                <td key={i} className={`${isActive ? 'active' : ''}`}>{cell}</td>
                            );
                        })}
                        {Array.from(Array(inningsDiff)).map((_, i) => <td key={i}></td>)}
                        <th className="runs">{homeScore}</th>
                        <td>{teamEarnedHits(homeTeam)}</td>
                        <td>{teamLOB(homeTeam)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default BoxScore;
