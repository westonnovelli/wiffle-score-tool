import { deserializeTeam } from '@wiffleball/state-machine';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import PageHeader from '../components/PageHeader';
import Structure from '../components/Structure';
import { TEAMS, TEAM_PREFIX } from "../localStorage";
import ShareTeam from './ShareTeam';
import './TeamSummary.css';
import TeamView from './TeamView';

const useTeamFromUrl = () => {
    const location = useLocation();
    const path = location.pathname.split('/');
    const key = path[path.length - 1];
    const lsKey = `${TEAM_PREFIX}${key}`;
    const serializedTeam = useReadLocalStorage<string>(lsKey) ?? '';
    const team = React.useMemo(() => {
        if (!serializedTeam) return undefined;
        return deserializeTeam(serializedTeam);
    }, [serializedTeam]);

    return {
        key: lsKey,
        team,
        serializedTeam,
    };
}

const TeamSummary: React.FC = () => {
    const navigate = useNavigate();

    const { key: lsKey, team, serializedTeam } = useTeamFromUrl();
    const [teamList, setTeamList] = useLocalStorage(`${TEAMS}`, []);

    const href = `${window.location.protocol}//${window.location.host}/team-manager?team=${serializedTeam}`;

    const handleRemove = () => {
        if (window.confirm('Are you sure? This team will be removed from this device.')) {
            localStorage.removeItem(lsKey);
            setTeamList(teamList.filter((id) => id !== team?.id));
            navigate('/team-manager');
        }
    };

    return (
        <Structure className="team-summary" wftitle={<PageHeader title={team?.name ?? 'oops'} destination="/team-manager" />}>
            <TeamView team={team}/>
            <ShareTeam href={href} />
            <button onClick={handleRemove} className="remove">Remove this team</button>
        </Structure>
    );
};

export default TeamSummary;
