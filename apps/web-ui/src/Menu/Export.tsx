import React from "react";
import MenuItem from "../components/MenuItem";
import Structure from "../components/Structure";
import PageHeader from "../components/PageHeader";
import { Download } from "../icons";
import './Export.css';
import { GameMoment } from "@wiffleball/state-machine";
import { generateBattingCSV, generatePitchingCSV } from "../statscsv";

interface Props {
    game: GameMoment;
}

const Export: React.FC<Props> = ({ game }) => {
    const downloadBatting = generateBattingCSV(game);
    const downloadPitching = generatePitchingCSV(game);

    return (
        <Structure className="manage-export" wftitle={<PageHeader title="Export Stats"/>}>
            <ul>
                <MenuItem as="a" href={encodeURI(downloadBatting)} download="battingStats.csv" label="Batting" icon={<Download/>} />
                <MenuItem as="a" href={encodeURI(downloadPitching)} download="pitchingStats.csv" label="Pitching" icon={<Download/>} />
            </ul>
        </Structure>
    );
};

export default Export;
