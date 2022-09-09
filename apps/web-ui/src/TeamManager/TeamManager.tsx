import { deserializeTeam, Team } from '@wiffleball/state-machine';
import React from 'react';
import { useReadLocalStorage } from 'usehooks-ts';
import { TEAMS, TEAM_PREFIX } from "../localStorage";

const TeamManager: React.FC = () => {
    const localTeamList = useReadLocalStorage<string[]>(TEAMS);

    const localTeams = localTeamList?.map((key) => {
        return localStorage.getItem(`${TEAM_PREFIX}${key}`) ?? '';
    }) ?? [];

    return (
        <div>
            <ul>
                {localTeams.map((serializedTeam: string) => {
                    const team: Team = deserializeTeam(serializedTeam);
                    return (
                        <li key={team.id}>{team.name}</li>
                    );
                })}
            </ul>
        </div>
    );
};

export default TeamManager;
