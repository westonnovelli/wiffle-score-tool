import Dialog from '@reach/dialog';
import { deserializeTeam } from '@wiffleball/state-machine';
import React from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import { Close } from '../icons';
import { TEAMS, TEAM_PREFIX } from "../localStorage";
import './TeamSummary.css';
import TeamView from './TeamView';
import './ExternalTeam.css';

const ExternalTeam: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [saves, setSaves] = useLocalStorage<string[]>(TEAMS, []);
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    const serializedTeam = searchParams.get('team') ?? '';
    const team = deserializeTeam(serializedTeam);

    const handleImport = () => {
        setSaves([...saves, team.id]);
        localStorage.setItem(`${TEAM_PREFIX}${team.id}`, JSON.stringify(serializedTeam));
        navigate('/team-manager');
    };

    function onDismiss() {
        navigate('/team-manager');
    }

    const duplicate = saves.includes(team.id);

    return (
        <Dialog
            aria-labelledby="label"
            onDismiss={onDismiss}
            initialFocusRef={buttonRef}
        >
            <div className="external-team">
                <h1>{team.name}</h1>
                <button onClick={onDismiss} ref={buttonRef} className="close"><Close /></button>
                <div className="content">
                    <TeamView team={team} />
                    <button onClick={handleImport} className="import" disabled={duplicate}>{duplicate ? 'team already on this device' : 'Save to this device'}</button>
                </div>
            </div>
        </Dialog>
    );
};

export default ExternalTeam;
