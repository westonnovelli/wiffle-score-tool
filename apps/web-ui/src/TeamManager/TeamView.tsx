import { Team } from '@wiffleball/state-machine';
import React from 'react';
import { allPositions } from '../translations';
import './TeamView.css';

interface Props {
    team?: Team;
}

const TeamView: React.FC<Props> = ({ team }) => {
    if (!team) return null;
    return (
        <ol className="team-view">
            {team?.startingLineup.map((id) => {
                return (
                    <li key={id}>
                        <div className="player">
                            <div className="drag-handle-placeholder" />
                            <div className="name">{team?.roster[id]?.name}</div>
                            <div className="position">
                                {allPositions.find(({ value }) => value === team?.startingDefense[id])?.label}
                            </div>
                            <div className="remove-btn-placeholder" />
                        </div>
                    </li>
                );
            })}
        </ol>
    );
};

export default TeamView;
