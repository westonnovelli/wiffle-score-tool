import { mergeDeepRight } from "ramda";
import { fielderRotate, fielderSwap, pitcherSwap } from "./commonEdits";
import { defaultGame } from "../factory";
import { DeepPartial, GameMoment, Position } from "../types";

describe('[swap]', () => {
    test('bench:pitching', () => {
        const initial = defaultGame();
        const diff: DeepPartial<GameMoment> = {
            homeTeam: {
                defense: {
                    4: Position.Bench,
                    7: Position.Pitcher,
                }
            }
        };

        expect(pitcherSwap(initial, '7')).toEqual(
            mergeDeepRight(initial, { ...diff, pitches: [-1], manualEdits: [diff] })
        );
    });

    test('field:pitching', () => {
        const initial = defaultGame();
        const diff: DeepPartial<GameMoment> = {
            homeTeam: {
                defense: {
                    5: Position.Pitcher,
                    4: Position.Infield,
                }
            }
        };

        expect(pitcherSwap(initial, '5')).toEqual(
            mergeDeepRight(initial, { ...diff, pitches: [-1], manualEdits: [diff] })
        );
    });

    test('bench:field', () => {
        const initial = defaultGame();
        const diff: DeepPartial<GameMoment> = {
            homeTeam: {
                defense: {
                    7: Position.Infield,
                    5: Position.Bench,
                }
            }
        };

        expect(fielderSwap(initial, '7', '5')).toEqual(
            mergeDeepRight(initial, { ...diff, pitches: [-1], manualEdits: [diff] })
        );
    });

    test('field:field', () => {
        const initial = defaultGame();
        const diff: DeepPartial<GameMoment> = {
            homeTeam: {
                defense: {
                    5: Position.Outfield,
                    6: Position.Infield,
                }
            }
        };

        expect(fielderSwap(initial, '6', '5')).toEqual(
            mergeDeepRight(initial, { ...diff, pitches: [-1], manualEdits: [diff] })
        );
    });
});

describe('[three way]', () => {
    test('bench->fielder->fielder->bench', () => {
        const initial = defaultGame();
        const diff: DeepPartial<GameMoment> = {
            homeTeam: {
                defense: {
                    7: Position.Infield,
                    5: Position.Outfield,
                    6: Position.Bench,
                }
            }
        };

        expect(fielderRotate(initial, '7', '5', '6')).toEqual(
            mergeDeepRight(initial, { ...diff, pitches: [-1], manualEdits: [diff] })
        );
    });

    test('bench->pitcher->fielder->bench', () => {
        const initial = defaultGame();
        const diff: DeepPartial<GameMoment> = {
            homeTeam: {
                defense: {
                    7: Position.Pitcher,
                    4: Position.Infield,
                    5: Position.Bench,
                }
            }
        };

        expect(fielderRotate(initial, '7', '4', '5')).toEqual(
            mergeDeepRight(initial, { ...diff, pitches: [-1], manualEdits: [diff] })
        );
    });

    test('fielder->pitcher->bench->fielder', () => {
        const initial = defaultGame();
        const diff: DeepPartial<GameMoment> = {
            homeTeam: {
                defense: {
                    5: Position.Pitcher,
                    7: Position.Infield,
                    4: Position.Bench,
                }
            }
        };

        expect(fielderRotate(initial, '5', '4', '7')).toEqual(
            mergeDeepRight(initial, { ...diff, pitches: [-1], manualEdits: [diff] })
        );
    });

    test('fielder->pitcher->fielder->fielder', () => {
        const initial = defaultGame();
        const diff: DeepPartial<GameMoment> = {
            homeTeam: {
                defense: {
                    5: Position.Pitcher,
                    6: Position.Infield,
                    4: Position.Outfield,
                }
            }
        };

        expect(fielderRotate(initial, '5', '4', '6')).toEqual(
            mergeDeepRight(initial, { ...diff, pitches: [-1], manualEdits: [diff] })
        );
    });

    test('fielder->pitcher->bench->fielder(->fielder)', () => {
        const initial = defaultGame();
        const diff: DeepPartial<GameMoment> = {
            homeTeam: {
                defense: {
                    6: Position.Pitcher,
                    7: Position.Infield,
                    5: Position.Outfield,
                    4: Position.Bench,
                }
            }
        };

        expect(fielderRotate(initial, '6', '4', '7', '5')).toEqual(
            mergeDeepRight(initial, { ...diff, pitches: [-1], manualEdits: [diff] })
        );
    });
});
