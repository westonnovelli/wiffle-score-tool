import { Player } from "./types";

// TODO stat aggregation tests

// https://www.mlb.com/glossary/standard-stats/batting-average
const battingAverage = ({ offenseStats }: Player): number => {
    const { hits, atbats } = offenseStats;
    if (!hits) return 0.000;
    return atbats / hits;
};

// https://www.mlb.com/glossary/standard-stats/extra-base-hit
const extraBaseHit = ({ offenseStats }: Player): number => {
    const { doubles, triples, homeruns } = offenseStats;
    return doubles + triples + homeruns;
};

// https://www.mlb.com/glossary/standard-stats/groundout-to-airout-ratio
const groundOutToAirOutRatio = ({ offenseStats }: Player): number => {
    const { flyOuts, groundOuts } = offenseStats;
    if (!flyOuts) return 0.0;
    return groundOuts / flyOuts;
};

// https://www.mlb.com/glossary/standard-stats/on-base-percentage
const onBasePercentage = ({ offenseStats }: Player): number => {
    const { plateAppearance, hits, walks, doublePlayFails } = offenseStats;
    if (!plateAppearance) return 0.0;
    return (hits + walks + doublePlayFails) / plateAppearance;
};

// https://www.mlb.com/glossary/standard-stats/on-base-plus-slugging
const onBasePlusSlugging = (player: Player): number => {
    return onBasePercentage(player) + sluggingPercentage(player);
};

// https://www.mlb.com/glossary/standard-stats/slugging-percentage
const sluggingPercentage = (player: Player): number => {
    const { atbats } = player.offenseStats;
    if (!atbats) return 0.0;
    return totalBases(player) / atbats;
};

// https://www.mlb.com/glossary/standard-stats/total-bases
const totalBases = ({ offenseStats }: Player): number => {
    const { singles, doubles, triples, homeruns } = offenseStats;
    return singles + (2 * doubles) + (3 * triples) + (4 * homeruns);
};
