import { deserializeTeam } from '@wiffleball/state-machine';
import React from 'react';
import QRCode from 'react-qr-code';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCopyToClipboard, useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import PageHeader from '../components/PageHeader';
import Structure from '../components/Structure';
import { TEAMS, TEAM_PREFIX } from "../localStorage";
import { allPositions } from '../translations';
import './TeamSummary.css';

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

    const [value, copy] = useCopyToClipboard();

    const href = `${window.location.protocol}//${window.location.host}?team=${serializedTeam}`;

    const handleCopy = () => copy(href);

    const handleRemove = () => {
        if (window.confirm('Are you sure? This team will be removed from this device.')) {
            localStorage.removeItem(lsKey);
            setTeamList(teamList.filter((id) => id !== team?.id));
            navigate('/team-manager');
        }
    };

    return (
        <Structure className="team-summary" wftitle={<PageHeader title={team?.name ?? 'oops'} destination="/team-manager" />}>
            <ol>
                {team?.startingLineup.map((id) => {
                    return (
                        <li key={id}>
                            <div className="player">
                                <div className="drag-handle-placeholder"/>
                                <div className="name">{team?.roster[id]?.name}</div>
                                <div className="position">
                                    {allPositions.find(({ value }) => value === team?.startingDefense[id])?.label}
                                </div>
                                <div className="remove-btn-placeholder"/>
                            </div>
                        </li>
                    );
                })}
            </ol>
            <div className="share">
                <div className="qr-container">
                    <QRCode value={href} />
                </div>
                <button onClick={handleCopy}>Copy to clipboard</button>
                {value === href && <div className="confirm">Copied!</div>}
                <input value={href} onFocus={(e) => void e.target?.select()} onChange={() => {}}/>
            </div>
            <button onClick={handleRemove} className="remove">Remove this team</button>
        </Structure>
    );
};

export default TeamSummary;
