import { Pitches } from '@wiffleball/state-machine';
import React from 'react';

interface Props {
    onPitch: (p: Pitches) => void
}

const PitchSelector: React.FC<Props> = ({ onPitch }) => {
    return (
        <button onClick={() => onPitch(Pitches.BALL)}>Pitch</button>
    );
};

export default PitchSelector;
