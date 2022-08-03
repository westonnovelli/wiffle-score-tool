import React from 'react';
import { motion } from 'framer-motion';
import { GameMoment, Pitches } from '@wiffleball/state-machine';
import './Pitch.css';
import { pitchDescriptions } from '../helpers';

interface Props {
    onPitch: (p: Pitches) => void;
    possiblePitches?: number[];
    game: GameMoment;
    next: GameMoment;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

type PitchList = {
    pitch: Pitches;
    gridArea: string;
    type: 'justpitch' | 'inplayout' | 'inplayboth' | 'inplay';
    label: string;
    subtext?: string;
    description?: string;
    style?: any;
}[];

const PITCH_LIST: PitchList = [
    {
        pitch: Pitches.BALL,
        gridArea: 'B',
        type: 'justpitch',
        label: 'B',
        style: { fontSize: '20px' },
    },
    {
        pitch: Pitches.STRIKE_FOUL,
        gridArea: 'F',
        type: 'justpitch',
        label: 'Foul',
    },
    {
        pitch: Pitches.STRIKE_FOUL_ZONE,
        gridArea: 'Z',
        type: 'inplayout',
        label: 'Foul',
        subtext: 'K',
    },
    {
        pitch: Pitches.STRIKE_SWINGING,
        gridArea: 'S',
        type: 'justpitch',
        label: 'S',
        style: { fontSize: '20px' },
    },
    {
        pitch: Pitches.INPLAY_INFIELD_GRD_OUT,
        gridArea: 'G',
        type: 'inplayout',
        label: 'Grd out',
    },
    {
        pitch: Pitches.INPLAY_INFIELD_OUT_DP_SUCCESS,
        gridArea: 'D',
        type: 'inplayout',
        label: 'DP',
    },
    {
        pitch: Pitches.INPLAY_INFIELD_OUT_DP_FAIL,
        gridArea: 'C',
        type: 'inplayboth',
        label: 'FC',
        subtext: '(DP fail)',
        style: { fontSize: '10px' },
    },
    {
        pitch: Pitches.STRIKE_FOUL_CAUGHT,
        gridArea: 'Q',
        type: 'inplayout',
        label: 'Foul',
        subtext: 'caught',

    },
    {
        pitch: Pitches.STRIKE_LOOKING,
        gridArea: 'K',
        type: 'inplayout',
        label: 'ꓘ',
        style: { fontSize: '20px' },
    },
    {
        pitch: Pitches.INPLAY_INFIELD_SINGLE,
        gridArea: 'L',
        type: 'inplay',
        label: '1B',
        subtext: '(infield)',
    },
    {
        pitch: Pitches.INPLAY_INFIELD_AIR_OUT,
        gridArea: 'A',
        type: 'inplayout',
        label: 'Popup',
        subtext: '(out)',
    },
    {
        pitch: Pitches.INPLAY_INFIELD_AIR_OUT_INFIELD_FLY,
        gridArea: 'I',
        type: 'inplayboth',
        label: 'Infield fly',
    },
    {
        pitch: Pitches.INPLAY_OUTFIELD_OUT,
        gridArea: 'Y',
        type: 'inplayout',
        label: 'Fly out',
    },
    {
        pitch: Pitches.INPLAY_OUTFIELD_OUT_TAG_FAIL,
        gridArea: 'O',
        type: 'inplayboth',
        label: 'Fly out',
        subtext: 'thrown out',
        style: { fontSize: '10px' },
    },
    {
        pitch: Pitches.BALL_WILD,
        gridArea: 'W',
        type: 'justpitch',
        label: 'WP',
        style: { fontSize: '20px' },
    },    
    {
        pitch: Pitches.INPLAY_OUTFIELD_SINGLE,
        gridArea: 'single',
        type: 'inplay',
        label: '1B',
        style: { fontSize: '20px' },
    },
    {
        pitch: Pitches.INPLAY_DOUBLE,
        gridArea: 'double',
        type: 'inplay',
        label: '2B',
        style: { fontSize: '20px' },
    },
    {
        pitch: Pitches.INPLAY_TRIPLE,
        gridArea: 'triple',
        type: 'inplay',
        label: '3B',
        style: { fontSize: '20px' },
    },
    {
        pitch: Pitches.INPLAY_OUTFIELD_OUT_TAG_SUCCESS,
        gridArea: 'T',
        type: 'inplayboth',
        label: 'Fly out',
        subtext: 'tagged',
        style: { fontSize: '10px' },
    },
    {
        pitch: Pitches.INPLAY_HOMERUN,
        gridArea: 'H',
        type: 'inplay',
        label: 'HR',
        style: { fontSize: '20px' },
    },
    // {
    //     pitch: Pitches.INTERFERENCE,
    //     gridArea: '_ERROR_',
    //     type: 'inplayboth',
    //     label: 'I',
    //     style: { fontSize: '20px' },
    // },
];

const variants = {
    hidden: { y: 850, x: 350},
    show: { y: 0, x: 0 }
};

const PitchSelector: React.FC<Props> = ({
    onPitch,
    possiblePitches = [],
    game,
    next,
    undo,
    redo,
    canUndo,
    canRedo,
}) => {
    return (
        <div className="pitch pitch-menu layout">
            {PITCH_LIST.map(({ pitch, gridArea, type, label, subtext, style }) =>
                <motion.div
                    key={pitch}
                    style={{ gridArea }}
                    variants={variants}
                    // transition={{ bounce: 1, velocity: 2  }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    exit={variants.hidden}
                >
                    <button
                        className={`pitch-btn ${type}`}
                        onClick={() => onPitch(pitch)}
                        disabled={!possiblePitches.includes(pitch)}
                        style={style}
                        data-pitch={label}
                        data-pitchid={pitch}
                    >
                        {label}
                        {subtext && (<div>{subtext}</div>)}
                    </button>
                </motion.div>
            )}
            {(canUndo || canRedo) && (
                <motion.div
                    key="undo"
                    style={{ gridArea: 'U' }}
                    variants={variants}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    exit={variants.hidden}
                >
                    <button
                        className={`pitch-btn action`}
                        onClick={undo}
                        disabled={!canUndo}
                    >
                        Undo
                        {canUndo && <div>{pitchDescriptions[game.pitches[game.pitches.length - 1]]}</div>}
                    </button>
                </motion.div>
            )}
            {(canUndo || canRedo) && (
                <motion.div
                    key="redo"
                    style={{ gridArea: 'R' }}
                    variants={variants}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    exit={variants.hidden}
                >
                    <button
                        className={`pitch-btn action`}
                        onClick={redo}
                        disabled={!canRedo}
                    >
                        Redo
                        {canRedo && <div>{pitchDescriptions[next.pitches[next.pitches.length - 1]]}</div>}
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default PitchSelector;
