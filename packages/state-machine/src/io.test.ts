import { defaultTeam, newTeam } from "./factory";
import { serializeTeam, deserializeTeam } from "./io";
import { Position, Team } from "./types";

test('a serializedTeam can be deserialized and result in the same team', () => {
    const initial: Team = newTeam([{
        id: '1',
        name: 'joe',
        position: Position.Pitcher,
    }, {
        id: '2',
        name: 'bill',
        position: Position.Infield,
    }, {
        id: '3',
        name: 'kev',
        position: Position.Outfield,
    }]) ?? defaultTeam();

    const saved = serializeTeam(initial);
    expect(deserializeTeam(saved)).toEqual(initial);
});
