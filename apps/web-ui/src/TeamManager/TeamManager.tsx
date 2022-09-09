import React from 'react';
import { useReadLocalStorage } from 'usehooks-ts';
import { TEAMS, TEAM_PREFIX } from "../localStorage";

const deserializeTeam = (team: string) => {/* TODO */};

const TeamManager: React.FC = () => {
    const localTeamList = useReadLocalStorage<string[]>(TEAMS);

    const localTeams = localTeamList?.map((key) => {
        return localStorage.getItem(`${TEAM_PREFIX}${key}`) ?? '';
    }) ?? [];

    return (
        <div>
            <ul>
                {localTeams.map((team: string) => {
                    const teamObj = deserializeTeam(team);
                    return (
                        <li key={team.id}>{team.name}</li>
                    );
                })}
            </ul>
        </div>
    );
};

export default TeamManager;
