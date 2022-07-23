import React from "react";
import { Collapse } from 'react-collapse';
import { GameMoment } from "@wiffleball/state-machine";
import './Feed.css';
import { Chevron } from "../icons";
import { pitchDescriptions } from "../helpers";

interface Props {
    game: GameMoment;
}

const FEED_LENGTH = 10;

const Feed: React.FC<Props> = ({ game }) => {
    const [recentPitchesOpen, setRecentPitchesOpen] = React.useState(true);
    return game.pitches.length > 0 ? (
        <div className="feed">
            <>
                <button
                    onClick={() => void setRecentPitchesOpen(prev => !prev)}
                    className={recentPitchesOpen ? 'open' : 'closed'}
                >
                    Recent Pitches
                    <Chevron />
                </button>
                <Collapse isOpened={recentPitchesOpen}>
                    <ul>
                        {Array.from(Array(FEED_LENGTH)).map((_, i) => {
                            const index = game.pitches.length - 1 - i;
                            if (index < 0) return null;
                            return (
                                <li key={i}>{pitchDescriptions[game.pitches[Math.max(index, 0)]]}</li>
                            );
                        })}
                    </ul>
                </Collapse>
            </>
        </div>
    ) : null;
};

export default Feed;
