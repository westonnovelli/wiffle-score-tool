import { Team } from "../types";

export const teamEarnedHits = ({ roster }: Team): number => {
    return Object.values(roster).reduce((acc, { offenseStats }) => {
        acc += offenseStats.hits;
        return acc;
    }, 0);
};

export const teamLOB = ({ roster }: Team): number => {
    return Object.values(roster).reduce((acc, { offenseStats }) => {
        acc += offenseStats.LOB;
        return acc;
    }, 0);
};
