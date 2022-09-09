import { deserializeTeam, Team } from '@wiffleball/state-machine';
import React from 'react';
import { useReadLocalStorage } from 'usehooks-ts';
import MenuItem from '../components/MenuItem';
import PageHeader from '../components/PageHeader';
import Structure from '../components/Structure';
import { TEAMS, TEAM_PREFIX } from "../localStorage";

const TeamManager: React.FC = () => {
    const localTeamList = useReadLocalStorage<string[]>(TEAMS);

    const localTeams = localTeamList?.map((key) => {
        return localStorage.getItem(`${TEAM_PREFIX}${key}`) ?? '';
    }) ?? [];

    return (
        <Structure className="menu" wftitle={<PageHeader title="Team Manager" destination="/" />}>
            <ul>
                {localTeams.map((serializedTeam: string) => {
                    const team: Team = deserializeTeam(serializedTeam);
                    return (
                        <MenuItem label={team.name} />
                    );
                })}
            </ul>
        </Structure>
    );
};

export default TeamManager;
