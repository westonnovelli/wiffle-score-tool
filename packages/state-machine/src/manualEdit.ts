import mergeDeepRight from "ramda/src/mergeDeepRight.js";
import omit from "ramda/src/omit.js";
import { BattingOrder, DeepPartial, GameMoment, Score } from "./types";

type LooseBoxScore = ({ homeTeam?: number | undefined, awayTeam?: number | undefined } | undefined)[] | undefined;
const isValidBoxScore = (candidate: LooseBoxScore): candidate is Score[] => {
    return candidate?.every((box) => Boolean(box && box.awayTeam && box.awayTeam >= 0 && box.homeTeam && box.homeTeam >= 0)) ?? false;
};

type LooseBattingOrder = (string | undefined)[] | undefined;
const isValidLineup = (candidate: LooseBattingOrder): candidate is BattingOrder => {
    return candidate?.every((name) => typeof name === 'string') ?? false;
};

const manualEdit = (game: GameMoment, edit: DeepPartial<GameMoment>): GameMoment => {
    // TODO merge team edits, despite lineup snafu
    const merged: GameMoment = {
        ...mergeDeepRight(game, omit(['boxScore', 'homeTeam', 'awayTeam'], edit)),
        pitches: [...game.pitches, -1],
        manualEdits: [...game.manualEdits, edit],
    };
    if (isValidBoxScore(edit.boxScore)) {
        merged.boxScore = edit.boxScore;
    }
    if (edit.homeTeam && isValidLineup(edit.homeTeam.lineup)) {
        merged.homeTeam.lineup = edit.homeTeam.lineup;
    }
    if (edit.awayTeam && isValidLineup(edit.awayTeam.lineup)) {
        merged.awayTeam.lineup = edit.awayTeam.lineup;
    }
    return merged;
};

export default manualEdit;
