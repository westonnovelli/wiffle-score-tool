import React from 'react';
import { Pitches } from '@wiffleball/state-machine';
import './Pitch.css';

interface Props {
    onPitch: (p: Pitches) => void
}

const PitchSelector: React.FC<Props> = ({ onPitch }) => {
    return (
        <div className="pitch pitch-menu"style={{
            display: 'grid',
            gridTemplateAreas: '"B S K" "W F Z" ". Q ." "G . E" "A I L" "Y T single" ". O double" "D . triple" "C . H"',
            gridTemplateColumns: 'repeat(3, 80px)',
            gridTemplateRows: 'repeat(9, 80px)',
            gap: '8px',
            margin: '16px'
        }}
        >
            <button className="pitch-btn" style={{ gridArea: 'B' }} onClick={() => onPitch(Pitches.BALL)}>B</button>
            <button className="pitch-btn" style={{ gridArea: 'W' }} onClick={() => onPitch(Pitches.BALL_WILD)}>WP</button>
            <button className="pitch-btn" style={{ gridArea: 'S' }} onClick={() => onPitch(Pitches.STRIKE_SWINGING)}>S</button>
            <button className="pitch-btn" style={{ gridArea: 'K' }} onClick={() => onPitch(Pitches.STRIKE_LOOKING)}>ꓘ</button>
            <button className="pitch-btn" style={{ gridArea: 'F' }} onClick={() => onPitch(Pitches.STRIKE_FOUL)}>Foul</button>
            <button className="pitch-btn" style={{ gridArea: 'Z' }} onClick={() => onPitch(Pitches.STRIKE_FOUL_ZONE)}>F <div>(K)</div></button>
            <button className="pitch-btn" style={{ gridArea: 'Q' }} onClick={() => onPitch(Pitches.STRIKE_FOUL_CAUGHT)}>Foul <div>caught</div></button >
            <button className="pitch-btn" style={{ gridArea: 'G' }} onClick={() => onPitch(Pitches.INPLAY_INFIELD_GRD_OUT)}>Grd out</button>
            <button className="pitch-btn" style={{ gridArea: 'A' }} onClick={() => onPitch(Pitches.INPLAY_INFIELD_AIR_OUT)}>Popup <div>(out)</div></button >
            <button className="pitch-btn" style={{ gridArea: 'I' }} onClick={() => onPitch(Pitches.INPLAY_INFIELD_AIR_OUT_INFIELD_FLY)}>Infield Fly</button>
            <button className="pitch-btn" style={{ gridArea: 'D' }} onClick={() => onPitch(Pitches.INPLAY_INFIELD_OUT_DP_SUCCESS)}>DP</button>
            <button className="pitch-btn" style={{ gridArea: 'C' }} onClick={() => onPitch(Pitches.INPLAY_INFIELD_OUT_DP_FAIL)}>FC <div>(DP fail)</div></button >
            <button className="pitch-btn" style={{ gridArea: 'E' }} onClick={() => onPitch(Pitches.INPLAY_INFIELD_ERROR)}>Error</button>
            <button className="pitch-btn" style={{ gridArea: 'Y' }} onClick={() => onPitch(Pitches.INPLAY_OUTFIELD_OUT)}>Fly Out</button>
            <button className="pitch-btn" style={{ gridArea: 'T' }} onClick={() => onPitch(Pitches.INPLAY_OUTFIELD_OUT_TAG_SUCCESS)}>Fly Out <div>runner tagged</div></button >
            <button className="pitch-btn" style={{ gridArea: 'O' }} onClick={() => onPitch(Pitches.INPLAY_OUTFIELD_OUT_TAG_FAIL)}>Fly Out <div>runner thrown out</div></button >
            <button className="pitch-btn" style={{ gridArea: 'L' }} onClick={() => onPitch(Pitches.INPLAY_INFIELD_SINGLE)}>1B <div>(infield)</div></button >
            <button className="pitch-btn" style={{ gridArea: 'single' }} onClick={() => onPitch(Pitches.INPLAY_OUTFIELD_SINGLE)}>1B</button>
            <button className="pitch-btn" style={{ gridArea: 'double' }} onClick={() => onPitch(Pitches.INPLAY_DOUBLE)}>2B</button>
            <button className="pitch-btn" style={{ gridArea: 'triple' }} onClick={() => onPitch(Pitches.INPLAY_TRIPLE)}>3B</button>
            <button className="pitch-btn" style={{ gridArea: 'H' }} onClick={() => onPitch(Pitches.INPLAY_HOMERUN)}>HR</button>
        </div >
    );
};

export default PitchSelector;
