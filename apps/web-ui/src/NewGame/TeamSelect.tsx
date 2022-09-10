import Dialog from '@reach/dialog';
import React from 'react';
import { Close } from '../icons';
import { TeamList } from '../TeamManager/TeamManager';
import '../TeamManager/TeamList.css';
import { Team } from '@wiffleball/state-machine';

interface Props {
    whichTeam: string;
    onDismiss: () => void;
    onSelect: (team: Team) => void;
}

const TeamSelect: React.FC<Props> = ({ whichTeam, onDismiss, onSelect }) => {
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    return (
        <Dialog
            aria-labelledby="label"
            onDismiss={onDismiss}
            initialFocusRef={buttonRef}
        >
            <div className="external-team">
                <h1>{`Select ${whichTeam} team`}</h1>
                <button onClick={onDismiss} ref={buttonRef} className="close"><Close /></button>
                <div className="content">
                    <TeamList onClick={(team) => onSelect(team)}/>
                </div>
            </div>
        </Dialog >
    );
};

export default TeamSelect;
