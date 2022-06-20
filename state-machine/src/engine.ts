import { GameMoment, InningHalf, Pitches, Position, Team } from "./types";
import { defaultGame, defaultPlayer } from "./factory";
import { pitch } from "./gameReducer";
import { defenseStats, offenseStats } from "./statsReducer";
import { log } from "./pitchLog";

let game = defaultGame();
let homeTeam: Team = {
    roster: {
        'player1': defaultPlayer('player1'),
        'player2': defaultPlayer('player2'),
        'player3': defaultPlayer('player3'),
    },
    lineup: [
        'player1',
        'player2',
        'player3',
    ],
    defense: {
        pitcher: 'player1',
        fielders: [{
            player: 'player2',
            position: Position.Infield,
        }, {
            player: 'player3',
            position: Position.Outfield,
        }],
        bench: []
    },
};

let awayTeam: Team = {
    roster: {
        'playerA': defaultPlayer('playerA'),
        'playerB': defaultPlayer('playerB'),
        'playerC': defaultPlayer('playerC'),
    },
    lineup: [
        'playerA',
        'playerB',
        'playerC',
    ],
    defense: {
        pitcher: 'playerA',
        fielders: [{
            player: 'playerB',
            position: Position.Infield,
        }, {
            player: 'playerC',
            position: Position.Outfield,
        }],
        bench: []
    },
};

const determineTeams = (game: GameMoment, homeTeam: Team, awayTeam: Team): { offense: Team, defense: Team } => {
    if (game.inning.half === InningHalf.TOP) {
        return { offense: awayTeam, defense: homeTeam };
    }
    return { offense: homeTeam, defense: awayTeam };
}

const handlePitch = (thrownPitch: Pitches) => {
    const { offense, defense } = determineTeams(game, homeTeam, awayTeam);
    game = pitch(log(game, thrownPitch), thrownPitch);
    // wtf is this... X-0
    if (offense === homeTeam) {
        homeTeam = offenseStats(offense, game, thrownPitch);
        awayTeam = defenseStats(defense, game, thrownPitch);   
    } else {
        awayTeam = offenseStats(offense, game, thrownPitch);
        homeTeam = defenseStats(defense, game, thrownPitch);
    }
};
