import { mergeDeepRight } from 'ramda';
import { defaultGame, defaultPlayer } from './factory';
import manualEdit from './manualEdit';
import { Bases, InningHalf, OptionalRules, Position } from './types';

test('manual edits work for empty edit', () => {
    const initial = defaultGame();
    const edit = {};

    expect(manualEdit(initial, edit)).toEqual(initial);
});

test('edit outs', () => {
    const initial = defaultGame();
    const edit = { outs: 2 };

    expect(manualEdit(initial, edit)).toEqual(mergeDeepRight(initial, { ...edit, pitches: [-1], manualEdits: [edit] }))
});

test('edit atBat', () => {
    const initial = defaultGame();
    const edit = { atBat: '2' };

    expect(manualEdit(initial, edit)).toEqual(mergeDeepRight(initial, { ...edit, pitches: [-1], manualEdits: [edit] }))
});

test('edit nextHalfAtBat', () => {
    const initial = defaultGame();
    const edit = { nextHalfAtBat: '2' };

    expect(manualEdit(initial, edit)).toEqual(mergeDeepRight(initial, { ...edit, pitches: [-1], manualEdits: [edit] }))
});

test('edit count - balls', () => {
    const initial = defaultGame();
    const edit = { count: { balls: 2 } };

    expect(manualEdit(initial, edit)).toEqual(mergeDeepRight(initial, { ...edit, pitches: [-1], manualEdits: [edit] }))
});

test('edit count - strikes', () => {
    const initial = defaultGame();
    const edit = { count: { strikes: 2 } };

    expect(manualEdit(initial, edit)).toEqual(mergeDeepRight(initial, { ...edit, pitches: [-1], manualEdits: [edit] }))
});

test('edit inning - number', () => {
    const initial = defaultGame();
    const edit = { inning: { number: 2 } };

    expect(manualEdit(initial, edit)).toEqual(mergeDeepRight(initial, { ...edit, pitches: [-1], manualEdits: [edit] }))
});

test('edit inning - half', () => {
    const initial = defaultGame();
    const edit = { inning: { half: InningHalf.BOTTOM } };

    expect(manualEdit(initial, edit)).toEqual(mergeDeepRight(initial, { ...edit, pitches: [-1], manualEdits: [edit] }))
});

test('edit bases - 1st', () => {
    const initial = defaultGame();
    const edit = { bases: { [Bases.FIRST]: 1 } };

    expect(manualEdit(initial, edit)).toEqual(mergeDeepRight(initial, { ...edit, pitches: [-1], manualEdits: [edit] }))
});

test('edit bases - 2nd', () => {
    const initial = defaultGame();
    const edit = { bases: { [Bases.SECOND]: 1 } };

    expect(manualEdit(initial, edit)).toEqual(mergeDeepRight(initial, { ...edit, pitches: [-1], manualEdits: [edit] }))
});

test('edit bases - 3rd', () => {
    const initial = defaultGame();
    const edit = { bases: { [Bases.THIRD]: 1 } };

    expect(manualEdit(initial, edit)).toEqual(mergeDeepRight(initial, { ...edit, pitches: [-1], manualEdits: [edit] }))
});

test('edit bases - loaded', () => {
    const initial = defaultGame();
    const edit = { bases: { [Bases.FIRST]: 1, [Bases.SECOND]: 1, [Bases.THIRD]: 1 } };

    expect(manualEdit(initial, edit)).toEqual(mergeDeepRight(initial, { ...edit, pitches: [-1], manualEdits: [edit] }))
});

test('edit gameOver', () => {
    const initial = defaultGame();
    const edit = { gameOver: true };

    expect(manualEdit(initial, edit)).toEqual(mergeDeepRight(initial, { ...edit, pitches: [-1], manualEdits: [edit] }))
});

test('edit configuration - maxStrikes', () => {
    const initial = defaultGame();
    const edit = { configuration: { maxStrikes: 5 } };

    expect(manualEdit(initial, edit)).toEqual(mergeDeepRight(initial, { ...edit, pitches: [-1], manualEdits: [edit] }))
});

test('edit configuration - maxBalls', () => {
    const initial = defaultGame();
    const edit = { configuration: { maxBalls: 6 } };

    expect(manualEdit(initial, edit)).toEqual(mergeDeepRight(initial, { ...edit, pitches: [-1], manualEdits: [edit] }))
});

test('edit configuration - maxOuts', () => {
    const initial = defaultGame();
    const edit = { configuration: { maxOuts: 5 } };

    expect(manualEdit(initial, edit)).toEqual(mergeDeepRight(initial, { ...edit, pitches: [-1], manualEdits: [edit] }))
});

test('edit configuration - maxRuns', () => {
    const initial = defaultGame();
    const edit = { configuration: { maxRuns: 7 } };

    expect(manualEdit(initial, edit)).toEqual(mergeDeepRight(initial, { ...edit, pitches: [-1], manualEdits: [edit] }))
});

test('edit configuration - maxInnings', () => {
    const initial = defaultGame();
    const edit = { configuration: { maxInnings: 9 } };

    expect(manualEdit(initial, edit)).toEqual(mergeDeepRight(initial, { ...edit, pitches: [-1], manualEdits: [edit] }))
});

test('edit configuration - maxFielders', () => {
    const initial = defaultGame();
    const edit = { configuration: { maxFielders: 4 } };

    expect(manualEdit(initial, edit)).toEqual(mergeDeepRight(initial, { ...edit, pitches: [-1], manualEdits: [edit] }))
});

test('edit configuration - allowExtras', () => {
    const initial = defaultGame();
    const edit = { configuration: { allowExtras: true } };

    expect(manualEdit(initial, edit)).toEqual(mergeDeepRight(initial, { ...edit, pitches: [-1], manualEdits: [edit] }))
});

test('edit configuration - recordingStats: boolean;', () => {
    const initial = defaultGame();
    const edit = { configuration: { recordingStats: false } };

    expect(manualEdit(initial, edit)).toEqual(mergeDeepRight(initial, { ...edit, pitches: [-1], manualEdits: [edit] }))
});

test('edit configuration - rules - RunnersAdvanceOnWildPitch', () => {
    const initial = defaultGame();
    const edit = { configuration: { rules: { [OptionalRules.RunnersAdvanceOnWildPitch]: false } } };

    expect(manualEdit(initial, edit)).toEqual(mergeDeepRight(initial, { ...edit, pitches: [-1], manualEdits: [edit] }))
});

test('edit configuration - rules - RunnersAdvanceExtraOn2Outs', () => {
    const initial = defaultGame();
    const edit = { configuration: { rules: { [OptionalRules.RunnersAdvanceExtraOn2Outs]: false } } };

    expect(manualEdit(initial, edit)).toEqual(mergeDeepRight(initial, { ...edit, pitches: [-1], manualEdits: [edit] }))
});

test('edit configuration - rules - CaughtLookingRule', () => {
    const initial = defaultGame();
    const edit = { configuration: { rules: { [OptionalRules.CaughtLookingRule]: false } } };

    expect(manualEdit(initial, edit)).toEqual(mergeDeepRight(initial, { ...edit, pitches: [-1], manualEdits: [edit] }))
});

test('edit configuration - rules - FoulToTheZoneIsStrikeOut', () => {
    const initial = defaultGame();
    const edit = { configuration: { rules: { [OptionalRules.FoulToTheZoneIsStrikeOut]: false } } };

    expect(manualEdit(initial, edit)).toEqual(mergeDeepRight(initial, { ...edit, pitches: [-1], manualEdits: [edit] }))
});

test('edit configuration - rules - ThirdBaseCanTag', () => {
    const initial = defaultGame();
    const edit = { configuration: { rules: { [OptionalRules.ThirdBaseCanTag]: false } } };

    expect(manualEdit(initial, edit)).toEqual(mergeDeepRight(initial, { ...edit, pitches: [-1], manualEdits: [edit] }))
});

test('edit configuration - rules - AllowSinglePlayRunsToPassLimit', () => {
    const initial = defaultGame();
    const edit = { configuration: { rules: { [OptionalRules.AllowSinglePlayRunsToPassLimit]: true } } };

    expect(manualEdit(initial, edit)).toEqual(mergeDeepRight(initial, { ...edit, pitches: [-1], manualEdits: [edit] }))
});

test('edit configuration - rules - InFieldFly', () => {
    const initial = defaultGame();
    const edit = { configuration: { rules: { [OptionalRules.InFieldFly]: true } } };

    expect(manualEdit(initial, edit)).toEqual(mergeDeepRight(initial, { ...edit, pitches: [-1], manualEdits: [edit] }))
});

test('edit awayTeam - roster', () => {
    const initial = defaultGame();
    const edit = { awayTeam: { roster: { '100': defaultPlayer() } } };

    expect(manualEdit(initial, edit)).toEqual(mergeDeepRight(initial, { ...edit, pitches: [-1], manualEdits: [edit] }))
});

test('edit awayTeam - defense', () => {
    const initial = defaultGame();
    const edit = { awayTeam: { defense: { '1': Position.Bench } } };

    expect(manualEdit(initial, edit)).toEqual(mergeDeepRight(initial, { ...edit, pitches: [-1], manualEdits: [edit] }))
});

test('edit homeTeam - roster', () => {
    const initial = defaultGame();
    const edit = { homeTeam: { roster: { '100': defaultPlayer() } } };

    expect(manualEdit(initial, edit)).toEqual(mergeDeepRight(initial, { ...edit, pitches: [-1], manualEdits: [edit] }))
});

test('edit homeTeam - defense', () => {
    const initial = defaultGame();
    const edit = { homeTeam: { defense: { '5': Position.Bench } } };

    expect(manualEdit(initial, edit)).toEqual(mergeDeepRight(initial, { ...edit, pitches: [-1], manualEdits: [edit] }))
});

test('edit awayTeam - lineup', () => {
    const initial = defaultGame();
    const edit = { awayTeam: { lineup: ['1', '0', '4', '3'] } };

    expect(manualEdit(initial, edit)).toEqual(mergeDeepRight(initial, {
        ...edit,
        awayTeam: { lineup: edit.awayTeam.lineup },
        pitches: [-1],
        manualEdits: [edit],
    }))
});

test('edit homeTeam - lineup', () => {
    const initial = defaultGame();
    const edit = { homeTeam: { lineup: ['7', '6', '5', '4'] } };

    expect(manualEdit(initial, edit)).toEqual(mergeDeepRight(initial, {
        ...edit,
        homeTeam: { lineup: edit.homeTeam.lineup },
        pitches: [-1],
        manualEdits: [edit],
    }))
});

test('edit boxScore', () => {
    const initial = defaultGame();
    const edit = { boxScore: [{ homeTeam: 0, awayTeam: 0 }, { homeTeam: 1, awayTeam: 2 }, { homeTeam: 4, awayTeam: 2 }] };

    expect(manualEdit(initial, edit)).toEqual(mergeDeepRight(initial, {
        ...edit,
        boxScore: edit.boxScore,
        pitches: [-1],
        manualEdits: [edit],
    }))
});
