import React from "react";
import MenuItem from "../components/MenuItem";
import Structure from "./Structure";
import './Export.css';
import { GameMoment } from "@wiffleball/state-machine";
import { Download } from "../icons";
import { generateBattingCSV } from "../statscsv";

interface Props {
    game: GameMoment;
}

const Export: React.FC<Props> = ({ game }) => {
    const downloadBatting = generateBattingCSV(game);
    const downloadPitching = '';
    
    return (
        <Structure className="manage-export" title={<h1>Export Stats</h1>}>
            <ul>
                <MenuItem as="a" href={encodeURI(downloadBatting)} download="battingStats.csv" label="Batting" icon={<Download/>} />
                <MenuItem as="a" href={encodeURI(downloadPitching)} download="pitchingStats.csv" label="Pitching" icon={<Download/>} description="coming soon" />
            </ul>
        </Structure>
    );
};

export default Export;
