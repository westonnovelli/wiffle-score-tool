import { Player } from "../types";

// TODO stat aggregation tests

// https://www.mlb.com/glossary/standard-stats/batting-average
export const battingAverage = ({ offenseStats }: Player): number => {
    const { hits, atbats } = offenseStats;
    if (!atbats) return 0.000;
    return hits / atbats;
};

// https://www.mlb.com/glossary/standard-stats/extra-base-hit
export const extraBaseHit = ({ offenseStats }: Player): number => {
    const { doubles, triples, homeruns } = offenseStats;
    return doubles + triples + homeruns;
};

// https://www.mlb.com/glossary/standard-stats/groundout-to-airout-ratio
export const groundOutToAirOutRatio = ({ offenseStats }: Player): number => {
    const { flyOuts, groundOuts } = offenseStats;
    if (!flyOuts) return 0.0;
    return groundOuts / flyOuts;
};

// https://www.mlb.com/glossary/standard-stats/on-base-percentage
export const onBasePercentage = ({ offenseStats }: Player): number => {
    const { plateAppearance, hits, walks, doublePlayFails } = offenseStats;
    if (!plateAppearance) return 0.0;
    return (hits + walks + doublePlayFails) / plateAppearance;
};

// https://www.mlb.com/glossary/standard-stats/on-base-plus-slugging
export const onBasePlusSlugging = (player: Player): number => {
    return onBasePercentage(player) + sluggingPercentage(player);
};

// https://www.mlb.com/glossary/standard-stats/slugging-percentage
export const sluggingPercentage = (player: Player): number => {
    const { atbats } = player.offenseStats;
    if (!atbats) return 0.0;
    return totalBases(player) / atbats;
};

// https://www.mlb.com/glossary/standard-stats/total-bases
export const totalBases = ({ offenseStats }: Player): number => {
    const { singles, doubles, triples, homeruns } = offenseStats;
    return singles + (2 * doubles) + (3 * triples) + (4 * homeruns);
};

// https://www.mlb.com/glossary/standard-stats/number-of-pitches
export const pitchCount = ({ defenseStats }: Player): number => {
    return 0; // TODO
};

// https://www.mlb.com/glossary/standard-stats/appearance
export const appearances = ({ defenseStats }: Player): number => {
    return 0;
};

// https://www.mlb.com/glossary/standard-stats/earned-run-average
export const earnedRunAverages = ({ defenseStats }: Player): number => {
    return 0.0;
};

// https://www.mlb.com/glossary/standard-stats/relief-win
export const reliefWins = ({ defenseStats }: Player): number => {
    return 0;
};

// https://www.mlb.com/glossary/standard-stats/save
export const saves = ({ defenseStats }: Player): number => {
    return 0;
};

// https://www.mlb.com/glossary/standard-stats/save-percentage
export const savePercentage = ({ defenseStats }: Player): number => {
    return 0.0;
};

// https://www.mlb.com/glossary/standard-stats/shutout
export const shutouts = ({ defenseStats }: Player): number => {
    return 0;
};

// https://www.mlb.com/glossary/standard-stats/walks-and-hits-per-inning-pitched
export const walksAndHitsPerInningPitched = (player: Player): number => {
    const innings = inningsPitched(player);
    if (!innings) return 0.0;
    const { walks } = player.defenseStats.pitching;
    return (walks + hits(player)) / innings;
};

// https://www.mlb.com/glossary/standard-stats/win
export const wins = ({ defenseStats }: Player): number => {
    return 0;
};

// https://www.mlb.com/glossary/standard-stats/winning-percentage
export const winningPercentage = ({ defenseStats }: Player): number => {
    return 0.0;
};

// https://www.mlb.com/glossary/standard-stats/fielding-percentage
export const fieldingPercentage = ({ defenseStats }: Player): number => {
    return 0.0;
};

export const outs = ({ defenseStats }: Player): number => {
    const { strikeoutsLooking, strikeoutsSwinging, groundOuts, flyOuts } = defenseStats.pitching;
    return strikeoutsLooking + strikeoutsSwinging + groundOuts + flyOuts;
};

export const hits = ({ defenseStats }: Player): number => {
    const { singles, doubles, triples, homeruns } = defenseStats.pitching;
    return singles + doubles + triples + homeruns;
};

export const inningsPitched = (player: Player): number => {
    return outs(player) / 3.0;
};
