import React from "react";
import { GameMoment, Pitches } from "@wiffleball/state-machine";

interface Props {
    game: GameMoment;
}

const Feed: React.FC<Props> = ({ game }) => {
    return (
        <div className="feed">
            {game.pitches.length && (
                <div>
                    <label>Last Pitch:</label>
                    {' '}
                    {Pitches[game.pitches[game.pitches.length - 1]]}
                </div>
            )}
        </div>
    );
};

export default Feed;
