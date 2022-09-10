import { deserializeTeam, Team } from '@wiffleball/state-machine';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import MenuItem from '../components/MenuItem';
import PageHeader from '../components/PageHeader';
import Structure from '../components/Structure';
import { TEAMS, TEAM_PREFIX } from "../localStorage";
import './TeamManager.css';

const TeamManager: React.FC = () => {
    const navigate = useNavigate();
    const localTeamList = useReadLocalStorage<string[]>(TEAMS);

    const localTeams = localTeamList?.map((key) => {
        return JSON.parse(localStorage.getItem(`${TEAM_PREFIX}${key}`) ?? '');
    }) ?? [];

    return (
        <Structure className="team-manager" wftitle={<PageHeader title="Team Manager" destination="/" />}>
            <ul>
                {localTeams.map((serializedTeam: string) => {
                    const team: Team = deserializeTeam(serializedTeam);
                    return (
                        <MenuItem label={team.name} onClick={() => navigate(team.id)} key={team.id}/>
                    );
                })}
            </ul>
            {localTeams.length === 0 && (
                <div className="empty">No saved teams</div>
            )}
        </Structure>
    );
};

export default TeamManager;
