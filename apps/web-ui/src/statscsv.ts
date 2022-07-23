import {
    GameMoment,
    Player,
    battingAverage,
    extraBaseHit,
    groundOutToAirOutRatio,
    onBasePercentage,
    onBasePlusSlugging,
    sluggingPercentage,
    totalBases
} from "@wiffleball/state-machine";

const battingHeaders = [
    'player id',
    'name',
    'plate appearances',
    'hits',
    'at bats',
    'walks',
    'strikeouts swinging',
    'strikeouts looking',
    'singles',
    'doubles',
    'triples',
    'homeruns',
    'groundouts',
    'hit into double plays',
    'hit into fielder\'s choice',
    'flyouts',
    'RBI',
    'LOB',
    'batting average',
    'on base percentage',
    'slugging percentage',
    'OPS',
    'extra base hits',
    'total bases',
    'ground out to air out ratio',
];

const batting = (player: Player) => {
    return [
        player.id,
        player.name,
        player.offenseStats.plateAppearance,
        player.offenseStats.hits,
        player.offenseStats.atbats,
        player.offenseStats.walks,
        player.offenseStats.strikeoutsSwinging,
        player.offenseStats.strikeoutsLooking,
        player.offenseStats.singles,
        player.offenseStats.doubles,
        player.offenseStats.triples,
        player.offenseStats.homeruns,
        player.offenseStats.groundOuts,
        player.offenseStats.doublePlays,
        player.offenseStats.doublePlayFails,
        player.offenseStats.flyOuts,
        player.offenseStats.RBI,
        player.offenseStats.LOB,
        battingAverage(player),
        onBasePercentage(player),
        sluggingPercentage(player),
        onBasePlusSlugging(player),
        extraBaseHit(player),
        totalBases(player),
        groundOutToAirOutRatio(player),
    ];
};

export const generateBattingCSV = (game: GameMoment) => {
    const { homeTeam, awayTeam } = game;

    const homeBatting = Object.values(homeTeam.roster).map(batting);
    const awayBatting = Object.values(awayTeam.roster).map(batting);

    const battingData = [battingHeaders, ...homeBatting, ...awayBatting];

    return 'data:text/csv;charset=utf-8'
     + battingData.map(d => d.join(',')).join('\r\n');
};

