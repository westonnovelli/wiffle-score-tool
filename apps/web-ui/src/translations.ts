import { OptionalRules, Position } from "@wiffleball/state-machine";

export const allPositions = [
    { label: 'Pitcher', value: Position.Pitcher },
    { label: 'Infield', value: Position.Infield },
    { label: 'Outfield', value: Position.Outfield },
    { label: 'Bench', value: Position.Bench },
];

interface RuleTranslation {
    value: OptionalRules;
    label: string;
    description: string;
}

export const rules: RuleTranslation[] = [
    {
        value: OptionalRules.RunnersAdvanceOnWildPitch,
        label: 'Runners advance on wild pitch',
        description: ''
    },

    {
        value: OptionalRules.RunnersAdvanceExtraOn2Outs,
        label: 'Runners advance extra on 2 outs',
        description: 'Runners will advance an additional base when there are 2 outs'
    },
    {
        value: OptionalRules.CaughtLookingRule,
        label: 'Caught Looking Rule',
        description: 'If the batter takes a strike looking, its an immediate strikeout'
    },
    {
        value: OptionalRules.FoulToTheZoneIsStrikeOut,
        label: 'A 2 strike foul tip into the zone is a strikeout',
        description: 'On 2 strikes a foul ball that hits the strike zone (before anything else) is a strikeout'
    },
    {
        value: OptionalRules.ThirdBaseCanTag,
        label: 'Runner on 3rd can tag',
        description: 'With less than 2 outs, a runner on 3rd can tag and advance on a fly ball (caught)'
    },
    {
        value: OptionalRules.AllowSinglePlayRunsToPassLimit,
        label: 'Allow single plays to pass run limit',
        description: 'If a single play scores multiple runs (i.e. a grand slam), do NOT limit the scored runs to the run limit (i.e. score all 4)'
    },
    {
        value: OptionalRules.InFieldFly,
        label: 'Infield Fly Rule',
        description: 'The batting team can call an infield fly on an infield popup, batter is immediately out, runners do not advance'
    },
    {
        value: OptionalRules.DoubleRunLimitInLastInning,
        label: 'Double run limit in last inning',
        description: 'In the top and bottom of the last inning, the run limit is doubled'
    },
];
