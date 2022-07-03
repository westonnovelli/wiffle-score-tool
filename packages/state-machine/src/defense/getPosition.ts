import { Position, Team } from "../types";

export const getPosition = (team: Team, pos: Position): string[] => {
    return Object.entries(team.defense).reduce<string[]>((acc, [id, position]) => {
        if (position === pos) {
            acc.push(id);
        }
        return acc;
    }, []);
};

export const getPitcher = (team: Team): string => getPosition(team, Position.Pitcher)[0];
export const getInfield = (team: Team): string[] => getPosition(team, Position.Infield);
export const getOutfield = (team: Team): string[] => getPosition(team, Position.Outfield);
export const getBench = (team: Team): string[] => getPosition(team, Position.Bench);
