import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
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

type PitchInfo = {
    type: 'justpitch' | 'inplayout' | 'inplayboth' | 'inplay';
    label: string;
    subtext?: string;
    description?: string;
    style?: any;
};

const PitchInfoMap: Record<Pitches, PitchInfo> = {
    [Pitches.BALL]: {
        type: 'justpitch',
        label: 'B',
        style: { fontSize: '20px' },
    },
    [Pitches.BALL_WILD]: {
        type: 'justpitch',
        label: 'WP',
        style: { fontSize: '20px' },
    },
    [Pitches.STRIKE_FOUL]: {
        type: 'justpitch',
        label: 'Foul',
    },
    [Pitches.STRIKE_LOOKING]: {
        type: 'inplayout',
        label: 'ꓘ',
        style: { fontSize: '20px' },
    },
    [Pitches.STRIKE_SWINGING]: {
        type: 'justpitch',
        label: 'S',
        style: { fontSize: '20px' },
    },
    [Pitches.STRIKE_FOUL_ZONE]: {
        type: 'inplayout',
        label: 'Foul',
        subtext: 'K',
        style: { fontSize: '14px' },
    },
    [Pitches.STRIKE_FOUL_CAUGHT]: {
        type: 'inplayout',
        label: 'Foul',
        subtext: 'caught',
        style: { fontSize: '14px' },
    },
    [Pitches.INPLAY_INFIELD_AIR_OUT]: {
        type: 'inplayout',
        label: 'Popup',
        subtext: '(out)',
        style: { fontSize: '12px' },
    },
    [Pitches.INPLAY_INFIELD_AIR_OUT_INFIELD_FLY]: {
        type: 'inplayboth',
        label: 'Infield fly',
        style: { fontSize: '12px' },
    },
    [Pitches.INPLAY_INFIELD_GRD_OUT]: {
        type: 'inplayout',
        label: 'Grd out',
        style: { fontSize: '14px' },
    },
    [Pitches.INPLAY_INFIELD_OUT_DP_FAIL]: {
        type: 'inplayboth',
        label: 'FC',
        subtext: '(DP fail)',
        style: { fontSize: '10px' },
    },
    [Pitches.INPLAY_INFIELD_OUT_DP_SUCCESS]: {
        type: 'inplayout',
        label: 'DP',
    },
    [Pitches.INPLAY_INFIELD_SINGLE]: {
        type: 'inplay',
        label: '1B',
        subtext: '(infield)',
        style: { fontSize: '12px' },
    },
    [Pitches.INPLAY_OUTFIELD_OUT]: {
        type: 'inplayout',
        label: 'Fly out',
    },
    [Pitches.INPLAY_OUTFIELD_OUT_TAG_FAIL]: {
        type: 'inplayboth',
        label: 'Fly out',
        subtext: 'thrown out',
        style: { fontSize: '10px' },
    },
    [Pitches.INPLAY_OUTFIELD_OUT_TAG_SUCCESS]: {
        type: 'inplayboth',
        label: 'Fly out',
        subtext: 'tagged',
        style: { fontSize: '12px' },
    },
    [Pitches.INPLAY_OUTFIELD_SINGLE]: {
        type: 'inplay',
        label: '1B',
        style: { fontSize: '20px' },
    },
    [Pitches.INPLAY_DOUBLE]: {
        type: 'inplay',
        label: '2B',
        style: { fontSize: '20px' },
    },
    [Pitches.INPLAY_TRIPLE]: {
        type: 'inplay',
        label: '3B',
        style: { fontSize: '20px' },
    },
    [Pitches.INPLAY_HOMERUN]: {
        type: 'inplay',
        label: 'HR',
        style: { fontSize: '20px' },
    },
    [Pitches.INTERFERENCE]: {
        type: 'inplayboth',
        label: 'I',
        style: { fontSize: '20px' },
    },
}

const variants = {
    hidden: { y: 850, x: 350 },
    show: { y: 0, x: 0 }
};

const animationProps: HTMLMotionProps<"button"> = {
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.95 },
    // transition: { bounce: 0.07 },
};

type PitchButtonProps = PitchInfo & {
    pitch: Pitches;
    disabled: boolean;
    onPitch: (p: Pitches) => void;
};

const PitchButton: React.FC<PitchButtonProps> = ({
    pitch,
    type,
    label,
    subtext,
    style,
    disabled,
    onPitch,
}) => {
    let motionProps: HTMLMotionProps<"button"> = {};
    if (!disabled) {
        motionProps = { ...animationProps };
    }
    return (
        <motion.button
            style={style}
            variants={variants}
            {...motionProps}
            exit={variants.hidden}
            className={`pitch-btn ${type}`}
            onClick={() => onPitch(pitch)}
            disabled={disabled}
            data-pitch={label}
            data-pitchid={pitch}
        >
            {!disabled && (
                <>
                    {label}
                    {subtext && (<div>{subtext}</div>)}
                </>
            )}
        </motion.button>
    );
}

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
    const undoMotionProps = !canUndo && { ...animationProps };
    const redoMotionProps = !canRedo && { ...animationProps };

    const props = (pitch: Pitches) => {
        return {
            ...PitchInfoMap[pitch],
            pitch,
            disabled: !possiblePitches.includes(pitch),
            onPitch,
        };
    };

    return (
        <div className="pitch pitch-menu layout">
            <div className="row">
                <PitchButton {...props(Pitches.BALL)} />
                <PitchButton {...props(Pitches.STRIKE_SWINGING)} />
                <PitchButton {...props(Pitches.STRIKE_LOOKING)} />
                <PitchButton {...props(Pitches.BALL_WILD)} />
            </div>
            <div className="row">
                <PitchButton {...props(Pitches.STRIKE_FOUL)} />
                <PitchButton {...props(Pitches.STRIKE_FOUL_ZONE)} />
                <PitchButton {...props(Pitches.STRIKE_FOUL_CAUGHT)} />
            </div>
            <div className="row">
                <PitchButton {...props(Pitches.INPLAY_INFIELD_SINGLE)} />
                <PitchButton {...props(Pitches.INPLAY_INFIELD_AIR_OUT_INFIELD_FLY)} />
                <PitchButton {...props(Pitches.INPLAY_INFIELD_OUT_DP_FAIL)} />
                <PitchButton {...props(Pitches.INPLAY_OUTFIELD_OUT_TAG_FAIL)} />
            </div>
            <div className="row">
                <PitchButton {...props(Pitches.INPLAY_INFIELD_GRD_OUT)} />
                <PitchButton {...props(Pitches.INPLAY_INFIELD_AIR_OUT)} />
                <PitchButton {...props(Pitches.INPLAY_INFIELD_OUT_DP_SUCCESS)} />
                <PitchButton {...props(Pitches.INPLAY_OUTFIELD_OUT)} />
            </div>
            <div className="row">
                <PitchButton {...props(Pitches.INPLAY_OUTFIELD_SINGLE)} />
                <PitchButton {...props(Pitches.INPLAY_DOUBLE)} />
                <PitchButton {...props(Pitches.INPLAY_TRIPLE)} />
                <PitchButton {...props(Pitches.INPLAY_OUTFIELD_OUT_TAG_SUCCESS)} />
            </div>
            <div className="row">
                <PitchButton {...props(Pitches.INPLAY_HOMERUN)} />
                {(canUndo || canRedo) && (
                    <motion.button
                        key="undo"
                        style={{ gridArea: 'U', fontSize: '12px' }}
                        variants={variants}
                        {...undoMotionProps}
                        exit={variants.hidden}
                        className={`pitch-btn action`}
                        onClick={undo}
                        disabled={!canUndo}
                    >
                        Undo
                        {canUndo && <div>{pitchDescriptions[game.pitches[game.pitches.length - 1]]}</div>}
                    </motion.button>
                )}
                {(canUndo || canRedo) && (
                    <motion.button
                        key="redo"
                        style={{ gridArea: 'R', fontSize: '12px' }}
                        variants={variants}
                        {...redoMotionProps}
                        exit={variants.hidden}
                        className={`pitch-btn action`}
                        onClick={redo}
                        disabled={!canRedo}
                    >
                        Redo
                        {canRedo && <div>{pitchDescriptions[next.pitches[next.pitches.length - 1]]}</div>}
                    </motion.button>
                )}
            </div>
        </div>
    );
};

export default PitchSelector;
