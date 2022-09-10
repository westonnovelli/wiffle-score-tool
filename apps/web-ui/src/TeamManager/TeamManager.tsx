import { deserializeTeam, Team } from '@wiffleball/state-machine';
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import MenuItem from '../components/MenuItem';
import PageHeader from '../components/PageHeader';
import Structure from '../components/Structure';
import { TEAMS, TEAM_PREFIX } from "../localStorage";
import ExternalTeam from './ExternalTeam';
import './TeamManager.css';

const TeamManager: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const localTeamList = useReadLocalStorage<string[]>(TEAMS);

    const localTeams = localTeamList?.map((key) => {
        return JSON.parse(localStorage.getItem(`${TEAM_PREFIX}${key}`) ?? '');
    }) ?? [];

    const hasExternalTeam = Boolean(searchParams.get('team'));

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
            {hasExternalTeam && <ExternalTeam />}
        </Structure>
    );
};

export default TeamManager;
