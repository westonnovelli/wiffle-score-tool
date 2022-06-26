import React from 'react';
import { Pitches } from '@wiffleball/state-machine';
import './Pitch.css';

interface Props {
    onPitch: (p: Pitches) => void;
    possiblePitches?: number[];
}

type PitchList = {
    pitch: Pitches;
    gridArea: string;
    type: 'justpitch' | 'inplayout' | 'inplayboth' | 'inplay';
    label: string;
    subtext?: string;
    description?: string;
}[];

const PITCH_LIST: PitchList = [
    {
        pitch: Pitches.BALL,
        gridArea: 'B',
        type: 'justpitch',
        label: 'B',
    }, {
        pitch: Pitches.BALL_WILD,
        gridArea: 'W',
        type: 'justpitch',
        label: 'WP',
    }, {
        pitch: Pitches.STRIKE_SWINGING,
        gridArea: 'S',
        type: 'justpitch',
        label: 'S',
    }, {
        pitch: Pitches.STRIKE_LOOKING,
        gridArea: 'K',
        type: 'inplayout',
        label: 'ꓘ',
    }, {
        pitch: Pitches.STRIKE_FOUL,
        gridArea: 'F',
        type: 'justpitch',
        label: 'Foul',
    }, {
        pitch: Pitches.STRIKE_FOUL_ZONE,
        gridArea: 'Z',
        type: 'inplayout',
        label: 'Foul',
        subtext: 'K',
    }, {
        pitch: Pitches.STRIKE_FOUL_CAUGHT,
        gridArea: 'Q',
        type: 'inplayout',
        label: 'Foul',
        subtext: 'caught',

    }, {
        pitch: Pitches.INPLAY_INFIELD_GRD_OUT,
        gridArea: 'G',
        type: 'inplayout',
        label: 'Grd out',
    }, {
        pitch: Pitches.INPLAY_INFIELD_AIR_OUT,
        gridArea: 'A',
        type: 'inplayout',
        label: 'Popup',
        subtext: '(out)',
    }, {
        pitch: Pitches.INPLAY_INFIELD_AIR_OUT_INFIELD_FLY,
        gridArea: 'I',
        type: 'inplayboth',
        label: 'Infield fly',
    }, {
        pitch: Pitches.INPLAY_INFIELD_OUT_DP_SUCCESS,
        gridArea: 'D',
        type: 'inplayout',
        label: 'DP',
    }, {
        pitch: Pitches.INPLAY_INFIELD_OUT_DP_FAIL,
        gridArea: 'C',
        type: 'inplayboth',
        label: 'FC',
        subtext: '(DP fail)',
    }, {
        pitch: Pitches.INPLAY_INFIELD_ERROR,
        gridArea: 'E',
        type: 'inplay',
        label: 'Error',
        subtext: 'single',
    }, {
        pitch: Pitches.INPLAY_OUTFIELD_OUT,
        gridArea: 'Y',
        type: 'inplayout',
        label: 'Fly out',
    }, {
        pitch: Pitches.INPLAY_OUTFIELD_OUT_TAG_SUCCESS,
        gridArea: 'T',
        type: 'inplayboth',
        label: 'Fly out',
        subtext: 'runner tagged',
    }, {
        pitch: Pitches.INPLAY_OUTFIELD_OUT_TAG_FAIL,
        gridArea: 'O',
        type: 'inplayboth',
        label: 'Fly out',
        subtext: 'runner thrown out',
    }, {
        pitch: Pitches.INPLAY_INFIELD_SINGLE,
        gridArea: 'L',
        type: 'inplay',
        label: '1B',
        subtext: '(infield)',
    }, {
        pitch: Pitches.INPLAY_OUTFIELD_SINGLE,
        gridArea: 'single',
        type: 'inplay',
        label: '1B',
    }, {
        pitch: Pitches.INPLAY_DOUBLE,
        gridArea: 'double',
        type: 'inplay',
        label: '2B',
    }, {
        pitch: Pitches.INPLAY_TRIPLE,
        gridArea: 'triple',
        type: 'inplay',
        label: '3B',
    }, {
        pitch: Pitches.INPLAY_HOMERUN,
        gridArea: 'H',
        type: 'inplay',
        label: 'HR',
    }
];

// @ts-expect-error
window.pitchlayout = 'layout2';

const PitchSelector: React.FC<Props> = ({ onPitch, possiblePitches = [] }) => {
    return (
        <div className={'pitch pitch-menu ' + 
            // @ts-expect-error
            `${window.pitchlayout}`
        }>
            {PITCH_LIST.map(({ pitch, gridArea, type, label, subtext }) =>
                <button
                    key={pitch}
                    className={`pitch-btn ${type}`}
                    style={{ gridArea }}
                    onClick={() => onPitch(pitch)}
                    disabled={possiblePitches.includes(pitch)}
                >
                        {label}
                        {subtext && (<div>{subtext}</div>)}
                </button>
            )}
        </div >
    );
};

export default PitchSelector;
