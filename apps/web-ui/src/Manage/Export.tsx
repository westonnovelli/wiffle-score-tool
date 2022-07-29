import React from "react";
import MenuItem from "../components/MenuItem";
import Structure from "./Structure";
import './Export.css';
import { GameMoment } from "@wiffleball/state-machine";
import { Download } from "../icons";
import { generateBattingCSV, generatePitchingCSV } from "../statscsv";

interface Props {
    game: GameMoment;
}

const Export: React.FC<Props> = ({ game }) => {
    const downloadBatting = generateBattingCSV(game);
    const downloadPitching = generatePitchingCSV(game);
    
    return (
        <Structure className="manage-export" title={<h1>Export Stats</h1>}>
            <ul>
                <MenuItem as="a" href={encodeURI(downloadBatting)} download="battingStats.csv" label="Batting" icon={<Download/>} />
                <MenuItem as="a" href={encodeURI(downloadPitching)} download="pitchingStats.csv" label="Pitching" icon={<Download/>} />
            </ul>
        </Structure>
    );
};

export default Export;
